'use client';

import { useSavedRecipePresenter } from '@/client/presenters/use-saved-recipe-presenter';

/**
 * レシピの保存状態を管理するカスタムフック
 *
 * @deprecated このフックは後方互換性のために残されています。
 * 新しいコードでは useSavedRecipePresenter を直接使用してください。
 */
export function useSavedRecipe(recipeId: string) {
  return useSavedRecipePresenter(recipeId);
}
