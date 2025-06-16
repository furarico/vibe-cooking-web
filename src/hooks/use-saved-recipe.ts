'use client';

import { isRecipeSaved, removeRecipe, saveRecipe } from '@/lib/local-storage';
import { useEffect, useState } from 'react';

/**
 * レシピの保存状態を管理するカスタムフック
 */
export function useSavedRecipe(recipeId: string) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 初期化時に保存状態をチェック
  useEffect(() => {
    if (recipeId) {
      setIsSaved(isRecipeSaved(recipeId));
      setIsLoading(false);
    }
  }, [recipeId]);

  /**
   * レシピを保存する
   */
  const handleSaveRecipe = () => {
    if (!recipeId) {
      console.error('レシピIDが指定されていません');
      return false;
    }

    const success = saveRecipe(recipeId);
    if (success) {
      setIsSaved(true);
    }
    return success;
  };

  /**
   * レシピを削除する
   */
  const handleRemoveRecipe = () => {
    if (!recipeId) {
      console.error('レシピIDが指定されていません');
      return false;
    }

    const success = removeRecipe(recipeId);
    if (success) {
      setIsSaved(false);
    }
    return success;
  };

  /**
   * 保存状態をトグルする
   */
  const toggleSaveRecipe = () => {
    if (isSaved) {
      return handleRemoveRecipe();
    } else {
      return handleSaveRecipe();
    }
  };

  return {
    isSaved,
    isLoading,
    saveRecipe: handleSaveRecipe,
    removeRecipe: handleRemoveRecipe,
    toggleSaveRecipe,
  };
}
