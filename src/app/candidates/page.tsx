'use client';
import { useCandidatesPresenter } from '@/client/presenters/use-candidates-persenter';
import { IngredientsChecklist } from '@/components/ingredients-checklist';
import { RecipeCard } from '@/components/recipe-card';
import { Loading } from '@/components/tools/loading';
import { NoContent } from '@/components/tools/no-content';
import { usePageButtons } from '@/hooks/use-buttom-buttons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { state, actions } = useCandidatesPresenter();
  const router = useRouter();

  usePageButtons(
    [
      {
        id: 'start-cooking',
        onClick: () => {
          const recipeIds = state.recipes.map(recipe => recipe.id).join(',');
          router.push(`/cooking?recipeIds=${recipeIds}`);
        },
        children: 'Vibe Cookingを始める',
        variant: 'default',
      },
    ],
    [state.recipes]
  );

  if (state.loading) {
    return <Loading />;
  }

  if (state.recipes.length === 0) {
    return <NoContent text="調理するレシピがありません" />;
  }

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row">
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
        <IngredientsChecklist
          recipeIds={state.recipes.map(recipe => recipe.id)}
        />
      </div>
    </>
  );
}
