import { useEffect, useRef, useState } from 'react';

interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  debug?: boolean;
}

export const useTTS = (options: TTSOptions = {}) => {
  const {
    rate = 1,
    pitch = 1,
    volume = 1,
    onStart,
    onEnd,
    onError,
    debug = false,
  } = options;

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const watchdogTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debugLog = (message: string) => {
    if (debug) {
      console.log(`[TTS Debug] ${new Date().toLocaleTimeString()}: ${message}`);
    }
  };

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);

      const japaneseVoice = availableVoices.find(voice =>
        voice.lang.startsWith('ja')
      );
      if (japaneseVoice) {
        setSelectedVoice(japaneseVoice);
      } else if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]);
      }
    };

    loadVoices();

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const clearWatchdog = () => {
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
  };

  const splitTextIntoChunks = (
    text: string,
    maxLength: number = 300
  ): string[] => {
    const chunks: string[] = [];
    let currentChunk = '';

    const sentences = text.split(/([。！？.!?])/);

    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = sentences[i] + (sentences[i + 1] || '');

      if (currentChunk.length + sentence.length <= maxLength) {
        currentChunk += sentence;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          chunks.push(sentence.substring(0, maxLength));
          currentChunk = sentence.substring(maxLength);
        }
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.filter(chunk => chunk.length > 0);
  };

  const speakChunks = (chunks: string[], index: number = 0) => {
    if (index >= chunks.length) {
      debugLog('全チャンク完了');
      setIsPlaying(false);
      setIsPaused(false);
      onEnd?.();
      return;
    }

    debugLog(
      `チャンク${index + 1}/${chunks.length}開始 (${chunks[index].length}文字)`
    );
    const utterance = new SpeechSynthesisUtterance(chunks[index]);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      debugLog(`音声: ${selectedVoice.name} (${selectedVoice.lang})`);
    }

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      clearWatchdog();
      debugLog(`チャンク${index + 1}音声開始`);
      if (index === 0) {
        setIsPlaying(true);
        setIsPaused(false);
        onStart?.();
      }
    };

    utterance.onend = () => {
      clearWatchdog();
      debugLog(`チャンク${index + 1}音声終了`);
      if (index + 1 < chunks.length) {
        debugLog(`次のチャンク${index + 2}を100ms後に開始`);
        setTimeout(() => {
          if (speechSynthesis.speaking || speechSynthesis.pending) {
            debugLog('他の音声が再生中のためスキップ');
            return;
          }
          speakChunks(chunks, index + 1);
        }, 100);
      } else {
        debugLog('全ての音声合成完了');
        setIsPlaying(false);
        setIsPaused(false);
        onEnd?.();
      }
    };

    utterance.onerror = event => {
      clearWatchdog();

      // エラー情報を即座にオブジェクトとして作成
      const errorDetails = {
        error: event.error,
        elapsedTime: event.elapsedTime,
        charIndex: event.charIndex,
        charLength: event.charLength,
        utteranceText: chunks[index],
        chunkIndex: index,
        totalChunks: chunks.length,
        voice: selectedVoice?.name,
        rate,
        pitch,
        volume,
      };

      debugLog(`エラー発生: ${event.error} (${errorDetails.elapsedTime}ms)`);

      // エラーが "canceled" または "interrupted" の場合は正常な中断として扱う
      const isNormalInterruption = ['canceled', 'interrupted'].includes(
        event.error
      );

      if (!isNormalInterruption) {
        console.error('音声合成エラー詳細:', errorDetails);
        onError?.(event.error);
      } else {
        console.log('音声合成が中断されました:', errorDetails);
      }

      setIsPlaying(false);
      setIsPaused(false);
    };

    debugLog('speechSynthesis.speak()実行');
    speechSynthesis.speak(utterance);

    watchdogTimerRef.current = setTimeout(() => {
      debugLog(
        'ウォッチドッグ: onstartが発火しませんでした。エンジンを再起動します。'
      );
      speechSynthesis.pause();
      speechSynthesis.resume();
    }, 1500);
  };

  const speak = (text: string) => {
    if (!text.trim()) {
      onError?.('テキストが空です');
      return;
    }

    debugLog(`開始: テキスト長=${text.length}文字`);
    clearWatchdog();
    speechSynthesis.cancel();
    debugLog('既存の音声をキャンセル');

    const textChunks = text.length > 300 ? splitTextIntoChunks(text) : [text];
    debugLog(`テキストを${textChunks.length}チャンクに分割`);
    speakChunks(textChunks);
  };

  const pause = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    clearWatchdog();
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return {
    speak,
    pause,
    resume,
    stop,
    isPlaying,
    isPaused,
    voices,
    selectedVoice,
    setSelectedVoice,
  };
};
