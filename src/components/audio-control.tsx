import React from 'react';

// テスト用：意図的なリントエラー（未使用変数）
const unusedTestVariable = 'this will cause lint error ';

interface AudioControlProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onPause: () => void;
}

export const AudioControl: React.FC<AudioControlProps> = ({
  isPlaying,
  onPlay,
  onStop,
  onPause,
}) => {
  return (
    <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-blue-700 font-medium">
          🎵 テスト音声:
        </span>

        {!isPlaying ? (
          <button
            onClick={onPlay}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            <span>再生</span>
          </button>
        ) : (
          <div className="flex space-x-1">
            <button
              onClick={onPause}
              className="flex items-center space-x-1 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>一時停止</span>
            </button>
            <button
              onClick={onStop}
              className="flex items-center space-x-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                  clipRule="evenodd"
                />
              </svg>
              <span>停止</span>
            </button>
          </div>
        )}

        {isPlaying && (
          <div className="flex items-center space-x-1 text-blue-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs">再生中</span>
          </div>
        )}
      </div>
    </div>
  );
};
