'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function TextToSpeechPage() {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const watchdogTimerRef = useRef<NodeJS.Timeout | null>(null);

  // デバッグログ追加関数
  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo(prev => [...prev.slice(-9), `${timestamp}: ${message}`]);
    console.log(`[TTS Debug] ${timestamp}: ${message}`);
  };

  // Web Speech API状態監視
  useEffect(() => {
    const checkSpeechSynthesis = () => {
      addDebugLog(`Speaking: ${speechSynthesis.speaking}, Pending: ${speechSynthesis.pending}, Paused: ${speechSynthesis.paused}`);
    };

    if (isPlaying) {
      const interval = setInterval(checkSpeechSynthesis, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    // 音声リストを取得
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);

      // 日本語音声を優先的に選択
      const japaneseVoice = availableVoices.find(voice => voice.lang.startsWith('ja'));
      if (japaneseVoice) {
        setSelectedVoice(japaneseVoice);
      } else if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]);
      }
    };

    loadVoices();

    // 音声リストの読み込みが遅れる場合のため
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

  const speak = () => {
    if (!text.trim()) {
      alert('読み上げるテキストを入力してください');
      return;
    }

    addDebugLog(`開始: テキスト長=${text.length}文字`);

    // 既存の音声を停止 & ウォッチドッグをクリア
    clearWatchdog();
    speechSynthesis.cancel();
    addDebugLog('既存の音声をキャンセル');

    // テキストが長い場合は分割して読み上げ
    const maxLength = 300; // 文字数制限
    const textChunks = text.length > maxLength ? splitTextIntoChunks(text, maxLength) : [text];

    addDebugLog(`テキストを${textChunks.length}チャンクに分割`);
    setTotalChunks(textChunks.length);
    setCurrentChunk(0);
    speakChunks(textChunks, 0);
  };

  const splitTextIntoChunks = (text: string, maxLength: number): string[] => {
    const chunks: string[] = [];
    let currentChunk = '';

    const sentences = text.split(/([。！？.\?!])/);

    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = sentences[i] + (sentences[i + 1] || '');

      if (currentChunk.length + sentence.length <= maxLength) {
        currentChunk += sentence;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          // 単一の文が長すぎる場合は強制分割
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

  const speakChunks = (chunks: string[], index: number) => {
    if (index >= chunks.length) {
      addDebugLog('全チャンク完了');
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentChunk(0);
      return;
    }

    addDebugLog(`チャンク${index + 1}/${chunks.length}開始 (${chunks[index].length}文字)`);
    setCurrentChunk(index);
    const utterance = new SpeechSynthesisUtterance(chunks[index]);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      addDebugLog(`音声: ${selectedVoice.name} (${selectedVoice.lang})`);
    }

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      clearWatchdog();
      addDebugLog(`チャンク${index + 1}音声開始`);
      if (index === 0) {
        setIsPlaying(true);
        setIsPaused(false);
      }
    };

    utterance.onend = () => {
      clearWatchdog();
      addDebugLog(`チャンク${index + 1}音声終了`);
      // 次のチャンクがある場合は続行
      if (index + 1 < chunks.length) {
        addDebugLog(`次のチャンク${index + 2}を100ms後に開始`);
        // 少し間を置いてから次のチャンクを再生
        setTimeout(() => {
          if (speechSynthesis.speaking || speechSynthesis.pending) {
            addDebugLog('他の音声が再生中のためスキップ');
            return; // 既に他の音声が再生中の場合はスキップ
          }
          speakChunks(chunks, index + 1);
        }, 100);
      } else {
        // 全て完了
        addDebugLog('全ての音声合成完了');
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentChunk(0);
      }
    };

    utterance.onerror = (event) => {
      clearWatchdog();
      addDebugLog(`エラー発生: ${event.error} (経過時間: ${event.elapsedTime}ms, 文字位置: ${event.charIndex})`);
      console.error('音声合成エラー詳細:', {
        error: event.error,
        elapsedTime: event.elapsedTime,
        charIndex: event.charIndex,
        charLength: event.charLength,
        utteranceText: chunks[index],
        chunkIndex: index,
        totalChunks: chunks.length,
        voice: selectedVoice?.name,
        rate, pitch, volume
      });

      // "canceled"エラーの場合は警告を表示しない（よくある正常な動作）
      if (event.error !== 'canceled') {
        alert(`音声の再生中にエラーが発生しました: ${event.error}`);
      }

      setIsPlaying(false);
      setIsPaused(false);
      setCurrentChunk(0);
    };

    addDebugLog('speechSynthesis.speak()実行');
    speechSynthesis.speak(utterance);

    // ウォッチドッグタイマーを設定
    watchdogTimerRef.current = setTimeout(() => {
      addDebugLog('ウォッチドッグ: onstartが発火しませんでした。エンジンを再起動します。');
      // フリーズしたエンジンを再起動させる
      speechSynthesis.pause();
      speechSynthesis.resume();
    }, 1500); // 1.5秒待っても開始しない場合
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
    setCurrentChunk(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            テキスト読み上げ
          </h1>

          {/* テキスト入力エリア */}
          <div className="mb-6">
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
              読み上げるテキスト
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={6}
              placeholder="ここに読み上げたいテキストを入力してください..."
            />
          </div>

          {/* 音声設定 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 音声選択 */}
            <div>
              <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 mb-2">
                音声選択
              </label>
              <select
                id="voice-select"
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const voice = voices.find(v => v.name === e.target.value);
                  setSelectedVoice(voice || null);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {voices.map((voice, index) => (
                  <option key={index} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* 音量 */}
            <div>
              <label htmlFor="volume-slider" className="block text-sm font-medium text-gray-700 mb-2">
                音量: {Math.round(volume * 100)}%
              </label>
              <input
                id="volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* 速度 */}
            <div>
              <label htmlFor="rate-slider" className="block text-sm font-medium text-gray-700 mb-2">
                速度: {rate}x
              </label>
              <input
                id="rate-slider"
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* 音程 */}
            <div>
              <label htmlFor="pitch-slider" className="block text-sm font-medium text-gray-700 mb-2">
                音程: {pitch}
              </label>
              <input
                id="pitch-slider"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* コントロールボタン */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={speak}
              disabled={isPlaying && !isPaused}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              再生
            </button>

            {isPlaying && !isPaused && (
              <button
                onClick={pause}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                一時停止
              </button>
            )}

            {isPaused && (
              <button
                onClick={resume}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                再開
              </button>
            )}

            {isPlaying && (
              <button
                onClick={stop}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                停止
              </button>
            )}
          </div>

          {/* サンプルテキスト */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">サンプルテキスト</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setText('こんにちは。今日はとても良い天気ですね。Web Speech APIを使って、このテキストを読み上げています。')}
                className="p-3 text-left bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                日本語サンプル 1
              </button>
              <button
                onClick={() => setText('Web Speech APIは、ブラウザに組み込まれた音声合成機能です。JavaScriptから簡単に利用することができます。')}
                className="p-3 text-left bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                日本語サンプル 2
              </button>
              <button
                onClick={() => setText('Hello, this is a sample text for speech synthesis. You can adjust the voice, rate, pitch, and volume.')}
                className="p-3 text-left bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                English Sample 1
              </button>
              <button
                onClick={() => setText('The Web Speech API provides speech synthesis functionality built into modern browsers.')}
                className="p-3 text-left bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                English Sample 2
              </button>
            </div>
          </div>

          {/* 使用方法 */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">使用方法</h3>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>テキストエリアに読み上げたい文章を入力します</li>
              <li>お好みの音声、音量、速度、音程を調整します</li>
              <li>「再生」ボタンをクリックして読み上げを開始します</li>
              <li>一時停止、再開、停止も可能です</li>
            </ul>
          </div>

          {/* デバッグ情報 */}
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-yellow-800">デバッグ情報</h3>
              <button
                onClick={() => setDebugInfo([])}
                className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
              >
                クリア
              </button>
            </div>
            <div className="bg-yellow-100 p-3 rounded font-mono text-sm max-h-40 overflow-y-auto">
              {debugInfo.length === 0 ? (
                <p className="text-yellow-600">デバッグログはここに表示されます</p>
              ) : (
                debugInfo.map((log, index) => (
                  <div key={index} className="text-yellow-800 mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 進行状況インジケータ */}
          {(isPlaying || isPaused) && totalChunks > 1 && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">進行状況</h3>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-4 bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentChunk + 1) / totalChunks) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                チャンク {currentChunk + 1} / {totalChunks} を再生中
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
