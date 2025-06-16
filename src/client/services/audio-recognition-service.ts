import { RecipeRepository } from '@/client/repositories/implementations/recipe-repository';
import { WebSpeechRecognitionRepository } from '@/client/repositories/implementations/speech-recognition-repository';
import type { SpeechRecognitionErrorEvent } from '@/client/repositories/interfaces/i-speech-recognition-repository';
import { AudioPlayerServiceImpl } from '@/client/services/audio-player-service';
import { RecipeService } from '@/client/services/recipe-service';
import { DefaultApi } from '@/lib/api-client';

export interface AudioRecognitionService {
  // 音声認識関連
  startSpeechRecognition(): Promise<void>;
  stopSpeechRecognition(): void;
  getSpeechStatus(): SpeechStatus;
  getTranscript(): string;
  getInterimTranscript(): string;
  getTriggerHistory(): string[];
  clearTranscript(): void;
  clearTriggerHistory(): void;

  // イベントリスナー管理
  addListener(listener: () => void): void;
  removeListener(listener: () => void): void;
}

export type SpeechStatus =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'success'
  | 'error';

export interface AudioRecognitionServiceDependencies {
  speechRecognitionRepository: import('@/client/repositories/interfaces/i-speech-recognition-repository').SpeechRecognitionRepository;
  recipeService: import('@/client/services/recipe-service').RecipeService;
  audioPlayerService: import('@/client/services/audio-player-service').AudioPlayerService;
}

export class AudioRecognitionServiceImpl implements AudioRecognitionService {
  private speechRecognitionRepository: import('@/client/repositories/interfaces/i-speech-recognition-repository').SpeechRecognitionRepository;
  private recipeService: import('@/client/services/recipe-service').RecipeService;
  private audioPlayerService: import('@/client/services/audio-player-service').AudioPlayerService;

  // 音声認識状態
  private status: SpeechStatus = 'idle';
  private transcript = '';
  private interimTranscript = '';
  private triggerHistory: string[] = [];

  // イベントリスナー
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.speechRecognitionRepository = new WebSpeechRecognitionRepository();
    this.recipeService = new RecipeService(
      new RecipeRepository(new DefaultApi())
    );
    this.audioPlayerService = new AudioPlayerServiceImpl();
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
      this.status = 'listening';
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
    this.status = 'idle';
    this.notifyListeners();
  }

  private handleSpeechResult(finalText: string, interimText: string): void {
    if (finalText) {
      // トリガーワード検知
      const { hasNext, hasPrev } = this.detectTriggerWords(finalText);

      if (hasNext) {
        this.triggerHistory.push(
          `${new Date().toLocaleTimeString()}: 次トリガー検知 - "${finalText}"`
        );
        this.notifyListeners();
      }
      if (hasPrev) {
        this.triggerHistory.push(
          `${new Date().toLocaleTimeString()}: 前トリガー検知 - "${finalText}"`
        );
        this.notifyListeners();
      }

      this.transcript = finalText;
      this.status = 'success';

      setTimeout(() => {
        if (this.status === 'listening') {
          this.notifyListeners();
        }
      }, 500);
    }

    this.interimTranscript = interimText;
    if (interimText && !finalText) {
      this.status = 'processing';
    }

    this.notifyListeners();
  }

  private handleSpeechError(error: Error | SpeechRecognitionErrorEvent): void {
    console.error('Speech recognition error:', error);
    this.status = 'error';
    this.notifyListeners();
  }

  private handleSpeechEnd(): void {
    this.status = 'idle';
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
    return this.status;
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
}
