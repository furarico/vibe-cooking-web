'use client';

import React from 'react';
import { useRecipePresenter } from '@/client/presenters/hooks/use-recipe-presenter';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useRecipeNavigation } from '@/hooks/useRecipeNavigation';
import { SpeechControl } from '@/components/SpeechControl';
import { SpeechTranscript } from '@/components/SpeechTranscript';
import { RecipeList } from '@/components/RecipeList';
import { RecipeDetail } from '@/components/RecipeDetail';

export default function SpeechToText() {
  // レシピ一覧のデータ
  const { recipes, loading, error, fetchRecipes } = useRecipePresenter();

  // レシピナビゲーションの状態とアクション
  const {
    selectedRecipe,
    selectedRecipeLoading,
    selectedRecipeError,
    currentStepIndex,
    showRecipeSteps,
    handleSelectRecipe,
    nextStep,
    prevStep,
    backToRecipeList,
  } = useRecipeNavigation();

  // 音声認識の状態とアクション
  const {
    isRecording,
    transcript,
    interimTranscript,
    isProcessing,
    status,
    statusMessage,
    triggerHistory,
    startRecording,
    stopRecording,
    clearTranscript,
    clearTriggerHistory,
  } = useSpeechRecognition({
    onNextTrigger: nextStep,
    onPrevTrigger: prevStep,
    showRecipeSteps,
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          音声認識レシピナビゲーター
        </h1>

        {/* 音声認識コントロール */}
        <SpeechControl
          isRecording={isRecording}
          isProcessing={isProcessing}
          status={status}
          statusMessage={statusMessage}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
        />

        {/* 音声認識結果とトリガー履歴 */}
        <SpeechTranscript
          transcript={transcript}
          interimTranscript={interimTranscript}
          triggerHistory={triggerHistory}
          status={status}
          onClearTranscript={clearTranscript}
          onClearTriggerHistory={clearTriggerHistory}
        />

        {/* メインコンテンツ */}
        {showRecipeSteps && selectedRecipe ? (
          <RecipeDetail
            recipe={selectedRecipe}
            currentStepIndex={currentStepIndex}
            loading={selectedRecipeLoading}
            error={selectedRecipeError}
            onBackToList={backToRecipeList}
            onNextStep={nextStep}
            onPrevStep={prevStep}
          />
        ) : (
          <RecipeList
            recipes={recipes}
            loading={loading}
            error={error}
            onSelectRecipe={handleSelectRecipe}
            onRefreshRecipes={fetchRecipes}
          />
        )}
      </div>
    </div>
  );
}