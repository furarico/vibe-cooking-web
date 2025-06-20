'use client';

import { useCookingPresenter } from '@/client/presenters/use-cooking-presenter';
import { CookingInstructionCard } from '@/components/cooking-instruction-card';
import { ProgressBar } from '@/components/instruction-progress';
import { RecipeCard } from '@/components/recipe-card';
import { Loading } from '@/components/tools/loading';
import { NoContent } from '@/components/tools/no-content';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { usePageButtons } from '@/hooks/use-buttom-buttons';
import { MicIcon, MicOffIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { state, actions } = useCookingPresenter();
  const searchParams = useSearchParams();

  usePageButtons([
    {
      id: 'end-cooking',
      href: `/recipes/${state.recipe?.id}`,
      children: 'Vibe Cooking をおわる',
    },
  ]);

  useEffect(() => {
    const recipeIds = searchParams.get('recipeIds');
    if (recipeIds) {
      // カンマ区切りのレシピIDを配列に格納
      const recipeIdArray = recipeIds.split(',').filter(id => id.trim() !== '');
      console.log('レシピID配列:', recipeIdArray);

      // 複数のレシピIDがある場合は、最初のレシピIDを使用
      // 将来的には複数レシピの同時調理に対応する予定
      const firstRecipeId = recipeIdArray[0];
      if (firstRecipeId) {
        console.log('使用するレシピID:', firstRecipeId);
        actions.setRecipeId(firstRecipeId);
      }
    }
  }, [searchParams, actions.setRecipeId]);

  if (state.loading) {
    return <Loading text="レシピを構築しています..." />;
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
            : (process.env.NEXT_PUBLIC_DEFAULT_IMAGE_URL ?? '')
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

      {state.audioRecognitionStatus === 'listening' ? (
        <MicIcon className="h-10 w-10 text-green-500" />
      ) : (
        <MicOffIcon className="h-10 w-10 text-red-500" />
      )}
    </div>
  );
}
