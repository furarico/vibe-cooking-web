import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onGoBack
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full mx-4">
      <h3 className="text-red-800 font-semibold mb-2">エラーが発生しました</h3>
      <p className="text-red-600 mb-4">{message}</p>
      <div className="flex gap-2">
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            戻る
          </button>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            再読み込み
          </button>
        )}
      </div>
    </div>
  );
};