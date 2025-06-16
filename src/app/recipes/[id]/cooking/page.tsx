'use client';

import { useCookingPresenter } from '@/client/presenters/use-cooking-presenter';
import { useVoiceCookingPresenter } from '@/client/presenters/use-voice-cooking-presenter';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { CookingInstructionCard } from '@/components/ui/cooking-instruction-card';
import { FixedBottomButton } from '@/components/ui/fixed-bottom-button';
import { ProgressBar } from '@/components/ui/instruction-progress';
import Loading from '@/components/ui/loading';
import { RecipeCard } from '@/components/ui/recipe-card';
import { useEffect, useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const [recipeId, setRecipeId] = useState<string>('');
  const [api, setApi] = useState<CarouselApi>();
  const {
    recipe,
    loading,
    currentStep,
    totalSteps,
    fetchRecipe,
    setCurrentStep,
  } = useCookingPresenter();
  const { actions } = useVoiceCookingPresenter();

  useEffect(() => {
    const fetchRecipeId = async () => {
      const resolvedParams = await params;
      setRecipeId(resolvedParams.id);
    };
    fetchRecipeId();
  }, [params]);

  useEffect(() => {
    if (!recipeId) return;
    fetchRecipe(recipeId);
  }, [recipeId, fetchRecipe]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setCurrentStep(selectedIndex);
      const currentInstruction = recipe?.instructions?.find(
        instruction => instruction.step === selectedIndex + 1
      );
      const audioUrl = currentInstruction?.audioUrl;
      console.log('Current instruction audio URL:', audioUrl);
      if (audioUrl) {
        actions.playAudio(audioUrl);
      }
    };

    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api, setCurrentStep, recipe?.instructions, currentStep, actions]);

  // プレゼンターのcurrentStepが変更されたときにカルーセルを同期
  useEffect(() => {
    if (!api) return;
    api.scrollTo(currentStep);
  }, [api, currentStep]);

  if (loading) {
    return <Loading />;
  }

  if (!recipe) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-lg text-gray-600">レシピが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <RecipeCard
        variant="row"
        title={recipe.title || ''}
        description={recipe.description || ''}
        tags={recipe.tags || []}
        cookingTime={recipe.cookTime || 0}
        imageUrl={
          recipe.imageUrl && recipe.imageUrl.length > 0
            ? recipe.imageUrl
            : 'https://r2.vibe-cooking.furari.co/images/recipe-thumbnails/default.png'
        }
        imageAlt={recipe.title || ''}
      />

      <Carousel className="w-[calc(100%-96px)]" setApi={setApi}>
        <CarouselContent>
          {recipe.instructions?.map(instruction => (
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

      <ProgressBar totalSteps={totalSteps} currentStep={currentStep + 1} />

      <FixedBottomButton
        buttons={[
          {
            href: `/recipes/${recipeId}`,
            children: 'Vibe Cooking をおわる',
          },
        ]}
      />
    </div>
  );
}
