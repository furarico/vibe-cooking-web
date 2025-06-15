import { VoiceCookingService } from '@/client/services/voice-cooking-service';
import { components } from '@/types/api';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

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

  // 音声再生状態
  audioStatus: {
    isPlaying: boolean;
    currentAudioUrl: string | null;
  };
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

  // 音声再生アクション
  playTestAudio: () => Promise<void>;
  stopAudio: () => void;
  pauseAudio: () => void;
}

export interface VoiceCookingPresenter {
  state: VoiceCookingPresenterState;
  actions: VoiceCookingPresenterActions;
}

export const useVoiceCookingPresenter = (
  voiceCookingService: VoiceCookingService,
  audioPlayerService: import('@/client/services/audio-player-service').AudioPlayerService
): VoiceCookingPresenter => {
  // 状態の初期化
  const [state, setState] = useState<VoiceCookingPresenterState>(() => {
    return {
      speechStatus: voiceCookingService.getSpeechStatus(),
      transcript: voiceCookingService.getTranscript(),
      interimTranscript: voiceCookingService.getInterimTranscript(),
      triggerHistory: voiceCookingService.getTriggerHistory(),
      selectedRecipe: voiceCookingService.getCurrentRecipe(),
      currentStepIndex: voiceCookingService.getCurrentStepIndex(),
      showRecipeSteps: voiceCookingService.isShowingRecipeSteps(),
      isRecipeLoading: voiceCookingService.getLoadingState().isRecipeLoading,
      recipeError: voiceCookingService.getErrorState().recipeError,
      audioStatus: {
        isPlaying: audioPlayerService.isPlaying(),
        currentAudioUrl: audioPlayerService.getCurrentAudioUrl(),
      },
    };
  });

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
        audioStatus: {
          isPlaying: audioPlayerService.isPlaying(),
          currentAudioUrl: audioPlayerService.getCurrentAudioUrl(),
        },
      });
    };

    voiceCookingService.addListener(updateState);
    audioPlayerService.addListener(updateState);

    return () => {
      voiceCookingService.removeListener(updateState);
      audioPlayerService.removeListener(updateState);
    };
  }, [voiceCookingService, audioPlayerService]);

  // アクションの定義
  const actions: VoiceCookingPresenterActions = {
    startSpeechRecognition: useCallback(async () => {
      try {
        await voiceCookingService.startSpeechRecognition();
      } catch (error) {
        console.error('音声認識の開始に失敗しました:', error);
        toast.error('音声認識の開始に失敗しました');
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
          toast.error('レシピの選択に失敗しました');
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

    playTestAudio: useCallback(async () => {
      try {
        await audioPlayerService.playAudio(
          'https://r2.dev.vibe-cooking.furari.co/instructions/cmbupoqed0000vs5x1xxjgb1w/5omL6aCG-1749813349586.mp3'
        );
      } catch (error) {
        console.error('テスト音声再生に失敗しました:', error);
        toast.error('テスト音声再生に失敗しました');
      }
    }, [audioPlayerService]),

    stopAudio: useCallback(() => {
      audioPlayerService.stopAudio();
    }, [audioPlayerService]),

    pauseAudio: useCallback(() => {
      audioPlayerService.pauseAudio();
    }, [audioPlayerService]),
  };

  return {
    state,
    actions,
  };
};
