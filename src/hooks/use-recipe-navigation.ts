import { useDI } from '@/client/di/providers';
import { components } from '@/types/api';
import { useCallback, useState } from 'react';

type Recipe = components['schemas']['Recipe'];

export const useRecipeNavigation = () => {
  const { recipeService } = useDI();

  // レシピ関連の状態
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedRecipeLoading, setSelectedRecipeLoading] = useState(false);
  const [selectedRecipeError, setSelectedRecipeError] = useState<string | null>(
    null
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showRecipeSteps, setShowRecipeSteps] = useState(false);

  // レシピの選択（IDで詳細取得）
  const handleSelectRecipe = useCallback(
    async (recipeId: string) => {
      console.log('🔍 レシピ詳細を取得開始:', recipeId);
      setSelectedRecipeLoading(true);
      setSelectedRecipeError(null);

      try {
        const recipeDetail = await recipeService.getRecipeById(recipeId);
        console.log('✅ レシピ詳細取得成功:', recipeDetail);

        if (recipeDetail) {
          setSelectedRecipe(recipeDetail);
          setCurrentStepIndex(0);
          setShowRecipeSteps(true);
        } else {
          setSelectedRecipeError('レシピが見つかりませんでした');
        }
      } catch (error) {
        console.error('❌ レシピ詳細取得エラー:', error);
        setSelectedRecipeError(
          error instanceof Error
            ? error.message
            : 'レシピ詳細の取得に失敗しました'
        );
      } finally {
        setSelectedRecipeLoading(false);
      }
    },
    [recipeService]
  );

  // 次のステップへ
  const nextStep = useCallback(() => {
    console.log('🔄 nextStep関数が呼ばれました');
    setCurrentStepIndex(prev => {
      console.log('📊 nextStep - 現在のインデックス:', prev);
      console.log('📊 selectedRecipe:', selectedRecipe);
      console.log(
        '📊 instructions length:',
        selectedRecipe?.instructions?.length
      );
      if (
        selectedRecipe &&
        selectedRecipe.instructions &&
        prev < selectedRecipe.instructions.length - 1
      ) {
        console.log('✅ 次のステップに移動:', prev, '->', prev + 1);
        const newIndex = prev + 1;
        return newIndex;
      } else {
        console.log('⚠️ 最後のステップなので移動しません');
        return prev;
      }
    });
  }, [selectedRecipe]);

  // 前のステップへ
  const prevStep = useCallback(() => {
    console.log('🔄 prevStep関数が呼ばれました');
    setCurrentStepIndex(prev => {
      console.log('📊 prevStep - 現在のインデックス:', prev);
      if (prev > 0) {
        console.log('✅ 前のステップに移動:', prev, '->', prev - 1);
        const newIndex = prev - 1;
        return newIndex;
      } else {
        console.log('⚠️ 最初のステップなので移動しません');
        return prev;
      }
    });
  }, []);

  // レシピ一覧に戻る
  const backToRecipeList = useCallback(() => {
    setShowRecipeSteps(false);
    setSelectedRecipe(null);
    setSelectedRecipeLoading(false);
    setSelectedRecipeError(null);
    setCurrentStepIndex(0);
  }, []);

  // 現在のステップを取得
  const getCurrentStep = useCallback(() => {
    if (
      !selectedRecipe?.instructions ||
      currentStepIndex >= selectedRecipe.instructions.length
    ) {
      return null;
    }
    return selectedRecipe.instructions[currentStepIndex];
  }, [selectedRecipe, currentStepIndex]);

  return {
    // 状態
    selectedRecipe,
    selectedRecipeLoading,
    selectedRecipeError,
    currentStepIndex,
    showRecipeSteps,

    // アクション
    handleSelectRecipe,
    nextStep,
    prevStep,
    backToRecipeList,
    getCurrentStep,
  };
};
