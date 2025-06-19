'use client';

import { useDI } from '@/client/di/providers';
import { AudioPlayerStatus } from '@/client/services/audio-player-service';
import {
  AudioRecognitionStatus,
  TriggerType,
} from '@/client/services/audio-recognition-service';
import { CarouselApi } from '@/components/ui/carousel';
import { CookingInstructionCardProps } from '@/components/ui/cooking-instruction-card';
import { Recipe } from '@/lib/api-client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export interface CookingPresenterState {
  recipeId: string | null;
  recipe: Recipe | null;
  carouselApi: CarouselApi | null;
  loading: boolean;
  currentStep: number;
  totalSteps: number;
  cards: CookingInstructionCardProps[];

  // 音声再生状態
  audioPlayerStatus: AudioPlayerStatus;

  // 音声認識状態
  audioRecognitionStatus: AudioRecognitionStatus;
  triggerType: TriggerType | null;
}

export interface CookingPresenterActions {
  setRecipeId: (id: string) => void;
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
      recipeId: null,
      recipe: null,
      carouselApi: null,
      loading: false,
      currentStep: 0,
      totalSteps: 0,
      cards: [],
      audioPlayerStatus: audioPlayerService.getAudioPlayerStatus(),
      audioRecognitionStatus:
        audioRecognitionService.getAudioRecognitionStatus(),
      triggerType: audioRecognitionService.getTriggerType(),
    };
  });

  // レシピ取得関数
  const fetchRecipe = useCallback(
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
          cards:
            recipe.instructions?.map(instruction => ({
              step: instruction.step,
              title: instruction.title,
              description: instruction.description,
              imageUrl: instruction.imageUrl ?? null,
            })) ?? [],
        }));
      } catch {
        setState(prev => ({ ...prev, loading: false }));
        toast.error('レシピの取得に失敗しました');
      }
    },
    [recipeService]
  );

  const playCurrentStepAudio = useCallback(async () => {
    const audioUrl = state.recipe?.instructions?.[state.currentStep]?.audioUrl;
    if (audioUrl) {
      try {
        await audioPlayerService.playAudio(audioUrl);
      } catch {
        toast.error('音声の再生に失敗しました');
      }
    }
  }, [state.recipe, state.currentStep, audioPlayerService]);

  // アクションの定義
  const actions: CookingPresenterActions = useMemo(
    () => ({
      // レシピ詳細取得
      setRecipeId: (id: string) => {
        setState(prev => ({ ...prev, recipeId: id }));
      },
      fetchRecipe,
      setCurrentStep: (step: number) => {
        setState(prev => ({ ...prev, currentStep: step }));
      },
      setCarouselApi: (api: CarouselApi) => {
        setState(prev => ({ ...prev, carouselApi: api }));
      },
    }),
    [fetchRecipe]
  );

  // サービスの状態変更を監視
  useEffect(() => {
    const updateState = () => {
      setState(prev => ({
        ...prev,
        audioPlayerStatus: audioPlayerService.getAudioPlayerStatus(),
        audioRecognitionStatus:
          audioRecognitionService.getAudioRecognitionStatus(),
        triggerType: audioRecognitionService.getTriggerType(),
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
    const id = state.recipeId;
    if (!id) {
      return;
    }
    fetchRecipe(id);
  }, [state.recipeId, fetchRecipe]);

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

  useEffect(() => {
    if (state.audioPlayerStatus === 'playing') {
      audioRecognitionService.stopSpeechRecognition();
    } else {
      audioRecognitionService.startSpeechRecognition();
    }
  }, [state.audioPlayerStatus, audioRecognitionService]);

  useEffect(() => {
    playCurrentStepAudio();
  }, [playCurrentStepAudio]);

  // 音声認識のトリガーワードに応じてステップを移動
  useEffect(() => {
    const handleTrigger = async (triggerType: TriggerType | null) => {
      if (!triggerType) return;

      switch (triggerType) {
        case 'next':
          const nextStep = state.currentStep + 1;
          if (nextStep < state.totalSteps) {
            actions.setCurrentStep(nextStep);
          }
          break;
        case 'previous':
          const prevStep = state.currentStep - 1;
          if (prevStep >= 0) {
            actions.setCurrentStep(prevStep);
          }
          break;
        case 'again':
          await playCurrentStepAudio();
          break;
      }
      audioRecognitionService.clearTriggerType();
    };

    handleTrigger(state.triggerType);
  }, [
    state.triggerType,
    state.currentStep,
    state.totalSteps,
    actions,
    playCurrentStepAudio,
    audioRecognitionService,
  ]);

  return {
    state,
    actions,
  };
};
