'use client';

import { useRecipeListPresenter } from '@/client/presenters/use-recipe-list-presenter';
import { FixedBottomButton } from '@/components/ui/fixed-bottom-button';
import { Loading } from '@/components/ui/loading';
import { NoContent } from '@/components/ui/no-content';
import { RecipeCard } from '@/components/ui/recipe-card';
import { SelectCount } from '@/components/ui/select-count';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';

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

  const { state } = useRecipeListPresenter(filters);

  if (state.loading) {
    return <Loading />;
  }

  return (
    <>
      {state.recipes.length === 0 ? (
        <NoContent text="レシピが見つかりませんでした" />
      ) : (
        <div className="flex flex-col gap-4">
          {state.recipes.map(recipe => (
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
                    : (process.env.NEXT_PUBLIC_DEFAULT_IMAGE_URL ?? '')
                }
                imageAlt={recipe.title || 'レシピ画像'}
              />
            </Link>
          ))}
        </div>
      )}
      <FixedBottomButton
        buttons={[
          {
            href: '/candidates',
            children: (
              <div className="flex items-center justify-center w-full gap-2">
                <SelectCount count={state.vibeCookingRecipeIds.length} />
                <span>Vibe Cooking リスト</span>
              </div>
            ),
            variant: 'ghost',
            className:
              'w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-200',
          },
        ]}
      />
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <RecipesContent />
    </Suspense>
  );
}
