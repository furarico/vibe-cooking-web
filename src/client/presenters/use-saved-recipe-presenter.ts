'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDI } from '../di/providers';

/**
 * レシピの保存状態を管理するプレゼンター
 */
export function useSavedRecipePresenter(recipeId: string) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canSave, setCanSave] = useState(true);
  const router = useRouter();

  // サービス層のインスタンスを取得
  const { savedRecipeService } = useDI();

  // 初期化時に保存状態をチェック
  useEffect(() => {
    if (recipeId) {
      setIsSaved(savedRecipeService.isRecipeSaved(recipeId));
      setCanSave(savedRecipeService.canSaveMoreRecipes());
      setIsLoading(false);
    }
  }, [recipeId, savedRecipeService]);

  /**
   * レシピを保存する
   */
  const handleSaveRecipe = () => {
    const result = savedRecipeService.saveRecipe(recipeId);

    if (result.success) {
      setIsSaved(true);
      setCanSave(savedRecipeService.canSaveMoreRecipes());

      // サービス層で決定された遷移先に移動
      if (result.nextRoute) {
        router.push(result.nextRoute);
      }
    }

    return result.success;
  };

  /**
   * レシピを削除する
   */
  const handleRemoveRecipe = () => {
    const success = savedRecipeService.removeRecipe(recipeId);
    if (success) {
      setIsSaved(false);
      setCanSave(savedRecipeService.canSaveMoreRecipes());
    }
    return success;
  };

  /**
   * 保存状態をトグルする
   */
  const toggleSaveRecipe = () => {
    const result = savedRecipeService.toggleSaveRecipe(recipeId);

    if (result.success) {
      setIsSaved(result.isSaved);
      setCanSave(savedRecipeService.canSaveMoreRecipes());

      // 保存時の遷移処理
      if (result.isSaved && result.nextRoute) {
        router.push(result.nextRoute);
      }
    }

    return result.success;
  };

  return {
    isSaved,
    isLoading,
    canSave,
    saveRecipe: handleSaveRecipe,
    removeRecipe: handleRemoveRecipe,
    toggleSaveRecipe,
  };
}
