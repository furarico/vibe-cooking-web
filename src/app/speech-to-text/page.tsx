'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRecipePresenter } from '@/client/presenters/hooks/use-recipe-presenter';
import { useDI } from '@/client/di/providers';
import { Recipe, Instruction } from '@/lib/api-client';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type RecognitionStatus = 'idle' | 'listening' | 'processing' | 'success' | 'error';

// トリガーワード検知機能
const detectTriggerWords = (text: string) => {
  const nextKeywords = ['次', 'つぎ', 'ツギ', '次の', 'つぎの', 'ネクスト', 'next', '進んで', 'ウィシェフ'];
  const prevKeywords = ['前', 'まえ', 'マエ', '前の', 'まえの', 'バック', 'back', '戻る', 'もどる', 'もどって', '戻って'];

  const normalizedText = text.toLowerCase();
  console.log('🔍 トリガーワード検知中:', { originalText: text, normalizedText });

  const hasNext = nextKeywords.some(keyword => {
    const match = normalizedText.includes(keyword.toLowerCase());
    if (match) console.log('✅ 「次」キーワード発見:', keyword);
    return match;
  });

  const hasPrev = prevKeywords.some(keyword => {
    const match = normalizedText.includes(keyword.toLowerCase());
    if (match) console.log('✅ 「前」キーワード発見:', keyword);
    return match;
  });

  console.log('🔍 検知結果:', { hasNext, hasPrev });
  return { hasNext, hasPrev };
};

