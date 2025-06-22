'use client';

import { useDI } from '@/client/di/providers';
import { Recipe } from '@/lib/api-client';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface RecipeDetailPresenterState {
  loading: boolean;
  currentStep: number;
  isCompleted: boolean;
  vibeCookingRecipeIds: string[];
}

export interface RecipeDetailPresenterActions {
  onAddToVibeCookingListButtonTapped: () => void;
}

export interface RecipeDetailPresenter {
  state: RecipeDetailPresenterState;
  actions: RecipeDetailPresenterActions;
}

export const useRecipeDetailPresenter = (
  recipe: Recipe
): RecipeDetailPresenter => {
  const { vibeCookingService } = useDI();

  const [state, setState] = useState<RecipeDetailPresenterState>({
    loading: false,
    currentStep: 0,
    isCompleted: false,
    vibeCookingRecipeIds: [],
  });

  const getVibeCookingRecipeIds = useCallback(() => {
    const vibeCookingRecipeIds = vibeCookingService.getVibeCookingRecipeIds();
    setState(prev => ({ ...prev, vibeCookingRecipeIds }));
  }, [vibeCookingService]);

  const actions: RecipeDetailPresenterActions = {
    onAddToVibeCookingListButtonTapped: useCallback(() => {
      if (state.vibeCookingRecipeIds.length >= 3) {
        toast.error('Vibe Cooking リストの上限に達しています');
        return;
      }
      const recipeId = recipe.id;
      if (!recipeId) {
        toast.error('レシピが見つかりません');
        return;
      }
      if (state.vibeCookingRecipeIds.includes(recipeId)) {
        vibeCookingService.removeVibeCookingRecipeId(recipeId);
        getVibeCookingRecipeIds();
        toast.success('Vibe Cooking リストから削除しました');
      } else {
        vibeCookingService.addVibeCookingRecipeId(recipeId);
        getVibeCookingRecipeIds();
        toast.success('Vibe Cooking リストに追加しました');
      }
    }, [
      recipe.id,
      state.vibeCookingRecipeIds,
      vibeCookingService,
      getVibeCookingRecipeIds,
    ]),
  };

  useEffect(() => {
    getVibeCookingRecipeIds();

    window.addEventListener('focus', getVibeCookingRecipeIds);

    return () => {
      window.removeEventListener('focus', getVibeCookingRecipeIds);
    };
  }, [getVibeCookingRecipeIds]);

  useEffect(() => {
    const recipeId = recipe.id;
    if (recipeId && state.vibeCookingRecipeIds.length > 0) {
      setState(prev => ({
        ...prev,
        isInVibeCookingList: state.vibeCookingRecipeIds.includes(recipeId),
      }));
    }
  }, [recipe.id, state.vibeCookingRecipeIds]);

  return {
    state,
    actions,
  };
};
