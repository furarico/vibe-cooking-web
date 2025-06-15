'use client';

import { useRecipePresenter } from '@/client/presenters/hooks/use-recipe-presenter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/loading';
import { RecipeCard } from '@/components/ui/recipe-card';
import { SearchIcon } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Home() {
  const {
    recipes,
    loading,
    error,
    refreshRecipes,
    searchQuery,
    setSearchQuery,
  } = useRecipePresenter();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <Button onClick={refreshRecipes} variant="outline">
            再試行
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full ">
      {/* ヘッダー */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 w-full">
          <Input
            className="placeholder:text-gray-400"
            placeholder="レシピを検索"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Button asChild>
            <Link href={`/recipes?q=${searchQuery}`}>
              <SearchIcon className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-full px-4 sm:px-6 lg:px-8 py-8">
        {recipes.length === 0 ? (
          <div className="text-center py-12 text-gray-900">
            レシピがみつかりませんでした
          </div>
        ) : (
          <>
            {/* カテゴリ別にレシピを分類 */}
            {Object.entries(
              recipes.reduce(
                (acc, recipe) => {
                  const categoryName = recipe.category?.name ?? 'その他';
                  if (!acc[categoryName]) {
                    acc[categoryName] = [];
                  }
                  acc[categoryName].push(recipe);
                  return acc;
                },
                {} as Record<string, typeof recipes>
              )
            ).map(([categoryName, categoryRecipes]) => (
              <div key={categoryName} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                  {categoryName}
                </h2>
                <div className="overflow-x-auto">
                  <div className="flex gap-4 pb-4">
                    {categoryRecipes.map(recipe => (
                      <Link
                        key={recipe.id}
                        href={`/recipes/${recipe.id}`}
                        className="flex-shrink-0"
                      >
                        <RecipeCard
                          title={recipe.title ?? ''}
                          description={recipe.description ?? ''}
                          tags={recipe.tags ?? []}
                          cookingTime={
                            (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)
                          }
                          imageUrl={
                            recipe.imageUrl && recipe.imageUrl.length > 0
                              ? recipe.imageUrl
                              : 'https://r2.vibe-cooking.furari.co/images/recipe-thumbnails/default.png'
                          }
                          imageAlt={recipe.title ?? ''}
                          className="cursor-pointer h-full"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
