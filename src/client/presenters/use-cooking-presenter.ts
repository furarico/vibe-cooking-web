'use client';

import { useDI } from '@/client/di/providers';
import { SpeechStatus } from '@/client/services/audio-recognition-service';
import { CarouselApi } from '@/components/ui/carousel';
import { Recipe } from '@/lib/api-client';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface CookingPresenterState {
  recipe: Recipe | null;
  carouselApi: CarouselApi | null;
  loading: boolean;
  currentStep: number;
  totalSteps: number;

  // 音声再生状態
  audioStatus: {
    isPlaying: boolean;
    currentAudioUrl: string | null;
  };

  // 音声認識状態
  speechStatus: SpeechStatus;
  transcript: string;
  interimTranscript: string;
  triggerHistory: string[];
}

export interface CookingPresenterActions {
  fetchRecipe: (id: string) => Promise<void>;
  setCurrentStep: (step: number) => void;
  setCarouselApi: (api: CarouselApi) => void;
}

export interface CookingPresenter {
  state: CookingPresenterState;
  actions: CookingPresenterActions;
}

export const useCookingPresenter = (): CookingPresenter => {
  const { audioPlayerService, audioRecognitionService, recipeService } =
    useDI();

  // 状態の初期化
  const [state, setState] = useState<CookingPresenterState>(() => {
    return {
      recipe: null,
      carouselApi: null,
      loading: false,
      currentStep: 0,
      totalSteps: 0,
      speechStatus: audioRecognitionService.getSpeechStatus(),
      transcript: audioRecognitionService.getTranscript(),
      interimTranscript: audioRecognitionService.getInterimTranscript(),
      triggerHistory: audioRecognitionService.getTriggerHistory(),
      audioStatus: {
        isPlaying: audioPlayerService.isPlaying(),
        currentAudioUrl: audioPlayerService.getCurrentAudioUrl(),
      },
    };
  });

  // サービスの状態変更を監視
  useEffect(() => {
    const updateState = () => {
      setState(prev => ({
        ...prev,
        speechStatus: audioRecognitionService.getSpeechStatus(),
        transcript: audioRecognitionService.getTranscript(),
        interimTranscript: audioRecognitionService.getInterimTranscript(),
        triggerHistory: audioRecognitionService.getTriggerHistory(),
        audioStatus: {
          isPlaying: audioPlayerService.isPlaying(),
          currentAudioUrl: audioPlayerService.getCurrentAudioUrl(),
        },
      }));
    };

    audioRecognitionService.addListener(updateState);
    audioPlayerService.addListener(updateState);
  }, [audioRecognitionService, audioPlayerService, state]);

  useEffect(() => {
    actions.setCurrentStep(state.carouselApi?.selectedScrollSnap() ?? 0);
    state.carouselApi?.on('select', () => {
      actions.setCurrentStep(state.carouselApi?.selectedScrollSnap() ?? 0);
    });
  }, [state.carouselApi]);

  useEffect(() => {
    if (!state.carouselApi) return;
    state.carouselApi.scrollTo(state.currentStep);
  }, [state.currentStep]);

  useEffect(() => {
    const playCurrentStepAudio = async () => {
      const audioUrl =
        state.recipe?.instructions?.[state.currentStep]?.audioUrl;
      if (audioUrl) {
        await audioPlayerService.playAudio(audioUrl);
      }
    };
    playCurrentStepAudio();
  }, [state.recipe, state.currentStep]);

  // アクションの定義
  const actions: CookingPresenterActions = {
    // レシピ詳細取得
    fetchRecipe: useCallback(
      async (id: string) => {
        setState(prev => ({ ...prev, loading: true }));
        try {
          const recipe = await recipeService.getRecipeById(id);
          if (!recipe) {
            setState(prev => ({ ...prev, loading: false }));
            toast.error('レシピが見つかりませんでした');
            return;
          }
          const totalSteps = recipe.instructions?.length || 0;
          setState(prev => ({
            ...prev,
            recipe,
            loading: false,
            currentStep: 0,
            totalSteps,
          }));
        } catch {
          setState(prev => ({ ...prev, loading: false }));
          toast.error('レシピの取得に失敗しました');
        }
      },
      [recipeService]
    ),
    setCurrentStep: useCallback(
      (step: number) => {
        setState(prev => ({ ...prev, currentStep: step }));
      },
      [audioPlayerService]
    ),
    setCarouselApi: useCallback((api: CarouselApi) => {
      setState(prev => ({ ...prev, carouselApi: api }));
    }, []),
  };

  return {
    state,
    actions,
  };
};
