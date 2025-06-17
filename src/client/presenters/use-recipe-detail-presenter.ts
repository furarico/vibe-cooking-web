'use client';

import { useDI } from '@/client/di/providers';
import { Recipe } from '@/lib/api-client';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface RecipeDetailPresenterState {
  recipe: Recipe | null;
  loading: boolean;
  currentStep: number;
  isCompleted: boolean;
  recipeId: string | null;
  vibeCookingRecipeIds: string[];
}

export interface RecipeDetailPresenterActions {
  setRecipeId: (id: string) => void;
  onAddToVibeCookingListButtonTapped: () => void;
}

export interface RecipeDetailPresenter {
  state: RecipeDetailPresenterState;
  actions: RecipeDetailPresenterActions;
}

export const useRecipeDetailPresenter = (): RecipeDetailPresenter => {
  const { recipeService, vibeCookingService } = useDI();

  const [state, setState] = useState<RecipeDetailPresenterState>({
    recipe: null,
    loading: false,
    currentStep: 0,
    isCompleted: false,
    recipeId: null,
    vibeCookingRecipeIds: [],
  });

  const getVibeCookingRecipeIds = () => {
    const vibeCookingRecipeIds = vibeCookingService.getVibeCookingRecipeIds();
    setState(prev => ({ ...prev, vibeCookingRecipeIds }));
  };

  const actions: RecipeDetailPresenterActions = {
    setRecipeId: useCallback((id: string) => {
      setState(prev => ({ ...prev, recipeId: id }));
    }, []),
    onAddToVibeCookingListButtonTapped: useCallback(() => {
      if (state.vibeCookingRecipeIds.length >= 3) {
        toast.error('Vibe Cooking リストの上限に達しています');
        return;
      }
      const recipeId = state.recipeId;
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.recipeId, state.vibeCookingRecipeIds, vibeCookingService]),
  };

  useEffect(() => {
    getVibeCookingRecipeIds();

    window.addEventListener('focus', getVibeCookingRecipeIds);

    return () => {
      window.removeEventListener('focus', getVibeCookingRecipeIds);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vibeCookingService]);

  useEffect(() => {
    const fetchRecipe = async (id: string) => {
      setState(prev => ({ ...prev, loading: true }));

      try {
        const recipe = await recipeService.getRecipeById(id);

        if (!recipe) {
          setState(prev => ({ ...prev, loading: false }));
          toast.error('レシピが見つかりませんでした');
          return;
        }

        setState(prev => ({
          ...prev,
          recipe,
          loading: false,
          currentStep: 0,
          isCompleted: false,
        }));
      } catch {
        setState(prev => ({ ...prev, loading: false }));
        toast.error('レシピの取得に失敗しました');
      }
    };

    if (state.recipeId) {
      fetchRecipe(state.recipeId);
    }
  }, [state.recipeId, recipeService]);

  useEffect(() => {
    const recipeId = state.recipeId;
    if (recipeId && state.vibeCookingRecipeIds.length > 0) {
      setState(prev => ({
        ...prev,
        isInVibeCookingList: state.vibeCookingRecipeIds.includes(recipeId),
      }));
    }
  }, [state.recipeId, state.vibeCookingRecipeIds]);

  return {
    state,
    actions,
  };
};
