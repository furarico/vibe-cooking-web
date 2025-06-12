'use client';

import { useDI } from '@/client/di/providers';
import { Recipe } from '@/lib/api-client';
import { useCallback, useEffect, useState } from 'react';

export interface RecipePresenterState {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
}

export interface RecipePresenterActions {
  fetchRecipes: () => Promise<void>;
  refreshRecipes: () => Promise<void>;
}

export const useRecipePresenter = (): RecipePresenterState &
  RecipePresenterActions => {
  const { recipeService } = useDI();

  const [state, setState] = useState<RecipePresenterState>({
    recipes: [],
    loading: false,
    error: null,
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
    refreshRecipes,
  };
};
