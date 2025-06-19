'use client';
import { useCandidatesPresenter } from '@/client/presenters/use-candidates-persenter';
import { RecipeCard } from '@/components/recipe-card';
import { Loading } from '@/components/tools/loading';
import { NoContent } from '@/components/tools/no-content';
import { usePageButtons } from '@/hooks/use-buttom-buttons';
import Link from 'next/link';

export default function Page() {
  const { state, actions } = useCandidatesPresenter();

  usePageButtons([
    {
      id: 'start-cooking',
      href: `/recipes/cooking?recipeIds=${state.recipes.map(recipe => recipe.id).join(',')}`,
      children: 'Vibe Cookingを始める',
      variant: 'default',
    },
  ]);

  if (state.loading) {
    return <Loading />;
  }

  if (state.recipes.length === 0) {
    return <NoContent text="調理するレシピがありません" />;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {state.recipes.map(recipe => (
          <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
            <RecipeCard
              variant="row"
              title={recipe.title ?? ''}
              description={recipe.description ?? ''}
              tags={recipe.tags ?? []}
              cookingTime={(recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)}
              imageUrl={
                recipe.imageUrl && recipe.imageUrl.length > 0
                  ? recipe.imageUrl
                  : (process.env.NEXT_PUBLIC_DEFAULT_IMAGE_URL ?? '')
              }
              imageAlt={recipe.title ?? ''}
              onDelete={() => recipe.id && actions.onDeleteRecipe(recipe.id)}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
