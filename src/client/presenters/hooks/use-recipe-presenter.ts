'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDI } from '@/client/di/providers';
import { Recipe } from '@/lib/api-client';

export interface RecipePresenterState {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
  showDialog: boolean;
}

export interface RecipePresenterActions {
  fetchRecipes: () => Promise<void>;
  selectRecipe: (recipe: Recipe) => void;
  closeDialog: () => void;
  refreshRecipes: () => Promise<void>;
}

export const useRecipePresenter = (): RecipePresenterState &
  RecipePresenterActions => {
  const { recipeService } = useDI();

  const [state, setState] = useState<RecipePresenterState>({
    recipes: [],
    selectedRecipe: null,
    loading: false,
    error: null,
    showDialog: false,
  });

  // レシピ一覧取得
  const fetchRecipes = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const recipes = await recipeService.getAllRecipes();
      setState(prev => ({
        ...prev,
        recipes,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error:
          error instanceof Error ? error.message : '不明なエラーが発生しました',
        loading: false,
      }));
    }
  }, [recipeService]);

  // レシピ選択
  const selectRecipe = useCallback((recipe: Recipe) => {
    setState(prev => ({
      ...prev,
      selectedRecipe: recipe,
      showDialog: true,
    }));
  }, []);

  // ダイアログを閉じる
  const closeDialog = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedRecipe: null,
      showDialog: false,
    }));
  }, []);

  // リフレッシュ
  const refreshRecipes = useCallback(async () => {
    await fetchRecipes();
  }, [fetchRecipes]);

  // 初回データ取得
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return {
    ...state,
    fetchRecipes,
    selectRecipe,
    closeDialog,
    refreshRecipes,
  };
};
