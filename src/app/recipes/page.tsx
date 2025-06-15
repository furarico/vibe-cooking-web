'use client';

import { useRecipeListPresenter } from '@/client/presenters/hooks/use-recipe-list-presenter';
import Loading from '@/components/ui/loading';
import { RecipeCard } from '@/components/ui/recipe-card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo } from 'react';

function RecipeListContent() {
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

  const { recipes, loading, fetchRecipes } = useRecipeListPresenter(filters);

  useEffect(() => {
    fetchRecipes(filters);
  }, [filters, fetchRecipes]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {recipes.length === 0 ? (
        <div className="text-center text-gray-600">
          レシピが見つかりませんでした
        </div>
      ) : (
        <Link href={`/recipes/${recipes[0].id}`} className="space-y-4">
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              variant="row"
              title={recipe.title || ''}
              description={recipe.description || ''}
              tags={recipe.tags || []}
              cookingTime={(recipe.cookTime || 0) + (recipe.prepTime || 0)}
              imageUrl={
                recipe.imageUrl && recipe.imageUrl.length > 0
                  ? recipe.imageUrl
                  : 'https://r2.vibe-cooking.furari.co/images/recipe-thumbnails/default.png'
              }
              imageAlt={recipe.title || 'レシピ画像'}
            />
          ))}
        </Link>
      )}
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <RecipeListContent />
    </Suspense>
  );
}
