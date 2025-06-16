import { SpeechRecognitionRepository } from '@/client/repositories/interfaces/i-speech-recognition-repository';
import { AudioPlayerService } from '@/client/services/audio-player-service';
import { RecipeService } from '@/client/services/recipe-service';
import {
  VoiceCookingServiceDependencies,
  VoiceCookingServiceImpl,
} from '@/client/services/voice-cooking-service';
import { components } from '@/types/api';

type Recipe = components['schemas']['Recipe'];
type Instruction = components['schemas']['Instruction'];

const mockSpeechRecognitionRepository = {
  startRecognition: jest.fn(),
  stopRecognition: jest.fn(),
  isSupported: jest.fn(),
} as jest.Mocked<SpeechRecognitionRepository>;

const mockRecipeService = {
  getRecipeById: jest.fn(),
} as jest.Mocked<RecipeService>;

const mockAudioPlayerService = {
  playAudio: jest.fn(),
  stopAudio: jest.fn(),
} as jest.Mocked<AudioPlayerService>;

describe('VoiceCookingServiceImpl', () => {
  let service: VoiceCookingServiceImpl;
  let dependencies: VoiceCookingServiceDependencies;
  let consoleSpy: jest.SpyInstance;

  const mockRecipe: Recipe = {
    id: '1',
    title: 'テストレシピ',
    description: 'テスト用のレシピです',
    cookTime: 30,
    prepTime: 15,
    servings: 4,
    instructions: [
      {
        step: 1,
        title: 'ステップ1',
        description: '最初のステップです',
      },
      {
        step: 2,
        title: 'ステップ2',
        description: '2番目のステップです',
      },
      {
        step: 3,
        title: 'ステップ3',
        description: '最後のステップです',
      },
    ] as Instruction[],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    dependencies = {
      speechRecognitionRepository: mockSpeechRecognitionRepository,
      recipeService: mockRecipeService,
      audioPlayerService: mockAudioPlayerService,
    };

    service = new VoiceCookingServiceImpl(dependencies);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('初期状態', () => {
    it('初期状態が正しく設定される', () => {
      expect(service.getSpeechStatus()).toEqual({
        isRecording: false,
        isProcessing: false,
        status: 'idle',
        statusMessage: '',
      });
      expect(service.getTranscript()).toBe('');
      expect(service.getInterimTranscript()).toBe('');
      expect(service.getTriggerHistory()).toEqual([]);
      expect(service.getCurrentRecipe()).toBeNull();
      expect(service.getCurrentStepIndex()).toBe(0);
      expect(service.isShowingRecipeSteps()).toBe(false);
      expect(service.getLoadingState()).toEqual({ isRecipeLoading: false });
      expect(service.getErrorState()).toEqual({ recipeError: null });
    });
  });

  describe('音声認識', () => {
    it('音声認識開始が成功する', async () => {
      mockSpeechRecognitionRepository.startRecognition.mockResolvedValue();

      await service.startSpeechRecognition();

      expect(service.getSpeechStatus().isRecording).toBe(true);
      expect(service.getSpeechStatus().status).toBe('listening');
      expect(service.getSpeechStatus().statusMessage).toBe(
        '音声を聞いています...'
      );
      expect(
        mockSpeechRecognitionRepository.startRecognition
      ).toHaveBeenCalledTimes(1);
    });

    it('音声認識開始でエラーが発生する', async () => {
      const error = new Error('音声認識エラー');
      mockSpeechRecognitionRepository.startRecognition.mockRejectedValue(error);

      await service.startSpeechRecognition();

      expect(service.getSpeechStatus().status).toBe('error');
      expect(service.getSpeechStatus().statusMessage).toContain(
        '音声認識エラー'
      );
    });

    it('音声認識停止が正常に動作する', () => {
      service.stopSpeechRecognition();

      expect(
        mockSpeechRecognitionRepository.stopRecognition
      ).toHaveBeenCalledTimes(1);
      expect(service.getSpeechStatus().isRecording).toBe(false);
      expect(service.getSpeechStatus().status).toBe('idle');
    });

    it('トランスクリプトをクリアできる', () => {
      // まずトランスクリプトを設定（プライベートメソッド経由）
      mockSpeechRecognitionRepository.startRecognition.mockImplementation(
        async options => {
          options.onResult('テストテキスト', '');
        }
      );

      service.startSpeechRecognition();
      service.clearTranscript();

      expect(service.getTranscript()).toBe('');
    });

    it('トリガー履歴をクリアできる', () => {
      service.clearTriggerHistory();
      expect(service.getTriggerHistory()).toEqual([]);
    });
  });

  describe('レシピ選択とナビゲーション', () => {
    it('レシピ選択が成功する', async () => {
      mockRecipeService.getRecipeById.mockResolvedValue(mockRecipe);
      mockAudioPlayerService.playAudio.mockResolvedValue();

      await service.selectRecipe('1');

      expect(service.getCurrentRecipe()).toEqual(mockRecipe);
      expect(service.getCurrentStepIndex()).toBe(0);
      expect(service.isShowingRecipeSteps()).toBe(true);
      expect(service.getLoadingState().isRecipeLoading).toBe(false);
      expect(mockAudioPlayerService.playAudio).toHaveBeenCalled();
    });

    it('レシピ選択でエラーが発生する', async () => {
      const error = new Error('レシピ取得エラー');
      mockRecipeService.getRecipeById.mockRejectedValue(error);

      await service.selectRecipe('1');

      expect(service.getCurrentRecipe()).toBeNull();
      expect(service.getErrorState().recipeError).toBe('レシピ取得エラー');
      expect(service.getLoadingState().isRecipeLoading).toBe(false);
    });

    it('レシピが見つからない場合', async () => {
      mockRecipeService.getRecipeById.mockResolvedValue(null);

      await service.selectRecipe('1');

      expect(service.getCurrentRecipe()).toBeNull();
      expect(service.getErrorState().recipeError).toBe(
        'レシピが見つかりませんでした'
      );
    });

    it('次のステップに進む', async () => {
      mockRecipeService.getRecipeById.mockResolvedValue(mockRecipe);
      mockAudioPlayerService.playAudio.mockResolvedValue();

      await service.selectRecipe('1');
      expect(service.getCurrentStepIndex()).toBe(0);

      service.nextStep();
      expect(service.getCurrentStepIndex()).toBe(1);

      service.nextStep();
      expect(service.getCurrentStepIndex()).toBe(2);

      // 最後のステップでは進まない
      service.nextStep();
      expect(service.getCurrentStepIndex()).toBe(2);
    });

    it('前のステップに戻る', async () => {
      mockRecipeService.getRecipeById.mockResolvedValue(mockRecipe);
      mockAudioPlayerService.playAudio.mockResolvedValue();

      await service.selectRecipe('1');
      service.nextStep();
      service.nextStep();
      expect(service.getCurrentStepIndex()).toBe(2);

      service.prevStep();
      expect(service.getCurrentStepIndex()).toBe(1);

      service.prevStep();
      expect(service.getCurrentStepIndex()).toBe(0);

      // 最初のステップでは戻らない
      service.prevStep();
      expect(service.getCurrentStepIndex()).toBe(0);
    });

    it('現在のステップを取得する', async () => {
      mockRecipeService.getRecipeById.mockResolvedValue(mockRecipe);
      mockAudioPlayerService.playAudio.mockResolvedValue();

      await service.selectRecipe('1');

      const currentStep = service.getCurrentStep();
      expect(currentStep).toEqual(mockRecipe.instructions![0]);

      service.nextStep();
      const nextStep = service.getCurrentStep();
      expect(nextStep).toEqual(mockRecipe.instructions![1]);
    });

    it('レシピリストに戻る', async () => {
      mockRecipeService.getRecipeById.mockResolvedValue(mockRecipe);
      mockAudioPlayerService.playAudio.mockResolvedValue();
      mockAudioPlayerService.stopAudio.mockImplementation();

      await service.selectRecipe('1');
      expect(service.isShowingRecipeSteps()).toBe(true);

      service.backToRecipeList();

      expect(service.isShowingRecipeSteps()).toBe(false);
      expect(service.getCurrentRecipe()).toBeNull();
      expect(service.getCurrentStepIndex()).toBe(0);
      expect(service.getLoadingState().isRecipeLoading).toBe(false);
      expect(service.getErrorState().recipeError).toBeNull();
      expect(mockAudioPlayerService.stopAudio).toHaveBeenCalled();
    });
  });

  describe('リスナー管理', () => {
    it('リスナーを追加・削除できる', () => {
      const listener = jest.fn();

      service.addListener(listener);
      service.removeListener(listener);

      expect(() => {
        service.addListener(listener);
        service.removeListener(listener);
      }).not.toThrow();
    });

    it('状態変更時にリスナーが呼び出される', async () => {
      const listener = jest.fn();
      service.addListener(listener);

      mockRecipeService.getRecipeById.mockResolvedValue(mockRecipe);
      mockAudioPlayerService.playAudio.mockResolvedValue();

      await service.selectRecipe('1');

      expect(listener).toHaveBeenCalled();
    });
  });

  describe('音声認識結果の処理', () => {
    let onResultCallback: (finalText: string, interimText: string) => void;

    beforeEach(() => {
      mockSpeechRecognitionRepository.startRecognition.mockImplementation(
        async options => {
          onResultCallback = options.onResult;
        }
      );
    });

    it('トリガーワード「次」を検知してステップを進める', async () => {
      mockRecipeService.getRecipeById.mockResolvedValue(mockRecipe);
      mockAudioPlayerService.playAudio.mockResolvedValue();

      await service.selectRecipe('1');
      await service.startSpeechRecognition();

      expect(service.getCurrentStepIndex()).toBe(0);

      // 「次」トリガーワードを含むテキストを送信
      onResultCallback('次のステップに進んでください', '');

      expect(service.getCurrentStepIndex()).toBe(1);
      expect(service.getTriggerHistory()).toHaveLength(1);
      expect(service.getTriggerHistory()[0]).toContain('次トリガー検知');
    });

    it('トリガーワード「前」を検知してステップを戻す', async () => {
      mockRecipeService.getRecipeById.mockResolvedValue(mockRecipe);
      mockAudioPlayerService.playAudio.mockResolvedValue();

      await service.selectRecipe('1');
      service.nextStep(); // ステップ1に進む
      await service.startSpeechRecognition();

      expect(service.getCurrentStepIndex()).toBe(1);

      // 「前」トリガーワードを含むテキストを送信
      onResultCallback('前のステップに戻って', '');

      expect(service.getCurrentStepIndex()).toBe(0);
      expect(service.getTriggerHistory()).toHaveLength(1);
      expect(service.getTriggerHistory()[0]).toContain('前トリガー検知');
    });

    it('レシピステップが表示されていない場合はトリガーワードが無視される', async () => {
      await service.startSpeechRecognition();

      // レシピが選択されていない状態で「次」を送信
      onResultCallback('次のステップに進んでください', '');

      // ステップは変更されない
      expect(service.getCurrentStepIndex()).toBe(0);
      // ただし、トリガー履歴には記録される
      expect(service.getTriggerHistory()).toHaveLength(1);
    });

    it('トランスクリプトが正しく更新される', async () => {
      await service.startSpeechRecognition();

      onResultCallback('これはテストテキストです', '');

      expect(service.getTranscript()).toBe('これはテストテキストです');
      expect(service.getSpeechStatus().status).toBe('success');
    });

    it('暫定結果が正しく処理される', async () => {
      await service.startSpeechRecognition();

      onResultCallback('', 'これは暫定テキスト');

      expect(service.getInterimTranscript()).toBe('これは暫定テキスト');
      expect(service.getSpeechStatus().status).toBe('processing');
    });
  });

  describe('エラーハンドリング', () => {
    it('音声認識エラーが適切に処理される', async () => {
      let onErrorCallback: (error: Error) => void;

      mockSpeechRecognitionRepository.startRecognition.mockImplementation(
        async options => {
          onErrorCallback = options.onError;
        }
      );

      await service.startSpeechRecognition();

      const error = new Error('音声認識エラー');
      onErrorCallback(error);

      expect(service.getSpeechStatus().status).toBe('error');
      expect(service.getSpeechStatus().statusMessage).toContain(
        '音声認識エラー'
      );
      expect(service.getSpeechStatus().isRecording).toBe(false);
    });

    it('音声認識終了が適切に処理される', async () => {
      let onEndCallback: () => void;

      mockSpeechRecognitionRepository.startRecognition.mockImplementation(
        async options => {
          onEndCallback = options.onEnd;
        }
      );

      await service.startSpeechRecognition();
      expect(service.getSpeechStatus().isRecording).toBe(true);

      onEndCallback();

      expect(service.getSpeechStatus().isRecording).toBe(false);
      expect(service.getSpeechStatus().status).toBe('idle');
    });
  });
});
