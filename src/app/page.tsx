'use client';

import { useCategoryPresenter } from '@/client/presenters/hooks/use-category-presenter';
import { useRecipesByCategoryPresenter } from '@/client/presenters/hooks/use-recipes-by-category-presenter';
import Loading from '@/components/ui/loading';
import { RecipeCard } from '@/components/ui/recipe-card';
import Link from 'next/link';
import { useEffect } from 'react';

export const dynamic = 'force-dynamic';

export default function Home() {
  const { categories, loading: categoriesLoading } = useCategoryPresenter();

  const {
    recipesByCategory,
    loading: recipesLoading,
    fetchRecipesForAllCategories,
  } = useRecipesByCategoryPresenter();

  useEffect(() => {
    if (categories.length > 0) {
      const categoryData = categories.map(category => ({
        id: category.id,
        name: category.name,
      }));
      fetchRecipesForAllCategories(categoryData);
    }
  }, [categories, fetchRecipesForAllCategories]);

  const loading = categoriesLoading || recipesLoading;

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {Object.keys(recipesByCategory).length === 0 ? (
        <div className="text-center py-12 text-gray-900">
          レシピがみつかりませんでした
        </div>
      ) : (
        <>
          {/* カテゴリ別にレシピを表示 */}
          {categories.map(category => {
            const categoryRecipes = recipesByCategory[category.name] || [];

            if (categoryRecipes.length === 0) {
              return null;
            }

            return (
              <div key={category.id} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                  {category.name}
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
            );
          })}
        </>
      )}
    </>
  );
}
