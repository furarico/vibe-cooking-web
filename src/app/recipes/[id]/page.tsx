'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecipeDetailPresenter } from '@/presenters/hooks/useRecipeDetailPresenter';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;

  const {
    recipe,
    loading,
    error,
    currentStep,
    isCompleted,
    fetchRecipe,
    setCurrentStep,
    nextStep,
    prevStep,
    resetProgress
  } = useRecipeDetailPresenter();

  useEffect(() => {
    if (recipeId) {
      fetchRecipe(recipeId);
    }
  }, [recipeId, fetchRecipe]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <LoadingSpinner message="レシピを読み込み中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <ErrorMessage
          message={error}
          onGoBack={() => router.back()}
          onRetry={() => fetchRecipe(recipeId)}
        />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-gray-500">レシピが見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 戻るボタン */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            レシピ一覧に戻る
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 画像セクション */}
          {recipe.imageUrl && (
            <div className="h-64 md:h-80 bg-gray-200 relative overflow-hidden">
              <img
                src={recipe.imageUrl}
                alt={recipe.title || ''}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="p-6">
            {/* タイトルと基本情報 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {recipe.title || 'タイトル未設定'}
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                {recipe.description || '説明がありません'}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {recipe.prepTime || 0}
                  </div>
                  <div className="text-sm text-gray-600">準備時間(分)</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {recipe.cookTime || 0}
                  </div>
                  <div className="text-sm text-gray-600">調理時間(分)</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {recipe.servings || '?'}
                  </div>
                  <div className="text-sm text-gray-600">人分</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {recipe.formattedTime}
                  </div>
                  <div className="text-sm text-gray-600">合計時間</div>
                </div>
                <div className={`p-4 rounded-lg text-center ${
                  recipe.difficultyLevel === 'easy' ? 'bg-green-50' :
                  recipe.difficultyLevel === 'medium' ? 'bg-yellow-50' : 'bg-red-50'
                }`}>
                  <div className={`text-xl font-bold ${
                    recipe.difficultyLevel === 'easy' ? 'text-green-600' :
                    recipe.difficultyLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {recipe.difficultyLevel === 'easy' ? '簡単' :
                     recipe.difficultyLevel === 'medium' ? '普通' : '難しい'}
                  </div>
                  <div className="text-sm text-gray-600">難易度</div>
                </div>
              </div>

              {/* タグ */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">タグ</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* 材料セクション */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  🥕 材料 ({recipe.ingredients?.length || 0}種類)
                </h2>
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  <div className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <span className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                            {index + 1}
                          </span>
                          <div>
                            <span className="font-medium text-gray-900">{ingredient.name}</span>
                            {ingredient.notes && (
                              <div className="text-sm text-gray-500">{ingredient.notes}</div>
                            )}
                          </div>
                        </div>
                        <span className="font-semibold text-blue-600">
                          {ingredient.amount}{ingredient.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">材料情報がありません</p>
                )}
              </div>

              {/* 作り方セクション */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    👨‍🍳 作り方 ({recipe.instructions?.length || 0}ステップ)
                  </h2>
                  <button
                    onClick={resetProgress}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    進行状況リセット
                  </button>
                </div>

                {recipe.instructions && recipe.instructions.length > 0 ? (
                  <div className="space-y-4">
                    {recipe.instructions
                      .sort((a, b) => (a.step || 0) - (b.step || 0))
                      .map((instruction, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          currentStep === index
                            ? 'border-green-500 bg-green-50'
                            : currentStep > index
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-green-300'
                        }`}
                      >
                        <div className="flex items-start">
                          <button
                            onClick={() => setCurrentStep(index)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0 transition-colors ${
                              currentStep === index
                                ? 'bg-green-500 text-white'
                                : currentStep > index
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-green-200'
                            }`}
                          >
                            {currentStep > index ? '✓' : instruction.step || index + 1}
                          </button>
                          <div className="flex-1">
                            <p className="text-gray-700 leading-relaxed mb-2">
                              {instruction.description}
                            </p>
                            {instruction.estimatedTime && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                約 {instruction.estimatedTime}分
                              </div>
                            )}
                            {instruction.imageUrl && (
                              <img
                                src={instruction.imageUrl}
                                alt={`ステップ ${instruction.step}`}
                                className="mt-3 w-full h-32 object-cover rounded-lg"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">作り方の手順がありません</p>
                )}

                {/* ステップ制御ボタン */}
                {recipe.instructions && recipe.instructions.length > 0 && (
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      前のステップ
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={currentStep >= recipe.instructions.length - 1}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      次のステップ
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 完成・進行状況 */}
            {recipe.instructions && recipe.instructions.length > 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">調理進行状況</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    ステップ {currentStep + 1} / {recipe.instructions.length}
                    {isCompleted && ' (完了!)'}
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {Math.round(((currentStep + 1) / recipe.instructions.length) * 100)}% 完了
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentStep + 1) / recipe.instructions.length) * 100}%`
                    }}
                  ></div>
                </div>
                {isCompleted && (
                  <div className="mt-4 text-center">
                    <span className="text-green-600 font-semibold text-lg">🎉 調理完了！お疲れさまでした！</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}