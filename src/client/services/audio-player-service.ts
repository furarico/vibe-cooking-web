export interface AudioPlayerService {
  playAudio(audioUrl: string): Promise<void>;
  stopAudio(): void;
  pauseAudio(): void;
  resumeAudio(): void;
  isPlaying(): boolean;
  getCurrentAudioUrl(): string | null;
  setVolume(volume: number): void;
  addListener(listener: () => void): void;
  removeListener(listener: () => void): void;
}

export class AudioPlayerServiceImpl implements AudioPlayerService {
  private audio: HTMLAudioElement | null = null;
  private currentAudioUrl: string | null = null;
  private isCurrentlyPlaying = false;
  private listeners: Set<() => void> = new Set();

  async playAudio(audioUrl: string): Promise<void> {
    // 既に同じ音声が再生中の場合は何もしない
    if (this.currentAudioUrl === audioUrl && this.isCurrentlyPlaying) {
      return;
    }

    // 現在の音声を停止
    this.stopAudio();

    try {
      // 新しい音声を作成
      this.audio = new Audio(audioUrl);
      this.currentAudioUrl = audioUrl;

      // イベントリスナーを設定
      this.audio.addEventListener('loadstart', () => {
        console.log('🎵 音声読み込み開始:', audioUrl);
      });

      this.audio.addEventListener('canplay', () => {
        console.log('🎵 音声再生準備完了:', audioUrl);
      });

      this.audio.addEventListener('play', () => {
        this.isCurrentlyPlaying = true;
        console.log('▶️ 音声再生開始:', audioUrl);
        this.notifyListeners();
      });

      this.audio.addEventListener('pause', () => {
        this.isCurrentlyPlaying = false;
        console.log('⏸️ 音声一時停止:', audioUrl);
        this.notifyListeners();
      });

      this.audio.addEventListener('ended', () => {
        this.isCurrentlyPlaying = false;
        console.log('⏹️ 音声再生終了:', audioUrl);
        this.notifyListeners();
      });

      this.audio.addEventListener('error', error => {
        console.error('❌ 音声再生エラー:', error);
        this.isCurrentlyPlaying = false;
        this.notifyListeners();
      });

      // 音声を再生
      await this.audio.play();
    } catch (error) {
      console.error('音声再生に失敗しました:', error);
      this.isCurrentlyPlaying = false;
      this.currentAudioUrl = null;
      this.notifyListeners();
      throw error;
    }
  }

  stopAudio(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    this.isCurrentlyPlaying = false;
    this.currentAudioUrl = null;
    console.log('⏹️ 音声停止');
    this.notifyListeners();
  }

  pauseAudio(): void {
    if (this.audio && this.isCurrentlyPlaying) {
      this.audio.pause();
    }
  }

  resumeAudio(): void {
    if (this.audio && !this.isCurrentlyPlaying) {
      this.audio.play().catch(error => {
        console.error('音声再開に失敗しました:', error);
      });
    }
  }

  isPlaying(): boolean {
    return this.isCurrentlyPlaying;
  }

  getCurrentAudioUrl(): string | null {
    return this.currentAudioUrl;
  }

  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  addListener(listener: () => void): void {
    this.listeners.add(listener);
  }

  removeListener(listener: () => void): void {
    this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}
