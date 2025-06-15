'use client';

import { useCategoryPresenter } from '@/client/presenters/hooks/use-category-presenter';
import { useRecipesByCategoryPresenter } from '@/client/presenters/hooks/use-recipes-by-category-presenter';
import { CategoryRecipeSection } from '@/components/category-recipe-section';
import Loading from '@/components/ui/loading';
import { Suspense, useEffect } from 'react';

export default function Page() {
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
      <Suspense fallback={<Loading />}>
        {Object.keys(recipesByCategory).length === 0 ? (
          <div className="text-center py-12 text-gray-900">
            レシピがみつかりませんでした
          </div>
        ) : (
          <>
            {/* カテゴリ別にレシピを表示 */}
            {categories.map(category => {
              return (
                <CategoryRecipeSection
                  key={category.id}
                  category={category}
                  recipes={recipesByCategory[category.name] ?? []}
                />
              );
            })}
          </>
        )}
      </Suspense>
    </>
  );
}
