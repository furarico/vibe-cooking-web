import { useCallback, useRef, useState } from 'react';

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
    | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

type RecognitionStatus =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'success'
  | 'error';

// トリガーワード検知機能
const detectTriggerWords = (text: string) => {
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
};

interface UseSpeechRecognitionOptions {
  onNextTrigger?: () => void;
  onPrevTrigger?: () => void;
  showRecipeSteps?: boolean;
}

export const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {}
) => {
  const { onNextTrigger, onPrevTrigger, showRecipeSteps = false } = options;

  // 音声認識の状態
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<RecognitionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [shouldRestart, setShouldRestart] = useState(false);
  const [isTranscriptCompleted, setIsTranscriptCompleted] = useState(false);
  const [triggerHistory, setTriggerHistory] = useState<string[]>([]);

  // refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      // Web Speech APIを直接使用する場合
      if (
        'webkitSpeechRecognition' in window ||
        'SpeechRecognition' in window
      ) {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
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

          // 新しく確定されたテキストがある場合のみ追加
          if (finalText) {
            console.log('🎤 音声認識結果:', finalText);
            console.log('📱 現在の状態 - showRecipeSteps:', showRecipeSteps);

            // トリガーワード検知
            const { hasNext, hasPrev } = detectTriggerWords(finalText);
            console.log('🔍 トリガーワード検知結果:', { hasNext, hasPrev });

            let triggerMessage = '';
            if (hasNext) {
              triggerMessage = '「次」を感知しました';
              console.log('➡️ 次のステップに移動します');
              setTriggerHistory(prev => [
                ...prev,
                `${new Date().toLocaleTimeString()}: 次トリガー検知 - "${finalText}"`,
              ]);
              // レシピステップ表示中の場合は次のステップへ
              if (showRecipeSteps && onNextTrigger) {
                console.log('📍 nextStep()を実行します');
                setTimeout(() => onNextTrigger(), 0);
              }
            }
            if (hasPrev) {
              triggerMessage = '「前」を感知しました';
              console.log('⬅️ 前のステップに移動します');
              setTriggerHistory(prev => [
                ...prev,
                `${new Date().toLocaleTimeString()}: 前トリガー検知 - "${finalText}"`,
              ]);
              // レシピステップ表示中の場合は前のステップへ
              if (showRecipeSteps && onPrevTrigger) {
                console.log('📍 prevStep()を実行します');
                setTimeout(() => onPrevTrigger(), 0);
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

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);

          // no-speechエラーの場合は自動的に再開を試行
          if (event.error === 'no-speech' && shouldRestart) {
            console.log('No speech detected, will restart...');
            setStatus('listening');
            setStatusMessage('音声を待機中...');
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
          setInterimTranscript('');

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
            }, 100);
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
        setShouldRestart(true);
        setIsTranscriptCompleted(false);
        recognition.start();
        return;
      }

      // Web Speech APIが利用できない場合はMediaRecorderを使用
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('マイクへのアクセスが許可されていません。');
    }
  }, [
    shouldRestart,
    isRecording,
    status,
    isTranscriptCompleted,
    showRecipeSteps,
    onNextTrigger,
    onPrevTrigger,
  ]);

  const stopRecording = useCallback(() => {
    setShouldRestart(false);

    // タイムアウトをクリア
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    // Web Speech APIを使用している場合
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setInterimTranscript('');
      return;
    }

    // MediaRecorderを使用している場合
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  }, [isRecording]);

  const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    try {
      // Web Speech APIを使用した音声認識
      if (
        'webkitSpeechRecognition' in window ||
        'SpeechRecognition' in window
      ) {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'ja-JP';
        recognition.continuous = false;
        recognition.interimResults = false;

        return new Promise((resolve, reject) => {
          recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            setTranscript(transcript);
            setIsProcessing(false);
            resolve(transcript);
          };

          recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
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

        const response = await fetch('/api/voice-cooking', {
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
  }, []);

  const clearTranscript = useCallback(() => {
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
  }, []);

  const clearTriggerHistory = useCallback(() => {
    setTriggerHistory([]);
  }, []);

  return {
    // 状態
    isRecording,
    transcript,
    interimTranscript,
    isProcessing,
    status,
    statusMessage,
    triggerHistory,

    // アクション
    startRecording,
    stopRecording,
    clearTranscript,
    clearTriggerHistory,
  };
};
