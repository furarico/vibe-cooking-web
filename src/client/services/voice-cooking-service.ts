import type { SpeechRecognitionErrorEvent } from '@/client/repositories/speech-recognition-repository';
import { components } from '@/types/api';

type Recipe = components['schemas']['Recipe'];

export interface VoiceCookingService {
  // 音声認識関連
  startSpeechRecognition(): Promise<void>;
  stopSpeechRecognition(): void;
  getSpeechStatus(): SpeechStatus;
  getTranscript(): string;
  getInterimTranscript(): string;
  getTriggerHistory(): string[];
  clearTranscript(): void;
  clearTriggerHistory(): void;

  // レシピナビゲーション関連
  selectRecipe(recipeId: string): Promise<void>;
  getCurrentRecipe(): Recipe | null;
  getCurrentStepIndex(): number;
  getCurrentStep(): components['schemas']['Instruction'] | null;
  nextStep(): void;
  prevStep(): void;
  backToRecipeList(): void;
  isShowingRecipeSteps(): boolean;

  // 状態管理
  getLoadingState(): LoadingState;
  getErrorState(): ErrorState;

  // イベントリスナー管理
  addListener(listener: () => void): void;
  removeListener(listener: () => void): void;
}

export interface SpeechStatus {
  isRecording: boolean;
  isProcessing: boolean;
  status: 'idle' | 'listening' | 'processing' | 'success' | 'error';
  statusMessage: string;
}

export interface LoadingState {
  isRecipeLoading: boolean;
}

export interface ErrorState {
  recipeError: string | null;
}

export interface VoiceCookingServiceDependencies {
  speechRecognitionRepository: import('@/client/repositories/speech-recognition-repository').SpeechRecognitionRepository;
  recipeService: import('@/client/services/recipe/recipe-service').RecipeService;
  audioPlayerService: import('@/client/services/audio-player-service').AudioPlayerService;
}

export class VoiceCookingServiceImpl implements VoiceCookingService {
  private speechRecognitionRepository: import('@/client/repositories/speech-recognition-repository').SpeechRecognitionRepository;
  private recipeService: import('@/client/services/recipe/recipe-service').RecipeService;
  private audioPlayerService: import('@/client/services/audio-player-service').AudioPlayerService;

  // テスト用の固定音声URL
  private readonly TEST_AUDIO_URL =
    'https://r2.dev.vibe-cooking.furari.co/instructions/cmbupoqed0000vs5x1xxjgb1w/5omL6aCG-1749813349586.mp3';

  // 音声認識状態
  private isRecording = false;
  private isProcessing = false;
  private status: SpeechStatus['status'] = 'idle';
  private statusMessage = '';
  private transcript = '';
  private interimTranscript = '';
  private triggerHistory: string[] = [];

  // レシピナビゲーション状態
  private selectedRecipe: Recipe | null = null;
  private currentStepIndex = 0;
  private showRecipeSteps = false;
  private isRecipeLoading = false;
  private recipeError: string | null = null;

  // イベントリスナー
  private listeners: Set<() => void> = new Set();

  constructor(dependencies: VoiceCookingServiceDependencies) {
    this.speechRecognitionRepository = dependencies.speechRecognitionRepository;
    this.recipeService = dependencies.recipeService;
    this.audioPlayerService = dependencies.audioPlayerService;
  }

  // イベントリスナー管理
  addListener(listener: () => void): void {
    this.listeners.add(listener);
  }

