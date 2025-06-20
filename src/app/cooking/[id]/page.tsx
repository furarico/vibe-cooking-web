'use client';

import { useCookingPresenter } from '@/client/presenters/use-cooking-presenter';
import { CookingInstructionCard } from '@/components/cooking-instruction-card';
import { ProgressBar } from '@/components/instruction-progress';
import { Loading } from '@/components/tools/loading';
import { NoContent } from '@/components/tools/no-content';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { CookingStatusCard } from '@/components/ui/cooking-status-card';
import { usePageButton } from '@/hooks/use-buttom-buttons';
import { MicIcon, MicOffIcon } from 'lucide-react';
import { useEffect } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const { state, actions } = useCookingPresenter();

  // 最後のステップかどうかを判別
  const isLastStep = state.currentStep === state.totalSteps - 1;

  useEffect(() => {
    const setRecipeId = async () => {
      const resolvedParams = await params;
      actions.setRecipeId(resolvedParams.id);
    };
    setRecipeId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, actions.setRecipeId]);

  // ボタンの設定
  usePageButton(
    {
      id: 'end-cooking',
      href: `/recipes/${state.recipe?.id}`,
      children: 'Vibe Cooking をおわる',
    },
    [state.recipe?.id]
  );

  if (state.loading) {
    return <Loading />;
  }

  if (!state.recipe) {
    return <NoContent text="レシピが見つかりません" />;
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/*<div className="lg:w-[50%] flex flex-col items-center gap-8">

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
      </div>*/}

      <div className="w-full max-w-[600px] px-4 space-y-4">
        <CookingStatusCard
          recipes={
            state.recipe
              ? [{ id: state.recipe.id, name: state.recipe.title }]
              : []
          }
          activeRecipeId={state.recipe?.id}
        />
      </div>

      <div className="w-full max-w-[680px] flex flex-col items-center gap-8">
        <Carousel
          className="w-[calc(100%-96px)]"
          setApi={actions.setCarouselApi}
        >
          <CarouselContent>
            {state.cards?.map(card => (
              <CarouselItem key={card.step}>
                <CookingInstructionCard
                  step={card.step}
                  title={card.title}
                  description={card.description}
                  imageUrl={card.imageUrl}
                />
              </CarouselItem>
            )) || []}
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
      <div>
        {/* 最後のステップの場合に完了メッセージを表示 */}
        {isLastStep && (
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 font-semibold">
              🎉 料理完成まであと少しです！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
