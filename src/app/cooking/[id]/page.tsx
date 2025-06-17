'use client';

import { useCookingPresenter } from '@/client/presenters/use-cooking-presenter';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { CookingInstructionCard } from '@/components/ui/cooking-instruction-card';
import { FixedBottomButton } from '@/components/ui/fixed-bottom-button';
import { ProgressBar } from '@/components/ui/instruction-progress';
import { Loading } from '@/components/ui/loading';
import { NoContent } from '@/components/ui/no-content';
import { RecipeCard } from '@/components/ui/recipe-card';
import { useEffect } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const { state, actions } = useCookingPresenter();

  useEffect(() => {
    const fetchRecipeId = async () => {
      const resolvedParams = await params;
      await actions.fetchRecipe(resolvedParams.id);
    };
    fetchRecipeId();
  }, [params, actions]);

  if (state.loading) {
    return <Loading />;
  }

  if (!state.recipe) {
    return <NoContent text="レシピが見つかりません" />;
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <RecipeCard
        variant="row"
        title={state.recipe.title || ''}
        description={state.recipe.description || ''}
        tags={state.recipe.tags || []}
        cookingTime={state.recipe.cookTime || 0}
        imageUrl={
          state.recipe.imageUrl && state.recipe.imageUrl.length > 0
            ? state.recipe.imageUrl
            : 'https://r2.vibe-cooking.furari.co/images/recipe-thumbnails/default.png'
        }
        imageAlt={state.recipe.title || ''}
      />

      <Carousel className="w-[calc(100%-96px)]" setApi={actions.setCarouselApi}>
        <CarouselContent>
          {state.recipe.instructions?.map(instruction => (
            <CarouselItem key={instruction.step}>
              <CookingInstructionCard
                step={instruction.step}
                title={instruction.title}
                description={instruction.description}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <ProgressBar
        totalSteps={state.totalSteps}
        currentStep={state.currentStep + 1}
      />

      <FixedBottomButton
        buttons={[
          {
            href: `/recipes/${state.recipe.id}`,
            children: 'Vibe Cooking をおわる',
          },
        ]}
      />
    </div>
  );
}
