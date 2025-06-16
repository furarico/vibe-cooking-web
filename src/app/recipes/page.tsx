'use client';

import { useRecipeListPresenter } from '@/client/presenters/use-recipe-list-presenter';
import { FixedBottomButton } from '@/components/ui/fixed-bottom-button';
import Loading from '@/components/ui/loading';
import { RecipeCard } from '@/components/ui/recipe-card';
import { SelectCount } from '@/components/ui/select-count';
import { getSavedRecipesCount } from '@/lib/local-storage';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';

function RecipesContent() {
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
        <div className="flex flex-col gap-4">
          {recipes.map(recipe => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
              <RecipeCard
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
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default function Page() {
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const updateSavedCount = () => {
      setSavedCount(getSavedRecipesCount());
    };

    updateSavedCount();

    const handleFocus = () => {
      updateSavedCount();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <RecipesContent />
      <FixedBottomButton
        buttons={[
          {
            href: '/recipes/add',
            children: (
              <div className="flex items-center justify-center w-full gap-2">
                <SelectCount count={savedCount} />
                <span>選択中のレシピを表示</span>
              </div>
            ),
            variant: 'ghost',
            className:
              'w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-200',
          },
        ]}
      />
    </Suspense>
  );
}
