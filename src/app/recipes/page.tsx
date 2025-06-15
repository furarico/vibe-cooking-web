'use client';

import { useRecipeListPresenter } from '@/client/presenters/hooks/use-recipe-list-presenter';
import { RecipeCard } from '@/components/ui/recipe-card';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function Page() {
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => ({
      q: searchParams.get('q') || undefined,
      tag: searchParams.get('tag') || undefined,
      category: searchParams.get('category') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
    }),
    [searchParams]
  );

  const { recipes, loading, error, fetchRecipes } =
    useRecipeListPresenter(filters);

  useEffect(() => {
    fetchRecipes(filters);
  }, [filters, fetchRecipes]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">レシピ一覧</h1>

      {recipes.length === 0 ? (
        <div className="text-center text-gray-600">
          レシピが見つかりませんでした
        </div>
      ) : (
        <div className="space-y-4">
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              variant="row"
              title={recipe.title || ''}
              description={recipe.description || ''}
              tags={recipe.tags || []}
              cookingTime={(recipe.cookTime || 0) + (recipe.prepTime || 0)}
              imageUrl={recipe.imageUrl || '/placeholder-recipe.jpg'}
              imageAlt={recipe.title || 'レシピ画像'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
