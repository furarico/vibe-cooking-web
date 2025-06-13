import { VoiceCookingService } from '@/client/services/voice-cooking-service';
import { components } from '@/types/api';
import { useCallback, useEffect, useState } from 'react';

type Recipe = components['schemas']['Recipe'];

export interface VoiceCookingPresenterState {
  // 音声認識状態
  speechStatus: {
    isRecording: boolean;
    isProcessing: boolean;
    status: 'idle' | 'listening' | 'processing' | 'success' | 'error';
    statusMessage: string;
  };
  transcript: string;
  interimTranscript: string;
  triggerHistory: string[];

  // レシピナビゲーション状態
  selectedRecipe: Recipe | null;
  currentStepIndex: number;
  showRecipeSteps: boolean;

  // ローディング・エラー状態
  isRecipeLoading: boolean;
  recipeError: string | null;
}

export interface VoiceCookingPresenterActions {
  // 音声認識アクション
  startSpeechRecognition: () => Promise<void>;
  stopSpeechRecognition: () => void;
  clearTranscript: () => void;
  clearTriggerHistory: () => void;

  // レシピナビゲーションアクション
  selectRecipe: (recipeId: string) => Promise<void>;
  nextStep: () => void;
  prevStep: () => void;
  backToRecipeList: () => void;
}

export interface VoiceCookingPresenter {
  state: VoiceCookingPresenterState;
  actions: VoiceCookingPresenterActions;
}

export const useVoiceCookingPresenter = (
  voiceCookingService: VoiceCookingService
): VoiceCookingPresenter => {
  // 状態の初期化
  const [state, setState] = useState<VoiceCookingPresenterState>(() => ({
    speechStatus: voiceCookingService.getSpeechStatus(),
    transcript: voiceCookingService.getTranscript(),
    interimTranscript: voiceCookingService.getInterimTranscript(),
    triggerHistory: voiceCookingService.getTriggerHistory(),
    selectedRecipe: voiceCookingService.getCurrentRecipe(),
    currentStepIndex: voiceCookingService.getCurrentStepIndex(),
    showRecipeSteps: voiceCookingService.isShowingRecipeSteps(),
    isRecipeLoading: voiceCookingService.getLoadingState().isRecipeLoading,
    recipeError: voiceCookingService.getErrorState().recipeError,
  }));

  // サービスの状態変更を監視
  useEffect(() => {
    const updateState = () => {
      setState({
        speechStatus: voiceCookingService.getSpeechStatus(),
        transcript: voiceCookingService.getTranscript(),
        interimTranscript: voiceCookingService.getInterimTranscript(),
        triggerHistory: voiceCookingService.getTriggerHistory(),
        selectedRecipe: voiceCookingService.getCurrentRecipe(),
        currentStepIndex: voiceCookingService.getCurrentStepIndex(),
        showRecipeSteps: voiceCookingService.isShowingRecipeSteps(),
        isRecipeLoading: voiceCookingService.getLoadingState().isRecipeLoading,
        recipeError: voiceCookingService.getErrorState().recipeError,
      });
    };

    voiceCookingService.addListener(updateState);

    return () => {
      voiceCookingService.removeListener(updateState);
    };
  }, [voiceCookingService]);

  // アクションの定義
  const actions: VoiceCookingPresenterActions = {
    startSpeechRecognition: useCallback(async () => {
      try {
        await voiceCookingService.startSpeechRecognition();
      } catch (error) {
        console.error('音声認識の開始に失敗しました:', error);
        // エラーハンドリングはサービス層で行われる
      }
    }, [voiceCookingService]),

    stopSpeechRecognition: useCallback(() => {
      voiceCookingService.stopSpeechRecognition();
    }, [voiceCookingService]),

    clearTranscript: useCallback(() => {
      voiceCookingService.clearTranscript();
    }, [voiceCookingService]),

    clearTriggerHistory: useCallback(() => {
      voiceCookingService.clearTriggerHistory();
    }, [voiceCookingService]),

    selectRecipe: useCallback(
      async (recipeId: string) => {
        try {
          await voiceCookingService.selectRecipe(recipeId);
        } catch (error) {
          console.error('レシピの選択に失敗しました:', error);
          // エラーハンドリングはサービス層で行われる
        }
      },
      [voiceCookingService]
    ),

    nextStep: useCallback(() => {
      voiceCookingService.nextStep();
    }, [voiceCookingService]),

    prevStep: useCallback(() => {
      voiceCookingService.prevStep();
    }, [voiceCookingService]),

    backToRecipeList: useCallback(() => {
      voiceCookingService.backToRecipeList();
    }, [voiceCookingService]),
  };

  return {
    state,
    actions,
  };
};
