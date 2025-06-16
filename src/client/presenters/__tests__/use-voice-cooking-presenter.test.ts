import { useVoiceCookingPresenter } from '@/client/presenters/use-voice-cooking-presenter';
import { AudioPlayerService } from '@/client/services/audio-player-service';
import { VoiceCookingService } from '@/client/services/voice-cooking-service';
import { act, renderHook } from '@testing-library/react';

// DIプロバイダーをモック
jest.mock('@/client/di/providers', () => ({
  useDI: jest.fn(),
}));

const mockVoiceCookingService = {
  getSpeechStatus: jest.fn(),
  getTranscript: jest.fn(),
  getInterimTranscript: jest.fn(),
  getTriggerHistory: jest.fn(),
  getCurrentRecipe: jest.fn(),
  getCurrentStepIndex: jest.fn(),
  isShowingRecipeSteps: jest.fn(),
  getLoadingState: jest.fn(),
  getErrorState: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  startSpeechRecognition: jest.fn(),
  stopSpeechRecognition: jest.fn(),
  clearTranscript: jest.fn(),
  clearTriggerHistory: jest.fn(),
  selectRecipe: jest.fn(),
  nextStep: jest.fn(),
  prevStep: jest.fn(),
  backToRecipeList: jest.fn(),
} as jest.Mocked<VoiceCookingService>;

const mockAudioPlayerService = {
  isPlaying: jest.fn(),
  getCurrentAudioUrl: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  playAudio: jest.fn(),
  stopAudio: jest.fn(),
  pauseAudio: jest.fn(),
} as jest.Mocked<AudioPlayerService>;

