// Trial

import { components } from '@/types/api';
import Image from 'next/image';
import React from 'react';

type Recipe = components['schemas']['Recipe'];

interface RecipeDetailProps {
  recipe: Recipe;
  currentStepIndex: number;
  loading: boolean;
  error: string | null;
  onBackToList: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  currentStepIndex,
  loading,
  error,
  onBackToList,
  onNextStep,
  onPrevStep,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">レシピ詳細を読み込み中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-600 text-center py-8">
          <p>エラー: {error}</p>
          <button
            onClick={onBackToList}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            レシピ一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  const currentInstruction = recipe.instructions?.[currentStepIndex];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {recipe.title || 'レシピ詳細'}
        </h2>
        <button
          onClick={onBackToList}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
        >
          レシピ一覧に戻る
        </button>
      </div>

      {recipe.instructions && recipe.instructions.length > 0 ? (
        <div>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-700">
                ステップ {currentStepIndex + 1} / {recipe.instructions.length}
              </h3>
              <div className="text-sm text-gray-500">
                音声で「次」「前」と言ってステップを切り替えられます
                <div className="text-xs text-blue-600 mt-1">
                  デバッグ: currentStep={currentStepIndex}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStepIndex + 1) / recipe.instructions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {currentInstruction && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-xl font-semibold text-gray-800">
                  {currentInstruction.title}
                </h4>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                {currentInstruction.description}
              </p>
              {currentInstruction.estimatedTime && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  推定時間: {currentInstruction.estimatedTime}分
                </div>
              )}
              {currentInstruction.imageUrl && (
                <Image
                  src={currentInstruction.imageUrl}
                  alt={currentInstruction.title || 'ステップ画像'}
                  width={800}
                  height={256}
                  className="w-full h-64 object-cover rounded-lg mt-4"
                />
              )}
            </div>
          )}

          <div className="flex justify-between space-x-4">
            <button
              onClick={onPrevStep}
              disabled={currentStepIndex === 0}
              className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              ← 前のステップ
            </button>
            <button
              onClick={onNextStep}
              disabled={currentStepIndex >= recipe.instructions.length - 1}
              className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              次のステップ →
            </button>
          </div>

          {/* 音声操作のヒント */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-blue-700">
              💡 音声操作:
              「次」または「前」と話すとステップを切り替えられます。
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          このレシピには手順が登録されていません
        </div>
      )}
    </div>
  );
};