  removeListener(listener: () => void): void {
    this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  // 音声認識関連の実装
  async startSpeechRecognition(): Promise<void> {
    try {
      this.isRecording = true;
      this.status = 'listening';
      this.statusMessage = '音声を聞いています...';
      this.notifyListeners();

      await this.speechRecognitionRepository.startRecognition({
        onResult: this.handleSpeechResult.bind(this),
        onError: this.handleSpeechError.bind(this),
        onEnd: this.handleSpeechEnd.bind(this),
      });
    } catch (error) {
      this.handleSpeechError(
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  stopSpeechRecognition(): void {
    this.speechRecognitionRepository.stopRecognition();
    this.isRecording = false;
    this.status = 'idle';
    this.statusMessage = '';
    this.notifyListeners();
  }

  private handleSpeechResult(finalText: string, interimText: string): void {
    if (finalText) {
      console.log('🎤 音声認識結果:', finalText);

      // トリガーワード検知
      const { hasNext, hasPrev } = this.detectTriggerWords(finalText);
      console.log('🔍 トリガーワード検知結果:', { hasNext, hasPrev });

      let triggerMessage = '';
      if (hasNext) {
        triggerMessage = '「次」を感知しました';
        this.triggerHistory.push(
          `${new Date().toLocaleTimeString()}: 次トリガー検知 - "${finalText}"`
        );
        if (this.showRecipeSteps) {
          this.nextStep();
        }
      }
      if (hasPrev) {
        triggerMessage = '「前」を感知しました';
        this.triggerHistory.push(
          `${new Date().toLocaleTimeString()}: 前トリガー検知 - "${finalText}"`
        );
        if (this.showRecipeSteps) {
          this.prevStep();
        }
      }

      this.transcript = finalText;
      this.status = 'success';
      this.statusMessage = triggerMessage || '文字起こし完了';

      setTimeout(() => {
        if (this.isRecording) {
          this.status = 'listening';
          this.statusMessage = '音声を聞いています...';
          this.notifyListeners();
        }
      }, 500);
    }

    this.interimTranscript = interimText;
    if (interimText && !finalText) {
      this.status = 'processing';
      this.statusMessage = '音声を認識中...';
    }

    this.notifyListeners();
  }

  private handleSpeechError(error: Error | SpeechRecognitionErrorEvent): void {
    console.error('Speech recognition error:', error);
    this.isRecording = false;
    this.status = 'error';
    this.statusMessage = `音声認識エラー: ${
      error instanceof Error ? error.message : error.error || 'Unknown error'
    }`;
    this.notifyListeners();
  }

  private handleSpeechEnd(): void {
    this.isRecording = false;
    this.status = 'idle';
    this.statusMessage = '';
    this.notifyListeners();
  }

  private detectTriggerWords(text: string): {
    hasNext: boolean;
    hasPrev: boolean;
  } {
    const nextKeywords = [
      '次',
      'つぎ',
      'ツギ',
      '次の',
      'つぎの',
      'ネクスト',
      'next',
      '進んで',
    ];
    const prevKeywords = [
      '前',
      'まえ',
      'マエ',
      '前の',
      'まえの',
      'バック',
      'back',
      '戻る',
      'もどる',
      'もどって',
      '戻って',
    ];

    const normalizedText = text.toLowerCase();

    const hasNext = nextKeywords.some(keyword =>
      normalizedText.includes(keyword.toLowerCase())
    );

    const hasPrev = prevKeywords.some(keyword =>
      normalizedText.includes(keyword.toLowerCase())
    );

    return { hasNext, hasPrev };
  }

  getSpeechStatus(): SpeechStatus {
    return {
      isRecording: this.isRecording,
      isProcessing: this.isProcessing,
      status: this.status,
      statusMessage: this.statusMessage,
    };
  }

  getTranscript(): string {
    return this.transcript;
  }

  getInterimTranscript(): string {
    return this.interimTranscript;
  }

  getTriggerHistory(): string[] {
    return [...this.triggerHistory];
  }

  clearTranscript(): void {
    this.transcript = '';
    this.notifyListeners();
  }

  clearTriggerHistory(): void {
    this.triggerHistory = [];
    this.notifyListeners();
  }

  // レシピナビゲーション関連の実装
  async selectRecipe(recipeId: string): Promise<void> {
    console.log('🔍 レシピ詳細を取得開始:', recipeId);
    this.isRecipeLoading = true;
    this.recipeError = null;
    this.notifyListeners();

    try {
      const recipeDetail = await this.recipeService.getRecipeById(recipeId);
      console.log('✅ レシピ詳細取得成功:', recipeDetail);

      if (recipeDetail) {
        this.selectedRecipe = recipeDetail;
        this.currentStepIndex = 0;
        this.showRecipeSteps = true;
        // 最初のステップの音声を再生（テスト用固定URL）
        this.playTestAudio();
      } else {
        this.recipeError = 'レシピが見つかりませんでした';
      }
    } catch (error) {
      console.error('❌ レシピ詳細取得エラー:', error);
      this.recipeError =
        error instanceof Error
          ? error.message
          : 'レシピ詳細の取得に失敗しました';
    } finally {
      this.isRecipeLoading = false;
      this.notifyListeners();
    }
  }

  getCurrentRecipe(): Recipe | null {
    return this.selectedRecipe;
  }

  getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  getCurrentStep(): components['schemas']['Instruction'] | null {
    if (
      !this.selectedRecipe?.instructions ||
      this.currentStepIndex >= this.selectedRecipe.instructions.length
    ) {
      return null;
    }
    return this.selectedRecipe.instructions[this.currentStepIndex] || null;
  }

  nextStep(): void {
    console.log('🔄 nextStep関数が呼ばれました');
    if (
      this.selectedRecipe &&
      this.selectedRecipe.instructions &&
      this.currentStepIndex < this.selectedRecipe.instructions.length - 1
    ) {
      console.log(
        '✅ 次のステップに移動:',
        this.currentStepIndex,
        '->',
        this.currentStepIndex + 1
      );
      this.currentStepIndex++;
      this.playTestAudio();
      this.notifyListeners();
    } else {
      console.log('⚠️ 最後のステップなので移動しません');
    }
  }

  prevStep(): void {
    console.log('🔄 prevStep関数が呼ばれました');
    if (this.currentStepIndex > 0) {
      console.log(
        '✅ 前のステップに移動:',
        this.currentStepIndex,
        '->',
        this.currentStepIndex - 1
      );
      this.currentStepIndex--;
      this.playTestAudio();
      this.notifyListeners();
    } else {
      console.log('⚠️ 最初のステップなので移動しません');
    }
  }

  backToRecipeList(): void {
    this.audioPlayerService.stopAudio();
    this.showRecipeSteps = false;
    this.selectedRecipe = null;
    this.isRecipeLoading = false;
    this.recipeError = null;
    this.currentStepIndex = 0;
    this.notifyListeners();
  }

  isShowingRecipeSteps(): boolean {
    return this.showRecipeSteps;
  }

  getLoadingState(): LoadingState {
    return {
      isRecipeLoading: this.isRecipeLoading,
    };
  }

  getErrorState(): ErrorState {
    return {
      recipeError: this.recipeError,
    };
  }

  // 音声再生関連のプライベートメソッド
  private async playTestAudio(): Promise<void> {
    try {
      await this.audioPlayerService.playAudio(this.TEST_AUDIO_URL);
      console.log('🎵 テスト音声を再生開始:', this.TEST_AUDIO_URL);
    } catch (error) {
      console.error('テスト音声の再生に失敗しました:', error);
    }
  }
}