describe('useVoiceCookingPresenter', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDIContainer: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // デフォルトのモック戻り値を設定
    mockVoiceCookingService.getSpeechStatus.mockReturnValue({
      isRecording: false,
      isProcessing: false,
      status: 'idle',
      statusMessage: '',
    });
    mockVoiceCookingService.getTranscript.mockReturnValue('');
    mockVoiceCookingService.getInterimTranscript.mockReturnValue('');
    mockVoiceCookingService.getTriggerHistory.mockReturnValue([]);
    mockVoiceCookingService.getCurrentRecipe.mockReturnValue(null);
    mockVoiceCookingService.getCurrentStepIndex.mockReturnValue(0);
    mockVoiceCookingService.isShowingRecipeSteps.mockReturnValue(false);
    mockVoiceCookingService.getLoadingState.mockReturnValue({
      isRecipeLoading: false,
    });
    mockVoiceCookingService.getErrorState.mockReturnValue({
      recipeError: null,
    });

    mockAudioPlayerService.isPlaying.mockReturnValue(false);
    mockAudioPlayerService.getCurrentAudioUrl.mockReturnValue(null);

    mockDIContainer = {
      voiceCookingService: mockVoiceCookingService,
      audioPlayerService: mockAudioPlayerService,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  });

  const renderHookWithDI = () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useDI } = require('@/client/di/providers');
    (useDI as jest.Mock).mockReturnValue(mockDIContainer);

    return renderHook(() => useVoiceCookingPresenter());
  };

  it('初期状態が正しく設定される', () => {
    const { result } = renderHookWithDI();

    expect(result.current.state.speechStatus).toEqual({
      isRecording: false,
      isProcessing: false,
      status: 'idle',
      statusMessage: '',
    });
    expect(result.current.state.transcript).toBe('');
    expect(result.current.state.interimTranscript).toBe('');
    expect(result.current.state.triggerHistory).toEqual([]);
    expect(result.current.state.selectedRecipe).toBeNull();
    expect(result.current.state.currentStepIndex).toBe(0);
    expect(result.current.state.showRecipeSteps).toBe(false);
    expect(result.current.state.isRecipeLoading).toBe(false);
    expect(result.current.state.recipeError).toBeNull();
    expect(result.current.state.audioStatus).toEqual({
      isPlaying: false,
      currentAudioUrl: null,
    });
  });

  it('音声認識開始アクションが正常に動作する', async () => {
    mockVoiceCookingService.startSpeechRecognition.mockResolvedValue();

    const { result } = renderHookWithDI();

    await act(async () => {
      await result.current.actions.startSpeechRecognition();
    });

    expect(
      mockVoiceCookingService.startSpeechRecognition
    ).toHaveBeenCalledTimes(1);
  });

  it('音声認識開始でエラーが発生した場合にコンソールエラーが出力される', async () => {
    const error = new Error('音声認識エラー');
    mockVoiceCookingService.startSpeechRecognition.mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHookWithDI();

    await act(async () => {
      await result.current.actions.startSpeechRecognition();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      '音声認識の開始に失敗しました:',
      error
    );
    consoleSpy.mockRestore();
  });

  it('音声認識停止アクションが正常に動作する', () => {
    const { result } = renderHookWithDI();

    act(() => {
      result.current.actions.stopSpeechRecognition();
    });

    expect(mockVoiceCookingService.stopSpeechRecognition).toHaveBeenCalledTimes(
      1
    );
  });

  it('トランスクリプトクリアアクションが正常に動作する', () => {
    const { result } = renderHookWithDI();

    act(() => {
      result.current.actions.clearTranscript();
    });

    expect(mockVoiceCookingService.clearTranscript).toHaveBeenCalledTimes(1);
  });

  it('トリガー履歴クリアアクションが正常に動作する', () => {
    const { result } = renderHookWithDI();

    act(() => {
      result.current.actions.clearTriggerHistory();
    });

    expect(mockVoiceCookingService.clearTriggerHistory).toHaveBeenCalledTimes(
      1
    );
  });

  it('レシピ選択アクションが正常に動作する', async () => {
    mockVoiceCookingService.selectRecipe.mockResolvedValue();

    const { result } = renderHookWithDI();

    await act(async () => {
      await result.current.actions.selectRecipe('recipe-1');
    });

    expect(mockVoiceCookingService.selectRecipe).toHaveBeenCalledWith(
      'recipe-1'
    );
  });

  it('レシピ選択でエラーが発生した場合にコンソールエラーが出力される', async () => {
    const error = new Error('レシピ選択エラー');
    mockVoiceCookingService.selectRecipe.mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHookWithDI();

    await act(async () => {
      await result.current.actions.selectRecipe('recipe-1');
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'レシピの選択に失敗しました:',
      error
    );
    consoleSpy.mockRestore();
  });

  it('次のステップアクションが正常に動作する', () => {
    const { result } = renderHookWithDI();

    act(() => {
      result.current.actions.nextStep();
    });

    expect(mockVoiceCookingService.nextStep).toHaveBeenCalledTimes(1);
  });

  it('前のステップアクションが正常に動作する', () => {
    const { result } = renderHookWithDI();

    act(() => {
      result.current.actions.prevStep();
    });

    expect(mockVoiceCookingService.prevStep).toHaveBeenCalledTimes(1);
  });

  it('レシピリストに戻るアクションが正常に動作する', () => {
    const { result } = renderHookWithDI();

    act(() => {
      result.current.actions.backToRecipeList();
    });

    expect(mockVoiceCookingService.backToRecipeList).toHaveBeenCalledTimes(1);
  });

  it('音声再生アクションが正常に動作する', async () => {
    mockAudioPlayerService.playAudio.mockResolvedValue();

    const { result } = renderHookWithDI();

    await act(async () => {
      await result.current.actions.playAudio('https://example.com/test.mp3');
    });

    expect(mockAudioPlayerService.playAudio).toHaveBeenCalledWith(
      'https://example.com/test.mp3'
    );
  });

  it('音声再生でエラーが発生した場合にコンソールエラーが出力される', async () => {
    const error = new Error('音声再生エラー');
    mockAudioPlayerService.playAudio.mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHookWithDI();

    await act(async () => {
      await result.current.actions.playAudio('https://example.com/test.mp3');
    });

    expect(consoleSpy).toHaveBeenCalledWith('音声再生に失敗しました:', error);
    consoleSpy.mockRestore();
  });

  it('音声停止アクションが正常に動作する', () => {
    const { result } = renderHookWithDI();

    act(() => {
      result.current.actions.stopAudio();
    });

    expect(mockAudioPlayerService.stopAudio).toHaveBeenCalledTimes(1);
  });

  it('音声一時停止アクションが正常に動作する', () => {
    const { result } = renderHookWithDI();

    act(() => {
      result.current.actions.pauseAudio();
    });

    expect(mockAudioPlayerService.pauseAudio).toHaveBeenCalledTimes(1);
  });

  it('サービスにリスナーが追加される', () => {
    renderHookWithDI();

    expect(mockVoiceCookingService.addListener).toHaveBeenCalledTimes(1);
    expect(mockAudioPlayerService.addListener).toHaveBeenCalledTimes(1);
  });

  it('アンマウント時にリスナーが削除される', () => {
    const { unmount } = renderHookWithDI();

    unmount();

    expect(mockVoiceCookingService.removeListener).toHaveBeenCalledTimes(1);
    expect(mockAudioPlayerService.removeListener).toHaveBeenCalledTimes(1);
  });

  it('サービスの状態変更時に状態が更新される', async () => {
    const mockListener = jest.fn();
    mockVoiceCookingService.addListener.mockImplementation(listener => {
      mockListener.mockImplementation(listener);
    });

    const { result } = renderHookWithDI();

    // 初期状態を確認
    expect(result.current.state.transcript).toBe('');

    // サービスの状態を変更
    mockVoiceCookingService.getTranscript.mockReturnValue(
      '新しいトランスクリプト'
    );

    // リスナーを実行してコンポーネントの状態を更新
    await act(() => {
      mockListener();
    });

    expect(result.current.state.transcript).toBe('新しいトランスクリプト');
  });
});
