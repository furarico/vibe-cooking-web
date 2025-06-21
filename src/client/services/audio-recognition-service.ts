import type {
  SpeechRecognitionErrorEvent,
  SpeechRecognitionRepository,
} from '@/client/repositories/interfaces/i-speech-recognition-repository';

export interface AudioRecognitionService {
  // 音声認識関連
  startSpeechRecognition(): Promise<void>;
  stopSpeechRecognition(): void;
  getAudioRecognitionStatus(): AudioRecognitionStatus;
  getTriggerType(): TriggerType | null;
  clearTriggerType(): void;
  resetToListening(): void;

  // イベントリスナー管理
  addListener(listener: () => void): void;
  removeListener(listener: () => void): void;
}

export type AudioRecognitionStatus =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'success'
  | 'error';

export type TriggerType = 'next' | 'previous' | 'again';

export class AudioRecognitionServiceImpl implements AudioRecognitionService {
  private speechRecognitionRepository: SpeechRecognitionRepository;

  // 音声認識状態
  private status: AudioRecognitionStatus = 'idle';
  private triggerType: TriggerType | null = null;

  // イベントリスナー
  private listeners: Set<() => void> = new Set();

  constructor(speechRecognitionRepository: SpeechRecognitionRepository) {
    this.speechRecognitionRepository = speechRecognitionRepository;
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
    if (this.status === 'listening') return;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleSpeechResult(finalText: string, _interimText: string): void {
    if (finalText) {
      // トリガーワード検知
      const { hasNext, hasPrev, hasAgain } = this.detectTriggerWords(finalText);

      if (hasNext) {
        this.triggerType = 'next';
        this.status = 'success';
        this.notifyListeners();
      } else if (hasPrev) {
        this.triggerType = 'previous';
        this.status = 'success';
        this.notifyListeners();
      } else if (hasAgain) {
        this.triggerType = 'again';
        this.status = 'success';
        this.notifyListeners();
      } else {
        // トリガーワードが検出されなかった場合はlistening状態を維持
        this.status = 'listening';
        this.notifyListeners();
        return;
      }

      setTimeout(() => {
        if (this.status === 'listening') {
          this.notifyListeners();
        }
      }, 500);
    }

    this.notifyListeners();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleSpeechError(_error: Error | SpeechRecognitionErrorEvent): void {
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
    hasAgain: boolean;
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
      'うぃシェフ',
      'ウィシェフ',
      'うぃーシェフ',
      'ウィーシェフ',
      'ウィ，シェフ',
      'ウィ，シェフ',
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
    const againKeywords = [
      'もう一度',
      'もういちど',
      'モウイチド',
      'もう1度',
      'もう１度',
      'again',
      'アゲイン',
      'repeat',
      'リピート',
      '繰り返し',
      'くりかえし',
      'もっかい',
      'もういっかい',
      'もういっちょう',
      'もう一回',
    ];

    const normalizedText = text.toLowerCase();

    const hasNext = nextKeywords.some(keyword =>
      normalizedText.includes(keyword.toLowerCase())
    );

    const hasPrev = prevKeywords.some(keyword =>
      normalizedText.includes(keyword.toLowerCase())
    );

    const hasAgain = againKeywords.some(keyword =>
      normalizedText.includes(keyword.toLowerCase())
    );

    return { hasNext, hasPrev, hasAgain };
  }

  getAudioRecognitionStatus(): AudioRecognitionStatus {
    return this.status;
  }

  getTriggerType(): TriggerType | null {
    return this.triggerType;
  }

  clearTriggerType(): void {
    this.triggerType = null;
    this.notifyListeners();
  }

  resetToListening(): void {
    this.status = 'listening';
    this.notifyListeners();
  }
}
