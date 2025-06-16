'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SavedRecipeContainer } from '../di/saved-recipe-container';

/**
 * レシピの保存状態を管理するプレゼンター
 */
export function useSavedRecipePresenter(recipeId: string) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canSave, setCanSave] = useState(true);
  const router = useRouter();

  // サービス層のインスタンスを取得
  const service = SavedRecipeContainer.getService();

  // 初期化時に保存状態をチェック
  useEffect(() => {
    if (recipeId) {
      setIsSaved(service.isRecipeSaved(recipeId));
      setCanSave(service.canSaveMoreRecipes());
      setIsLoading(false);
    }
  }, [recipeId, service]);

  /**
   * レシピを保存する
   */
  const handleSaveRecipe = () => {
    const result = service.saveRecipe(recipeId);

    if (result.success) {
      setIsSaved(true);
      setCanSave(service.canSaveMoreRecipes());

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
    const success = service.removeRecipe(recipeId);
    if (success) {
      setIsSaved(false);
      setCanSave(service.canSaveMoreRecipes());
    }
    return success;
  };

  /**
   * 保存状態をトグルする
   */
  const toggleSaveRecipe = () => {
    const result = service.toggleSaveRecipe(recipeId);

    if (result.success) {
      setIsSaved(result.isSaved);
      setCanSave(service.canSaveMoreRecipes());

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
