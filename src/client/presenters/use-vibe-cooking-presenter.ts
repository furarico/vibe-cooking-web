'use client';

import { useDI } from '@/client/di/providers';
import { AudioPlayerStatus } from '@/client/services/audio-player-service';
import {
  AudioRecognitionStatus,
  TriggerType,
} from '@/client/services/audio-recognition-service';
import { CookingInstructionCardProps } from '@/components/cooking-instruction-card';
import { CarouselApi } from '@/components/ui/carousel';
import { Recipe, VibeRecipe } from '@/lib/api-client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export interface VibeCookingPresenterState {
  // vibeRecipe関連
  recipeIds: string[];
  recipes: Recipe[];
  vibeRecipe: VibeRecipe | null;
  loading: boolean;

  // cooking関連
  currentStep: number;
  totalSteps: number;
  carouselApi: CarouselApi | null;
  cards: CookingInstructionCardProps[];
  activeRecipeId: string | null;

  // 音声関連
  audioPlayerStatus: AudioPlayerStatus;
  audioRecognitionStatus: AudioRecognitionStatus;
  triggerType: TriggerType | null;
}

export interface VibeCookingPresenterActions {
  setRecipeIds: (recipeIds: string[]) => void;
  setCurrentStep: (step: number) => void;
  setCarouselApi: (api: CarouselApi) => void;
}

export interface VibeCookingPresenter {
  state: VibeCookingPresenterState;
  actions: VibeCookingPresenterActions;
}

export const useVibeCookingPresenter = (): VibeCookingPresenter => {
  const {
    vibeRecipeService,
    recipeService,
    audioPlayerService,
    audioRecognitionService,
  } = useDI();

  const [state, setState] = useState<VibeCookingPresenterState>({
    // vibeRecipe関連
    recipeIds: [],
    recipes: [],
    vibeRecipe: null,
    loading: false,

    // cooking関連
    currentStep: 0,
    totalSteps: 0,
    carouselApi: null,
    cards: [],
    activeRecipeId: null,

    // 音声関連
    audioPlayerStatus: audioPlayerService.getAudioPlayerStatus(),
    audioRecognitionStatus: audioRecognitionService.getAudioRecognitionStatus(),
    triggerType: audioRecognitionService.getTriggerType(),
  });

  const setRecipeIds = useCallback((recipeIds: string[]) => {
    setState(prev => ({ ...prev, recipeIds }));
  }, []);

  // レシピIDからレシピ詳細を取得
  useEffect(() => {
    if (state.recipeIds.length === 0) {
      setState(prev => ({
        ...prev,
        recipes: [],
        vibeRecipe: null,
        cards: [],
        totalSteps: 0,
        activeRecipeId: null,
      }));
      return;
    }

    const fetchRecipes = async () => {
      try {
        const recipes = await Promise.all(
          state.recipeIds.map(async recipeId => {
            const recipe = await recipeService.getRecipeById(recipeId);
            return recipe;
          })
        );

        const validRecipes = recipes.filter(
          (recipe): recipe is Recipe => recipe !== null
        );

        setState(prev => ({
          ...prev,
          recipes: validRecipes,
        }));
      } catch (error) {
        console.error('レシピの取得に失敗しました:', error);
        setState(prev => ({ ...prev, recipes: [] }));
      }
    };

    fetchRecipes();
  }, [state.recipeIds, recipeService]);

  // バイブレシピを作成
  useEffect(() => {
    if (state.recipeIds.length === 0) {
      return;
    }

    setState(prev => ({ ...prev, loading: true }));

    const createVibeRecipe = async (recipeIds: string[]) => {
      try {
        const vibeRecipe = await vibeRecipeService.createVibeRecipe(recipeIds);

        // バイブレシピの手順からカードを生成
        const cards = await generateCardsFromVibeRecipe(
          vibeRecipe,
          state.recipes
        );

        setState(prev => ({
          ...prev,
          vibeRecipe,
          cards,
          totalSteps: vibeRecipe.vibeInstructions?.length ?? 0,
          loading: false,
        }));

        toast.success('バイブレシピを作成しました');
      } catch {
        setState(prev => ({
          ...prev,
          loading: false,
        }));
        toast.error('バイブレシピの作成に失敗しました');
      }
    };

    createVibeRecipe(state.recipeIds);
  }, [state.recipeIds, vibeRecipeService, state.recipes]);

  // バイブレシピの手順からカードを生成する関数
  const generateCardsFromVibeRecipe = async (
    vibeRecipe: VibeRecipe,
    recipes: Recipe[]
  ): Promise<CookingInstructionCardProps[]> => {
    if (!vibeRecipe.vibeInstructions) return [];

    const cards: CookingInstructionCardProps[] = [];

    for (const vibeInstruction of vibeRecipe.vibeInstructions) {
      const recipe = recipes.find(r => r.id === vibeInstruction.recipeId);
      if (!recipe) continue;

      const instruction = recipe.instructions?.find(
        inst => inst.id === vibeInstruction.instructionId
      );
      if (!instruction) continue;

      // stepがnullの場合はスキップ
      if (vibeInstruction.step === null) continue;

      cards.push({
        step: vibeInstruction.step,
        title: instruction.title,
        description: instruction.description,
        imageUrl: instruction.imageUrl ?? null,
      });
    }

    // ステップ順でソート
    return cards.sort((a, b) => {
      if (a.step === null && b.step === null) return 0;
      if (a.step === null) return 1;
      if (b.step === null) return -1;
      return a.step - b.step;
    });
  };

  // 現在のステップからアクティブなレシピIDを取得
  const getCurrentActiveRecipeId = useCallback((): string | null => {
    if (!state.vibeRecipe?.vibeInstructions || state.currentStep < 0) {
      return null;
    }

    const currentVibeInstruction = state.vibeRecipe.vibeInstructions.find(
      instruction => instruction.step === state.currentStep + 1
    );

    return currentVibeInstruction?.recipeId ?? null;
  }, [state.vibeRecipe, state.currentStep]);

  // アクティブなレシピIDを更新
  useEffect(() => {
    const activeRecipeId = getCurrentActiveRecipeId();
    setState(prev => ({ ...prev, activeRecipeId }));
  }, [getCurrentActiveRecipeId]);

  // 現在の手順の音声を再生
  const playCurrentStepAudio = useCallback(async () => {
    if (!state.vibeRecipe?.vibeInstructions || !state.recipes) {
      return;
    }

    const currentVibeInstruction = state.vibeRecipe.vibeInstructions.find(
      instruction => instruction.step === state.currentStep + 1
    );

    if (!currentVibeInstruction) return;

    const recipe = state.recipes.find(
      r => r.id === currentVibeInstruction.recipeId
    );
    if (!recipe) return;

    const instruction = recipe.instructions?.find(
      inst => inst.id === currentVibeInstruction.instructionId
    );

    if (instruction?.audioUrl) {
      try {
        await audioPlayerService.playAudio(instruction.audioUrl);
      } catch {
        toast.error('音声の再生に失敗しました');
      }
    }
  }, [state.vibeRecipe, state.recipes, state.currentStep, audioPlayerService]);

  // アクションの定義
  const actions: VibeCookingPresenterActions = useMemo(
    () => ({
      setRecipeIds,
      setCurrentStep: (step: number) => {
        setState(prev => ({ ...prev, currentStep: step }));
      },
      setCarouselApi: (api: CarouselApi) => {
        setState(prev => ({ ...prev, carouselApi: api }));
      },
    }),
    [setRecipeIds]
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

  // カルーセルAPIの同期
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

  // 音声認識による制御
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
