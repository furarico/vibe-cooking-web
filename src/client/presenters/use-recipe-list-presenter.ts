'use client';

import { useDI } from '@/client/di/providers';
import { RecipeListFilters } from '@/client/repositories/interfaces/i-recipe-repository';
import { Recipe } from '@/lib/api-client';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface RecipeListPresenterState {
  recipes: Recipe[];
  loading: boolean;
  filters: RecipeListFilters;
  vibeCookingRecipeIds: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RecipeListPresenterActions { }

export interface RecipeListPresenter {
  state: RecipeListPresenterState;
  actions: RecipeListPresenterActions;
}

export const useRecipeListPresenter = (
  initialFilters?: RecipeListFilters
): RecipeListPresenter => {
  const { recipeListService, vibeCookingService } = useDI();

  const [state, setState] = useState<RecipeListPresenterState>({
    recipes: [],
    loading: true,
    filters: initialFilters || {},
    vibeCookingRecipeIds: [],
  });

  const fetchRecipes = useCallback(
    async (filters?: RecipeListFilters) => {
      setState(prev => ({ ...prev, loading: true }));

      try {
        const filtersToUse = filters || state.filters;
        const recipes = await recipeListService.getRecipes(filtersToUse);
        setState(prev => ({ ...prev, recipes, filters: filtersToUse }));
      } catch {
        toast.error('レシピの取得に失敗しました');
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    },
    [recipeListService, state.filters]
  );

  const actions: RecipeListPresenterActions = {};

  useEffect(() => {
    const getVibeCookingRecipeIds = () => {
      const vibeCookingRecipeIds = vibeCookingService.getVibeCookingRecipeIds();
      setState(prev => ({ ...prev, vibeCookingRecipeIds }));
    };

    fetchRecipes(initialFilters);
    getVibeCookingRecipeIds();

    window.addEventListener('focus', getVibeCookingRecipeIds);
    return () => {
      window.removeEventListener('focus', getVibeCookingRecipeIds);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 依存配列から fetchRecipes と initialFilters を除く

  return {
    state,
    actions,
  };
};
