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
import { MicIcon, MicOffIcon } from 'lucide-react';
import { useEffect } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const { state, actions } = useCookingPresenter();

  useEffect(() => {
    const setRecipeId = async () => {
      const resolvedParams = await params;
      actions.setRecipeId(resolvedParams.id);
    };
    setRecipeId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, actions.setRecipeId]);

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
            : process.env.NEXT_PUBLIC_DEFAULT_IMAGE_URL
        }
        imageAlt={state.recipe.title || ''}
      />

      <Carousel className="w-[calc(100%-96px)]" setApi={actions.setCarouselApi}>
        <CarouselContent>
          {state.cards.map(card => (
            <CarouselItem key={card.step}>
              <CookingInstructionCard
                step={card.step}
                title={card.title}
                description={card.description}
                imageUrl={card.imageUrl}
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

      {state.speechStatus === 'listening' ? (
        <MicIcon className="h-10 w-10 text-green-500" />
      ) : (
        <MicOffIcon className="h-10 w-10 text-red-500" />
      )}

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
