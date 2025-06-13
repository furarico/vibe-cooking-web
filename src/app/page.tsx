'use client';

import { useRecipePresenter } from '@/client/presenters/hooks/use-recipe-presenter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RecipeCard } from '@/components/ui/recipe-card';
import { SearchIcon } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Home() {
  const { recipes, loading, error, refreshRecipes } = useRecipePresenter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">レシピを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="w-full max-w-6xl mx-auto min-h-screen">
      {/* ヘッダー */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 w-full">
          <Input
            className="placeholder:text-gray-400"
            placeholder="レシピを検索"
          />
          <Button>
            <SearchIcon className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {recipes.length === 0 ? (
          <div className="text-center py-12 text-gray-900">
            レシピがみつかりませんでした
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {recipes.map(recipe => (
                <Link
                  key={recipe.id}
                  className="flex justify-center"
                  href={`/recipes/${recipe.id}`}
                >
                  <RecipeCard
                    title={recipe.title}
                    description={
                      recipe.description || 'レシピの説明がありません'
                    }
                    tags={recipe.tags || []}
                    cookingTime={
                      (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)
                    }
                    imageUrl={
                      recipe.imageUrl ||
                      'https://picsum.photos/188/98?random=default'
                    }
                    imageAlt={recipe.title}
                    className="cursor-pointer"
                  />
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
