'use client';

import {
  canSaveMoreRecipes,
  getSavedRecipesCount,
  isRecipeSaved,
  removeRecipe,
  saveRecipe,
} from '@/lib/local-storage';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * レシピの保存状態を管理するカスタムフック
 */
export function useSavedRecipe(recipeId: string) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canSave, setCanSave] = useState(true);
  const router = useRouter();

  // 初期化時に保存状態をチェック
  useEffect(() => {
    if (recipeId) {
      setIsSaved(isRecipeSaved(recipeId));
      setCanSave(canSaveMoreRecipes());
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

    // 保存前の状態をチェック
    const currentCount = getSavedRecipesCount();
    const success = saveRecipe(recipeId);

    if (success) {
      setIsSaved(true);
      setCanSave(canSaveMoreRecipes());

      // 3つ目を追加した場合は追加画面に遷移
      if (currentCount === 2) {
        router.push('/recipes/add');
      } else {
        // 1つ目、2つ目の場合はホーム画面に遷移
        router.push('/');
      }
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
      setCanSave(canSaveMoreRecipes());
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
    canSave,
    saveRecipe: handleSaveRecipe,
    removeRecipe: handleRemoveRecipe,
    toggleSaveRecipe,
  };
}
