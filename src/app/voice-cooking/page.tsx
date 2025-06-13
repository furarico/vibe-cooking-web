'use client';

import { useDI } from '@/client/di/providers';
import { useRecipePresenter } from '@/client/presenters/hooks/use-recipe-presenter';
import { useVoiceCookingPresenter } from '@/client/presenters/voice-cooking-presenter';
import { RecipeDetail } from '@/components/recipe-detail';
import { RecipeList } from '@/components/recipe-list';
import { SpeechControl } from '@/components/speech-control';
import { SpeechTranscript } from '@/components/speech-transcript';

export default function VoiceCooking() {
  const { voiceCookingService } = useDI();

  // レシピ一覧のデータ
  const { recipes, loading, error, fetchRecipes } = useRecipePresenter();

  // 音声クッキングのプレゼンター
  const { state, actions } = useVoiceCookingPresenter(voiceCookingService);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          音声クッキング
        </h1>

        {/* 音声認識コントロール */}
        <SpeechControl
          isRecording={state.speechStatus.isRecording}
          isProcessing={state.speechStatus.isProcessing}
          status={state.speechStatus.status}
          statusMessage={state.speechStatus.statusMessage}
          onStartRecording={actions.startSpeechRecognition}
          onStopRecording={actions.stopSpeechRecognition}
        />

        {/* 音声認識結果とトリガー履歴 */}
        <SpeechTranscript
          transcript={state.transcript}
          interimTranscript={state.interimTranscript}
          triggerHistory={state.triggerHistory}
          status={state.speechStatus.status}
          onClearTranscript={actions.clearTranscript}
          onClearTriggerHistory={actions.clearTriggerHistory}
        />

        {/* メインコンテンツ */}
        {state.showRecipeSteps && state.selectedRecipe ? (
          <RecipeDetail
            recipe={state.selectedRecipe}
            currentStepIndex={state.currentStepIndex}
            loading={state.isRecipeLoading}
            error={state.recipeError}
            onBackToList={actions.backToRecipeList}
            onNextStep={actions.nextStep}
            onPrevStep={actions.prevStep}
          />
        ) : (
          <RecipeList
            recipes={recipes}
            loading={loading}
            error={error}
            onSelectRecipe={actions.selectRecipe}
            onRefreshRecipes={fetchRecipes}
          />
        )}
      </div>
    </div>
  );
}
