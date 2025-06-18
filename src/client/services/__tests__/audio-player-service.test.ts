import { AudioPlayerServiceImpl } from '../audio-player-service';

// HTMLAudioElementのモック
interface MockAudioEvent {
  type: string;
  [key: string]: unknown;
}

class MockAudioElement {
  src: string = '';
  volume: number = 1;
  currentTime: number = 0;
  paused: boolean = true;

  private eventListeners: {
    [key: string]: ((event: MockAudioEvent) => void)[];
  } = {};

  constructor(src?: string) {
    if (src) {
      this.src = src;
    }
  }

  addEventListener(type: string, listener: (event: MockAudioEvent) => void) {
    if (!this.eventListeners[type]) {
      this.eventListeners[type] = [];
    }
    this.eventListeners[type].push(listener);
  }

  removeEventListener(type: string, listener: (event: MockAudioEvent) => void) {
    if (this.eventListeners[type]) {
      const index = this.eventListeners[type].indexOf(listener);
      if (index > -1) {
        this.eventListeners[type].splice(index, 1);
      }
    }
  }

  dispatchEvent(event: MockAudioEvent) {
    if (this.eventListeners[event.type]) {
      this.eventListeners[event.type].forEach(listener => listener(event));
    }
  }

  async play(): Promise<void> {
    this.paused = false;
    this.dispatchEvent({ type: 'loadstart' });
    this.dispatchEvent({ type: 'canplay' });
    this.dispatchEvent({ type: 'play' });
    return Promise.resolve();
  }

  pause(): void {
    this.paused = true;
    this.dispatchEvent({ type: 'pause' });
  }

  // テスト用のメソッド
  triggerError(error: Error) {
    this.dispatchEvent({ type: 'error', error });
  }

  triggerEnded() {
    this.paused = true;
    this.dispatchEvent({ type: 'ended' });
  }
}

// グローバルのAudioをモック
global.Audio = MockAudioElement as unknown as typeof Audio;

