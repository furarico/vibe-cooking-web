// Trial

import React from 'react';

interface SpeechControlProps {
  isRecording: boolean;
  isProcessing: boolean;
  status: 'idle' | 'listening' | 'processing' | 'success' | 'error';
  statusMessage: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'listening':
      return 'text-blue-600';
    case 'processing':
      return 'text-yellow-600';
    case 'success':
      return 'text-green-600';
    case 'error':
      return 'text-red-600';
    default:
      return 'text-gray-500';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'listening':
      return '🎤';
    case 'processing':
      return '⏳';
    case 'success':
      return '✅';
    case 'error':
      return '❌';
    default:
      return '💬';
  }
};

export const SpeechControl: React.FC<SpeechControlProps> = ({
  isRecording,
  isProcessing,
  status,
  statusMessage,
  onStartRecording,
  onStopRecording,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={onStartRecording}
            disabled={isRecording || isProcessing}
            className={`px-6 py-3 rounded-lg font-medium ${
              isRecording || isProcessing
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isRecording ? '録音中...' : '音声認識開始'}
          </button>

          <button
            onClick={onStopRecording}
            disabled={!isRecording || isProcessing}
            className={`px-6 py-3 rounded-lg font-medium ${
              !isRecording || isProcessing
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            音声認識停止
          </button>
        </div>

        {status !== 'idle' && (
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 font-medium ${getStatusColor(status)}`}
            >
              <span className="text-lg">{getStatusIcon(status)}</span>
              <span>{statusMessage}</span>
              {status === 'listening' && (
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              )}
              {status === 'processing' && (
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-spin border-2 border-transparent border-t-yellow-600"></div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
