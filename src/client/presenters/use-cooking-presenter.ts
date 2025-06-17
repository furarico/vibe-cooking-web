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
  playCurrentStepAudio: () => Promise<void>;
  stopAudio: () => void;
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
          setState(prev => ({
            ...prev,
            recipe,
            loading: false,
            currentStep: 0,
            totalSteps: recipe.instructions?.length ?? 0,
          }));
        } catch {
          setState(prev => ({ ...prev, loading: false }));
          toast.error('レシピの取得に失敗しました');
        }
      },
      [recipeService]
    ),
    setCurrentStep: useCallback((step: number) => {
      setState(prev => ({ ...prev, currentStep: step }));
    }, []),
    setCarouselApi: useCallback((api: CarouselApi) => {
      setState(prev => ({ ...prev, carouselApi: api }));
    }, []),
    playCurrentStepAudio: useCallback(async () => {
      const audioUrl =
        state.recipe?.instructions?.[state.currentStep]?.audioUrl;
      if (audioUrl) {
        try {
          await audioPlayerService.playAudio(audioUrl);
        } catch (error) {
          console.warn('Audio playback failed:', error);
          toast.error('音声の再生に失敗しました');
        }
      }
    }, [state.recipe, state.currentStep, audioPlayerService]),
    stopAudio: useCallback(() => {
      audioPlayerService.stopAudio();
    }, [audioPlayerService]),
  };

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

    return () => {
      audioRecognitionService.removeListener(updateState);
      audioPlayerService.removeListener(updateState);
    };
  }, [audioRecognitionService, audioPlayerService]);

  useEffect(() => {
    if (!state.carouselApi) return;

    const updateCurrentStep = () => {
      const selectedIndex = state.carouselApi?.selectedScrollSnap() ?? 0;
      setState(prev => ({ ...prev, currentStep: selectedIndex }));
    };

    // 初期設定
    updateCurrentStep();

    // イベントリスナー登録
    state.carouselApi.on('select', updateCurrentStep);

    return () => {
      state.carouselApi?.off('select', updateCurrentStep);
    };
  }, [state.carouselApi]);

  useEffect(() => {
    if (!state.carouselApi) return;
    state.carouselApi.scrollTo(state.currentStep);
  }, [state.carouselApi, state.currentStep]);

  return {
    state,
    actions,
  };
};