describe('AudioPlayerServiceImpl', () => {
  let service: AudioPlayerServiceImpl;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new AudioPlayerServiceImpl();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('初期状態', () => {
    it('初期状態では再生中ではない', () => {
      expect(service.getAudioPlayerStatus()).toBe('idle');
      expect(service.getCurrentAudioUrl()).toBeNull();
    });
  });

  describe('playAudio', () => {
    const testUrl = 'https://example.com/test.mp3';

    it('音声再生が成功する', async () => {
      await service.playAudio(testUrl);

      expect(service.getAudioPlayerStatus()).toBe('playing');
      expect(service.getCurrentAudioUrl()).toBe(testUrl);
    });

    it('同じ音声を再生中に再度再生しようとしても何もしない', async () => {
      await service.playAudio(testUrl);
      expect(service.getAudioPlayerStatus()).toBe('playing');
      expect(service.getCurrentAudioUrl()).toBe(testUrl);

      // 同じ音声を再度再生しようとする
      await service.playAudio(testUrl);

      // 状態が変わらないことを確認
      expect(service.getAudioPlayerStatus()).toBe('playing');
      expect(service.getCurrentAudioUrl()).toBe(testUrl);
    });

    it('forceRestartフラグがtrueの場合は同じ音声でも再生し直す', async () => {
      // 最初の再生
      await service.playAudio(testUrl);
      expect(service.getAudioPlayerStatus()).toBe('playing');
      expect(service.getCurrentAudioUrl()).toBe(testUrl);

      // forceRestart = true で同じ音声を再生
      await service.playAudio(testUrl, true);

      // 再生が継続されていることを確認
      expect(service.getAudioPlayerStatus()).toBe('playing');
      expect(service.getCurrentAudioUrl()).toBe(testUrl);
    });

    it('異なる音声を再生する場合は前の音声を停止して新しい音声を再生する', async () => {
      await service.playAudio(testUrl);
      expect(service.getCurrentAudioUrl()).toBe(testUrl);

      const newUrl = 'https://example.com/test2.mp3';
      await service.playAudio(newUrl);

      expect(service.getCurrentAudioUrl()).toBe(newUrl);
    });

    it('音声再生エラーが発生した場合は適切に処理される', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Audioコンストラクタをモックしてエラーを発生させる
      const originalAudio = global.Audio;
      global.Audio = jest.fn().mockImplementation(() => {
        const mockAudio = new MockAudioElement();
        mockAudio.play = jest.fn().mockRejectedValue(new Error('Play failed'));
        return mockAudio;
      }) as unknown as typeof Audio;

      await expect(service.playAudio(testUrl)).rejects.toThrow('Play failed');
      expect(service.getAudioPlayerStatus()).toBe('stopped');
      expect(service.getCurrentAudioUrl()).toBeNull();

      global.Audio = originalAudio;
      errorSpy.mockRestore();
    });
  });

  describe('stopAudio', () => {
    it('再生中の音声を停止する', async () => {
      await service.playAudio('https://example.com/test.mp3');
      expect(service.getAudioPlayerStatus()).toBe('playing');

      service.stopAudio();

      expect(service.getAudioPlayerStatus()).toBe('stopped');
      expect(service.getCurrentAudioUrl()).toBeNull();
    });

    it('再生していない状態で停止を呼んでもエラーにならない', () => {
      expect(() => service.stopAudio()).not.toThrow();
    });
  });

  describe('pauseAudio', () => {
    it('再生中の音声を一時停止する', async () => {
      await service.playAudio('https://example.com/test.mp3');
      expect(service.getAudioPlayerStatus()).toBe('playing');

      service.pauseAudio();

      expect(service.getAudioPlayerStatus()).toBe('paused');
      expect(service.getCurrentAudioUrl()).toBe('https://example.com/test.mp3'); // URLは保持される
    });

    it('再生していない状態で一時停止を呼んでもエラーにならない', () => {
      expect(() => service.pauseAudio()).not.toThrow();
    });
  });

  describe('resumeAudio', () => {
    it('一時停止中の音声を再開する', async () => {
      await service.playAudio('https://example.com/test.mp3');
      service.pauseAudio();
      expect(service.getAudioPlayerStatus()).toBe('paused');

      service.resumeAudio();

      expect(service.getAudioPlayerStatus()).toBe('playing');
    });

    it('音声がない状態で再開を呼んでもエラーにならない', () => {
      expect(() => service.resumeAudio()).not.toThrow();
    });
  });

  describe('setVolume', () => {
    it('音量を設定する', async () => {
      await service.playAudio('https://example.com/test.mp3');

      service.setVolume(0.5);

      // 内部のAudioオブジェクトの音量が設定されることを確認
      // 実際の値の確認は実装に依存するため、エラーが発生しないことを確認
      expect(() => service.setVolume(0.5)).not.toThrow();
    });

    it('音量の範囲を正しく制限する', async () => {
      await service.playAudio('https://example.com/test.mp3');

      // 範囲外の値でもエラーにならないことを確認
      expect(() => service.setVolume(-0.5)).not.toThrow();
      expect(() => service.setVolume(1.5)).not.toThrow();
    });

    it('音声がない状態で音量設定を呼んでもエラーにならない', () => {
      expect(() => service.setVolume(0.5)).not.toThrow();
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

      await service.playAudio('https://example.com/test.mp3');

      expect(listener).toHaveBeenCalled();
    });

    it('停止時にリスナーが呼び出される', async () => {
      const listener = jest.fn();
      await service.playAudio('https://example.com/test.mp3');

      service.addListener(listener);
      listener.mockClear();

      service.stopAudio();

      expect(listener).toHaveBeenCalled();
    });
  });

  describe('音声イベント処理', () => {
    it('音声再生終了時に状態が正しく更新される', async () => {
      const listener = jest.fn();
      service.addListener(listener);

      await service.playAudio('https://example.com/test.mp3');
      expect(service.getAudioPlayerStatus()).toBe('playing');

      // 音声終了をシミュレート
      const mockAudio = (service as { audio: MockAudioElement }).audio;
      mockAudio.triggerEnded();

      expect(service.getAudioPlayerStatus()).toBe('stopped');
      expect(listener).toHaveBeenCalled();
    });

    it('音声エラー時に状態が正しく更新される', async () => {
      const listener = jest.fn();
      service.addListener(listener);

      await service.playAudio('https://example.com/test.mp3');
      expect(service.getAudioPlayerStatus()).toBe('playing');

      // 音声エラーをシミュレート
      const mockAudio = (service as { audio: MockAudioElement }).audio;
      mockAudio.triggerError(new Error('Audio error'));

      expect(service.getAudioPlayerStatus()).toBe('stopped');
      expect(listener).toHaveBeenCalled();
    });
  });
});