export default function SpeechToText() {
  // 既存の音声認識状態
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<RecognitionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [shouldRestart, setShouldRestart] = useState(false);
  const [isTranscriptCompleted, setIsTranscriptCompleted] = useState(false);
  const [triggerHistory, setTriggerHistory] = useState<string[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // レシピ関連の状態（API使用）
  const { recipes, loading, error, fetchRecipes } = useRecipePresenter();
  const { recipeService } = useDI();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedRecipeLoading, setSelectedRecipeLoading] = useState(false);
  const [selectedRecipeError, setSelectedRecipeError] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showRecipeSteps, setShowRecipeSteps] = useState(false);

  // 読み上げ機能の状態
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [autoSpeechEnabled, setAutoSpeechEnabled] = useState(true);

    // ステップを読み上げる
  const speakStep = useCallback((stepTitle: string, stepDescription: string) => {
    if (!autoSpeechEnabled) return;

    console.log('🔊 ステップ読み上げ開始:', stepTitle);

    // 既存の読み上げを停止
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    // 音声認識を一時停止
    if (isRecording) {
      console.log('⏸️ 読み上げのため音声認識を一時停止');
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setShouldRestart(false);
      }
    }

    const text = `${stepTitle}。${stepDescription}`;
    const utterance = new SpeechSynthesisUtterance(text);

    // 日本語設定
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9; // 少しゆっくり
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      console.log('🎤 読み上げ開始');
      setIsSpeaking(true);
    };

            utterance.onend = () => {
      console.log('✅ 読み上げ完了');
      setIsSpeaking(false);
      setSpeechUtterance(null);
    };

    utterance.onerror = (event) => {
      console.error('❌ 読み上げエラー:', event.error);
      setIsSpeaking(false);
      setSpeechUtterance(null);
    };

    setSpeechUtterance(utterance);
    speechSynthesis.speak(utterance);
  }, [autoSpeechEnabled, isRecording, showRecipeSteps]);

  // 読み上げ完了後の自動音声認識再開
  useEffect(() => {
    if (!isSpeaking && showRecipeSteps && !isRecording && autoSpeechEnabled) {
      const timer = setTimeout(() => {
        console.log('🔄 読み上げ完了後、音声認識を自動再開します');
        startRecording();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isSpeaking, showRecipeSteps, isRecording, autoSpeechEnabled]);

  // 読み上げを停止
  const stopSpeaking = useCallback(() => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeechUtterance(null);
      console.log('🔇 読み上げを停止しました');
    }
  }, []);

  // レシピの選択（IDで詳細取得）
  const handleSelectRecipe = useCallback(async (recipeId: string) => {
    console.log('🔍 レシピ詳細を取得開始:', recipeId);
    setSelectedRecipeLoading(true);
    setSelectedRecipeError(null);

    try {
      const recipeDetail = await recipeService.getRecipeById(recipeId);
      console.log('✅ レシピ詳細取得成功:', recipeDetail);

      if (recipeDetail) {
        setSelectedRecipe(recipeDetail);
        setCurrentStepIndex(0);
        setShowRecipeSteps(true);

        // 最初のステップを読み上げ
        if (recipeDetail.instructions && recipeDetail.instructions.length > 0 && autoSpeechEnabled) {
          const firstInstruction = recipeDetail.instructions[0];
          setTimeout(() => {
            speakStep(firstInstruction.title, firstInstruction.description);
          }, 1000); // レシピ表示後少し間を置いて読み上げ開始
        }
      } else {
        setSelectedRecipeError('レシピが見つかりませんでした');
      }
    } catch (error) {
      console.error('❌ レシピ詳細取得エラー:', error);
      setSelectedRecipeError(
        error instanceof Error ? error.message : 'レシピ詳細の取得に失敗しました'
      );
    } finally {
      setSelectedRecipeLoading(false);
    }
  }, [recipeService, autoSpeechEnabled, speakStep]);

  // 次のステップへ
  const nextStep = useCallback(() => {
    console.log('🔄 nextStep関数が呼ばれました');
    setCurrentStepIndex(prev => {
      console.log('📊 nextStep - 現在のインデックス:', prev);
      if (selectedRecipe && selectedRecipe.instructions && prev < selectedRecipe.instructions.length - 1) {
        console.log('✅ 次のステップに移動:', prev, '->', prev + 1);
        const newIndex = prev + 1;

        // 新しいステップを読み上げ
        const instruction = selectedRecipe.instructions[newIndex];
        if (instruction && autoSpeechEnabled) {
          setTimeout(() => {
            speakStep(instruction.title, instruction.description);
          }, 100); // 少し遅延させて状態更新を待つ
        }

        return newIndex;
      } else {
        console.log('⚠️ 最後のステップなので移動しません');
        return prev;
      }
    });
  }, [selectedRecipe, autoSpeechEnabled, speakStep]);

  // 前のステップへ
  const prevStep = useCallback(() => {
    console.log('🔄 prevStep関数が呼ばれました');
    setCurrentStepIndex(prev => {
      console.log('📊 prevStep - 現在のインデックス:', prev);
      if (prev > 0) {
        console.log('✅ 前のステップに移動:', prev, '->', prev - 1);
        const newIndex = prev - 1;

        // 新しいステップを読み上げ
        if (selectedRecipe && selectedRecipe.instructions && autoSpeechEnabled) {
          const instruction = selectedRecipe.instructions[newIndex];
          if (instruction) {
            setTimeout(() => {
              speakStep(instruction.title, instruction.description);
            }, 100); // 少し遅延させて状態更新を待つ
          }
        }

        return newIndex;
      } else {
        console.log('⚠️ 最初のステップなので移動しません');
        return prev;
      }
    });
  }, [selectedRecipe, autoSpeechEnabled, speakStep]);

    // レシピ一覧に戻る
  const backToRecipeList = useCallback(() => {
    stopSpeaking(); // 読み上げを停止
    setShowRecipeSteps(false);
    setSelectedRecipe(null);
    setSelectedRecipeLoading(false);
    setSelectedRecipeError(null);
    setCurrentStepIndex(0);
  }, [stopSpeaking]);

  const startRecording = async () => {
    try {
      // Web Speech APIを直接使用する場合
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'ja-JP';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsRecording(true);
          setStatus('listening');
          setStatusMessage('音声を聞いています...');
        };

        recognition.onresult = (event: { resultIndex: any; results: string | any[]; }) => {
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

          // 新しく確定されたテキストがある場合のみ追加
          if (finalText) {
            console.log('🎤 音声認識結果:', finalText);
            console.log('📱 現在の状態 - showRecipeSteps:', showRecipeSteps, 'currentStepIndex:', currentStepIndex);

            // トリガーワード検知
            const { hasNext, hasPrev } = detectTriggerWords(finalText);
            console.log('🔍 トリガーワード検知結果:', { hasNext, hasPrev });

            let triggerMessage = '';
            if (hasNext) {
              triggerMessage = '「次」を感知しました';
              console.log('➡️ 次のステップに移動します');
              setTriggerHistory(prev => [...prev, `${new Date().toLocaleTimeString()}: 次トリガー検知 - "${finalText}"`]);
              // レシピステップ表示中の場合は次のステップへ
              if (showRecipeSteps) {
                console.log('📍 nextStep()を実行します');
                setTimeout(() => nextStep(), 0); // 非同期で実行して状態更新の競合を避ける
              }
            }
            if (hasPrev) {
              triggerMessage = '「前」を感知しました';
              console.log('⬅️ 前のステップに移動します');
              setTriggerHistory(prev => [...prev, `${new Date().toLocaleTimeString()}: 前トリガー検知 - "${finalText}"`]);
              // レシピステップ表示中の場合は前のステップへ
              if (showRecipeSteps) {
                console.log('📍 prevStep()を実行します');
                setTimeout(() => prevStep(), 0); // 非同期で実行して状態更新の競合を避ける
              } else {
                console.log('⚠️ showRecipeStepsがfalseのため、prevStep()をスキップします');
              }
            }

            // 前回の文字起こしが完了していた場合は置き換え、そうでなければ追加
            if (isTranscriptCompleted) {
              setTranscript(finalText);
              setIsTranscriptCompleted(false);
            } else {
              setTranscript(prev => prev + finalText);
            }

            // 確定後、短時間successを表示してからlisteningに戻る
            setStatus('success');
            setStatusMessage(triggerMessage || '文字起こし完了');
            setIsTranscriptCompleted(true);

            setTimeout(() => {
              if (shouldRestart && isRecording) {
                setStatus('listening');
                setStatusMessage('音声を聞いています...');
              }
            }, 500);
          }

          // 中間結果を更新
          setInterimTranscript(interimText);

          // 中間結果がある場合は処理中状態
          if (interimText && !finalText) {
            setStatus('processing');
            setStatusMessage('音声を認識中...');
          }
        };

        recognition.onerror = (event: { error: string; }) => {
          console.error('Speech recognition error:', event.error);

          // no-speechエラーの場合は自動的に再開を試行
          if (event.error === 'no-speech' && shouldRestart) {
            console.log('No speech detected, will restart...');
            setStatus('listening');
            setStatusMessage('音声を待機中...');
            // onendイベントで自動的に再開される
            return;
          }

          // その他のエラーの場合は停止
          setIsRecording(false);
          setShouldRestart(false);
          setStatus('error');
          setStatusMessage(`音声認識エラー: ${event.error}`);

          // タイムアウトをクリア
          if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = null;
          }
        };

        recognition.onend = () => {
          console.log('Recognition ended, shouldRestart:', shouldRestart);
          setInterimTranscript(''); // 録音終了時に中間結果をクリア

          // エラーでない場合、かつshouldRestartがtrueの場合は自動的に再開
          if (shouldRestart && status !== 'error') {
            restartTimeoutRef.current = setTimeout(() => {
              if (shouldRestart && recognitionRef.current) {
                try {
                  console.log('Restarting recognition...');
                  recognitionRef.current.start();
                } catch (error) {
                  console.error('Failed to restart recognition:', error);
                  setIsRecording(false);
                  setShouldRestart(false);
                  setStatus('error');
                  setStatusMessage('音声認識の再開に失敗しました');
                }
              }
            }, 100); // 短い遅延で再開
          } else {
            setIsRecording(false);
            setShouldRestart(false);
            if (status !== 'error') {
              setStatus('idle');
              setStatusMessage('');
            }
          }
        };

        recognitionRef.current = recognition;
        setShouldRestart(true); // 自動再開を有効にする
        setIsTranscriptCompleted(false); // 録音開始時にリセット
        recognition.start();
        return;
      }

      // Web Speech APIが利用できない場合はMediaRecorderを使用
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus('listening');
      setStatusMessage('録音中...');
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('録音の開始に失敗しました。マイクのアクセス許可を確認してください。');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setShouldRestart(false);
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
    setStatus('processing');
    setStatusMessage('音声を処理中...');
    setInterimTranscript(''); // 停止時に中間結果をクリア

    // タイムアウトをクリア
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setStatus('processing');
    setStatusMessage('音声を文字起こし中...');

    try {
      // Web Speech APIを使用してリアルタイム処理を試行
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'ja-JP';
        recognition.continuous = false;
        recognition.interimResults = false;

        return new Promise((resolve, reject) => {
          recognition.onresult = (event: { results: { transcript: any; }[][]; }) => {
            const transcript = event.results[0][0].transcript;
            setTranscript(transcript);
            setIsProcessing(false);
            resolve(transcript);
          };

          recognition.onerror = (event: { error: string; }) => {
            console.error('Speech recognition error:', event.error);
            setIsProcessing(false);
            reject(new Error('音声認識エラー: ' + event.error));
          };

          recognition.start();
        });
      } else {
        // Web Speech APIが利用できない場合はサーバーサイドAPIを使用
        const formData = new FormData();
        formData.append('audio', audioBlob, 'audio.wav');

        const response = await fetch('/api/speech-to-text', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('音声の文字起こしに失敗しました');
        }

        const data = await response.json();
        setTranscript(data.transcript);
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert('音声の文字起こしに失敗しました。');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setStatus('idle');
    setStatusMessage('');
    setShouldRestart(false);
    setIsTranscriptCompleted(false);

    // タイムアウトをクリア
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'listening': return 'text-blue-600';
      case 'processing': return 'text-yellow-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'listening': return '🎤';
      case 'processing': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '💬';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          音声操作レシピナビゲーター
        </h1>

        {/* 音声認識・読み上げコントロール */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={startRecording}
                disabled={isRecording || isProcessing || isSpeaking}
                className={`px-6 py-3 rounded-lg font-medium ${
                  isRecording || isProcessing || isSpeaking
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {isRecording ? '録音中...' : '音声認識開始'}
              </button>

              <button
                onClick={stopRecording}
                disabled={!isRecording || isProcessing}
                className={`px-6 py-3 rounded-lg font-medium ${
                  !isRecording || isProcessing
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                音声認識停止
              </button>

              <button
                onClick={() => setAutoSpeechEnabled(!autoSpeechEnabled)}
                className={`px-6 py-3 rounded-lg font-medium ${
                  autoSpeechEnabled
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                }`}
              >
                {autoSpeechEnabled ? '🔊 読み上げON' : '🔇 読み上げOFF'}
              </button>

              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="px-6 py-3 rounded-lg font-medium bg-orange-500 hover:bg-orange-600 text-white"
                >
                  🛑 読み上げ停止
                </button>
              )}
            </div>

            {(status !== 'idle' || isSpeaking) && (
              <div className="flex items-center space-x-4">
                {isSpeaking && (
                  <div className="flex items-center space-x-2 font-medium text-green-600">
                    <span className="text-lg">🔊</span>
                    <span>ステップを読み上げ中...</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
                {status !== 'idle' && !isSpeaking && (
                  <div className={`flex items-center space-x-2 font-medium ${getStatusColor()}`}>
                    <span className="text-lg">{getStatusIcon()}</span>
                    <span>{statusMessage}</span>
                    {status === 'listening' && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                    {status === 'processing' && (
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-spin border-2 border-transparent border-t-yellow-600"></div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* レシピ一覧またはステップ表示 */}
        {!showRecipeSteps ? (
          // レシピ一覧表示
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">レシピ一覧</h2>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-600 text-center py-8">
                <p>エラー: {error}</p>
                                 <button
                   onClick={fetchRecipes}
                   className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                 >
                  再試行
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                         onClick={() => handleSelectRecipe(recipe.id!)}
                  >
                    {recipe.imageUrl && (
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {recipe.title || '無題のレシピ'}
                      </h3>
                      {recipe.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {recipe.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          {recipe.prepTime && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {recipe.prepTime}分
                            </span>
                          )}
                          {recipe.servings && (
                            <span>{recipe.servings}人分</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // レシピステップ表示
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {selectedRecipe ? selectedRecipe.title : 'レシピ詳細'}
              </h2>
              <button
                onClick={backToRecipeList}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                レシピ一覧に戻る
              </button>
            </div>

            {/* レシピ詳細のローディング状態 */}
            {selectedRecipeLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">レシピ詳細を読み込み中...</span>
              </div>
            )}

            {/* レシピ詳細のエラー状態 */}
            {selectedRecipeError && (
              <div className="text-red-600 text-center py-8">
                <p>エラー: {selectedRecipeError}</p>
                <button
                  onClick={backToRecipeList}
                  className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  レシピ一覧に戻る
                </button>
              </div>
            )}

            {/* レシピ詳細が取得できた場合 */}
            {selectedRecipe && !selectedRecipeLoading && !selectedRecipeError && (
              <div>

              {selectedRecipe.instructions && selectedRecipe.instructions.length > 0 ? (
                <div>
                  <div className="mb-4">
                                         <div className="flex items-center justify-between">
                       <h3 className="text-lg font-medium text-gray-700">
                         ステップ {currentStepIndex + 1} / {selectedRecipe.instructions.length}
                       </h3>
                       <div className="text-sm text-gray-500">
                         音声で「次」「前」と言ってステップを切り替えられます
                         <div className="text-xs text-blue-600 mt-1">
                           デバッグ: showRecipeSteps={showRecipeSteps.toString()}, currentStep={currentStepIndex}
                         </div>
                       </div>
                     </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${((currentStepIndex + 1) / selectedRecipe.instructions.length) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-3">
                      {selectedRecipe.instructions[currentStepIndex].title}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedRecipe.instructions[currentStepIndex].description}
                    </p>
                    {selectedRecipe.instructions[currentStepIndex].estimatedTime && (
                      <div className="mt-3 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          推定時間: {selectedRecipe.instructions[currentStepIndex].estimatedTime}分
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      disabled={currentStepIndex === 0}
                      className={`px-6 py-3 rounded-lg font-medium ${
                        currentStepIndex === 0
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-gray-500 hover:bg-gray-600 text-white'
                      }`}
                    >
                      前のステップ
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={currentStepIndex === selectedRecipe.instructions.length - 1}
                      className={`px-6 py-3 rounded-lg font-medium ${
                        currentStepIndex === selectedRecipe.instructions.length - 1
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      次のステップ
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">このレシピには手順が設定されていません。</p>
              )}
              </div>
            )}
          </div>
        )}

        {/* 文字起こし結果表示 */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-gray-800">
                音声認識結果
              </h2>
              {status !== 'idle' && (
                <div className={`flex items-center space-x-1 text-sm ${getStatusColor()}`}>
                  <span>{getStatusIcon()}</span>
                  <span className="font-medium">{statusMessage}</span>
                </div>
              )}
            </div>
            <button
              onClick={clearTranscript}
              className="px-4 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!transcript && !interimTranscript}
            >
              クリア
            </button>
          </div>
          <div className={`rounded p-4 min-h-[100px] border-2 ${
            status === 'error' ? 'bg-red-50 border-red-200' :
            status === 'success' ? 'bg-green-50 border-green-200' :
            status === 'processing' ? 'bg-yellow-50 border-yellow-200' :
            status === 'listening' ? 'bg-blue-50 border-blue-200' :
            'bg-gray-50 border-gray-200'
          }`}>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {transcript}
              {interimTranscript && (
                <span className="text-blue-600 italic bg-blue-100 px-1 rounded">
                  {interimTranscript}
                </span>
              )}
            </p>
            {!transcript && !interimTranscript && (
              <p className="text-gray-400 italic flex items-center space-x-2">
                <span>🎤</span>
                <span>音声認識を開始してください...</span>
              </p>
            )}
          </div>
        </div>

        {/* トリガー履歴セクション */}
        {triggerHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                音声コマンド履歴
              </h3>
              <button
                onClick={() => setTriggerHistory([])}
                className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                履歴をクリア
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {triggerHistory.slice(-10).reverse().map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded border-l-4 border-blue-400"
                >
                  <p className="text-sm text-gray-700 font-mono">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}