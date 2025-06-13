'use client';

import { useRecipePresenter } from '@/client/presenters/hooks/use-recipe-presenter';
import { RecipeDetail } from '@/components/recipe-detail';
import { RecipeList } from '@/components/recipe-list';
import { SpeechControl } from '@/components/speech-control';
import { SpeechTranscript } from '@/components/speech-transcript';
import { useRecipeNavigation } from '@/hooks/use-recipe-navigation';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';

export default function VoiceCooking() {
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
          音声クッキング
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
