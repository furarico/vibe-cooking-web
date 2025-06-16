import {
  SpeechRecognition,
  SpeechRecognitionErrorEvent,
  SpeechRecognitionEvent,
  SpeechRecognitionOptions,
  SpeechRecognitionRepository,
} from '../interfaces/i-speech-recognition-repository';

export class WebSpeechRecognitionRepository
  implements SpeechRecognitionRepository
{
  private recognition: SpeechRecognition | null = null;
  private shouldRestart = false;
  private restartTimeoutRef: NodeJS.Timeout | null = null;
  private currentOptions: SpeechRecognitionOptions | null = null;

  isSupported(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  async startRecognition(options: SpeechRecognitionOptions): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('音声認識がサポートされていません');
    }

    this.currentOptions = options;
    this.shouldRestart = true;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'ja-JP';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('🎤 音声認識開始');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcriptPart;
        } else {
          interimText += transcriptPart;
        }
      }

      if (this.currentOptions) {
        this.currentOptions.onResult(finalText, interimText);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);

      // no-speechエラーの場合は自動的に再開を試行
      if (event.error === 'no-speech' && this.shouldRestart) {
        console.log('No speech detected, will restart...');
        return;
      }

      // その他のエラーの場合は停止
      this.shouldRestart = false;
      this.clearRestartTimeout();

      if (this.currentOptions) {
        this.currentOptions.onError(event);
      }
    };

    recognition.onend = () => {
      console.log('Recognition ended, shouldRestart:', this.shouldRestart);

      // エラーでない場合、かつshouldRestartがtrueの場合は自動的に再開
      if (this.shouldRestart && this.recognition) {
        this.restartTimeoutRef = setTimeout(() => {
          if (this.shouldRestart && this.recognition) {
            try {
              console.log('Restarting recognition...');
              this.recognition.start();
            } catch (error) {
              console.error('Failed to restart recognition:', error);
              this.shouldRestart = false;
              if (this.currentOptions) {
                this.currentOptions.onError(
                  error instanceof Error ? error : new Error(String(error))
                );
              }
            }
          }
        }, 100);
      } else {
        this.shouldRestart = false;
        if (this.currentOptions) {
          this.currentOptions.onEnd();
        }
      }
    };

    this.recognition = recognition;
    recognition.start();
  }

  stopRecognition(): void {
    this.shouldRestart = false;
    this.clearRestartTimeout();

    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }

    this.currentOptions = null;
  }

  private clearRestartTimeout(): void {
    if (this.restartTimeoutRef) {
      clearTimeout(this.restartTimeoutRef);
      this.restartTimeoutRef = null;
    }
  }
}

// フォールバック実装（MediaRecorder + サーバーサイド音声認識）
export class MediaRecorderSpeechRepository
  implements SpeechRecognitionRepository
{
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private currentOptions: SpeechRecognitionOptions | null = null;

  isSupported(): boolean {
    return 'MediaRecorder' in window;
  }

  async startRecognition(options: SpeechRecognitionOptions): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('MediaRecorderがサポートされていません');
    }

    this.currentOptions = options;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder = mediaRecorder;
      this.chunks = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.chunks, { type: 'audio/wav' });
        await this.transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      if (this.currentOptions) {
        this.currentOptions.onError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }
  }

  stopRecognition(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }
    this.mediaRecorder = null;
    this.currentOptions = null;
  }

  private async transcribeAudio(audioBlob: Blob): Promise<void> {
    try {
      // サーバーサイドAPIを使用した音声認識
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.wav');

      const response = await fetch('/api/speech-recognition', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('音声の文字起こしに失敗しました');
      }

      const data = await response.json();

      if (this.currentOptions) {
        this.currentOptions.onResult(data.transcript, '');
        this.currentOptions.onEnd();
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      if (this.currentOptions) {
        this.currentOptions.onError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }
  }
}
