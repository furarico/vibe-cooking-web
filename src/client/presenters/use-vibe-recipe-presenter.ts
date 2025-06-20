'use client';

import { useDI } from '@/client/di/providers';
<<<<<<< HEAD
import { Recipe, VibeRecipe } from '@/lib/api-client';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface VibeRecipePresenterState {
  recipeIds: string[];
  recipes: Recipe[];
  recipeTitles: string[];
=======
import { VibeRecipe } from '@/lib/api-client';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export interface VibeRecipePresenterState {
>>>>>>> origin/main
  vibeRecipe: VibeRecipe | null;
  loading: boolean;
  error: string | null;
}

export interface VibeRecipePresenterActions {
<<<<<<< HEAD
  setRecipeIds: (recipeIds: string[]) => void;
=======
>>>>>>> origin/main
  createVibeRecipe: (recipeIds: string[]) => Promise<void>;
  reset: () => void;
}

export const useVibeRecipePresenter = (): VibeRecipePresenterState &
  VibeRecipePresenterActions => {
<<<<<<< HEAD
  const { vibeRecipeService, recipeService } = useDI();

  const [state, setState] = useState<VibeRecipePresenterState>({
    recipeIds: [],
    recipes: [],
    recipeTitles: [],
=======
  const { vibeRecipeService } = useDI();

  const [state, setState] = useState<VibeRecipePresenterState>({
>>>>>>> origin/main
    vibeRecipe: null,
    loading: false,
    error: null,
  });

<<<<<<< HEAD
  const setRecipeIds = useCallback((recipeIds: string[]) => {
    setState(prev => ({ ...prev, recipeIds }));
  }, []);

=======
>>>>>>> origin/main
  const createVibeRecipe = useCallback(
    async (recipeIds: string[]) => {
      if (recipeIds.length === 0) {
        toast.error('レシピを選択してください');
        return;
      }

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const vibeRecipe = await vibeRecipeService.createVibeRecipe(recipeIds);
        setState(prev => ({
          ...prev,
          vibeRecipe,
          loading: false,
        }));
        toast.success('バイブレシピを作成しました');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '不明なエラーが発生しました';
        setState(prev => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
        toast.error('バイブレシピの作成に失敗しました');
      }
    },
    [vibeRecipeService]
  );

  const reset = useCallback(() => {
    setState({
<<<<<<< HEAD
      recipeIds: [],
      recipes: [],
      recipeTitles: [],
=======
>>>>>>> origin/main
      vibeRecipe: null,
      loading: false,
      error: null,
    });
  }, []);

<<<<<<< HEAD
  // レシピIDからレシピ詳細を取得
  useEffect(() => {
    if (state.recipeIds.length === 0) {
      setState(prev => ({ ...prev, recipes: [], recipeTitles: [] }));
      return;
    }

    const fetchRecipes = async () => {
      try {
        const recipes = await Promise.all(
          state.recipeIds.map(async recipeId => {
            const recipe = await recipeService.getRecipeById(recipeId);
            return recipe;
          })
        );

        const validRecipes = recipes.filter(
          (recipe): recipe is Recipe => recipe !== null
        );
        const recipeTitles = validRecipes.map(recipe => recipe.title || '');

        setState(prev => ({
          ...prev,
          recipes: validRecipes,
          recipeTitles,
        }));
      } catch (error) {
        console.error('レシピの取得に失敗しました:', error);
        setState(prev => ({ ...prev, recipes: [], recipeTitles: [] }));
      }
    };

    fetchRecipes();
  }, [state.recipeIds, recipeService]);

  return {
    ...state,
    setRecipeIds,
=======
  return {
    ...state,
>>>>>>> origin/main
    createVibeRecipe,
    reset,
  };
};
