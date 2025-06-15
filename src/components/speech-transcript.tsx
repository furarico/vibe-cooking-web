// Trial

import React from 'react';

interface SpeechTranscriptProps {
  transcript: string;
  interimTranscript: string;
  triggerHistory: string[];
  status: 'idle' | 'listening' | 'processing' | 'success' | 'error';
  onClearTranscript: () => void;
  onClearTriggerHistory: () => void;
}

export const SpeechTranscript: React.FC<SpeechTranscriptProps> = ({
  transcript,
  interimTranscript,
  triggerHistory,
  status,
  onClearTranscript,
  onClearTriggerHistory,
}) => {
  if (!transcript && !interimTranscript && triggerHistory.length === 0) {
    return null;
  }

  return (
    <>
      {/* 文字起こし結果 */}
      {(transcript || interimTranscript) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              音声認識結果
            </h2>
            <button
              onClick={onClearTranscript}
              className="px-4 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded"
            >
              クリア
            </button>
          </div>
          <div
            className={`rounded p-4 border-2 ${
              status === 'error'
                ? 'bg-red-50 border-red-200'
                : status === 'success'
                  ? 'bg-green-50 border-green-200'
                  : status === 'processing'
                    ? 'bg-yellow-50 border-yellow-200'
                    : status === 'listening'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200'
            }`}
          >
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {transcript}
              {interimTranscript && (
                <span className="text-blue-600 italic bg-blue-100 px-1 rounded">
                  {interimTranscript}
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* トリガー履歴セクション */}
      {triggerHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              音声操作履歴
            </h3>
            <button
              onClick={onClearTriggerHistory}
              className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded"
            >
              履歴をクリア
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {triggerHistory
              .slice(-10)
              .reverse()
              .map((item, index) => (
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
    </>
  );
};
