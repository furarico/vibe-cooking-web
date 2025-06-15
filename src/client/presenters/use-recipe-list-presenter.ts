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
}

export interface RecipeListPresenterActions {
  fetchRecipes: (filters?: RecipeListFilters) => Promise<void>;
  setFilters: (filters: RecipeListFilters) => void;
  refreshRecipes: () => Promise<void>;
}

export const useRecipeListPresenter = (
  initialFilters?: RecipeListFilters
): RecipeListPresenterState & RecipeListPresenterActions => {
  const { recipeListService } = useDI();

  const [state, setState] = useState<RecipeListPresenterState>({
    recipes: [],
    loading: true,
    filters: initialFilters || {},
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

  const setFilters = useCallback((filters: RecipeListFilters) => {
    setState(prev => ({ ...prev, filters }));
  }, []);

  const refreshRecipes = useCallback(async () => {
    await fetchRecipes(state.filters);
  }, [fetchRecipes, state.filters]);

  useEffect(() => {
    fetchRecipes(initialFilters);
  }, [fetchRecipes, initialFilters]);

  return {
    ...state,
    fetchRecipes,
    setFilters,
    refreshRecipes,
  };
};
