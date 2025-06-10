'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDI } from '@/di/providers';
import { Recipe } from '@/lib/api';

export interface RecipePresenterState {
  recipes: Recipe[];
  filteredRecipes: Recipe[];
  selectedRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  servingsFilter: number;
  maxTimeFilter: number;
  showDialog: boolean;
}

export interface RecipePresenterActions {
  fetchRecipes: () => Promise<void>;
  selectRecipe: (recipe: Recipe) => void;
  closeDialog: () => void;
  setSearchQuery: (query: string) => void;
  setServingsFilter: (servings: number) => void;
  setMaxTimeFilter: (maxTime: number) => void;
  refreshRecipes: () => Promise<void>;
}

export const useRecipePresenter = (): RecipePresenterState &
  RecipePresenterActions => {
  const { recipeRepository } = useDI();

  const [state, setState] = useState<RecipePresenterState>({
    recipes: [],
    filteredRecipes: [],
    selectedRecipe: null,
    loading: false,
    error: null,
    searchQuery: '',
    servingsFilter: 1,
    maxTimeFilter: 180, // 3時間
    showDialog: false,
  });

  // レシピ一覧取得
  const fetchRecipes = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const recipes = await recipeRepository.findAll();
      setState(prev => ({
        ...prev,
        recipes,
        filteredRecipes: recipes,
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
  }, [recipeRepository]);

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

  // 検索クエリ設定
  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  // 人数フィルター設定
  const setServingsFilter = useCallback((servings: number) => {
    setState(prev => ({ ...prev, servingsFilter: servings }));
  }, []);

  // 最大時間フィルター設定
  const setMaxTimeFilter = useCallback((maxTime: number) => {
    setState(prev => ({ ...prev, maxTimeFilter: maxTime }));
  }, []);

  // リフレッシュ
  const refreshRecipes = useCallback(async () => {
    await fetchRecipes();
  }, [fetchRecipes]);

  // フィルタリング処理
  useEffect(() => {
    let filtered = state.recipes;

    // 検索フィルター
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.title?.toLowerCase().includes(query) ||
        recipe.description?.toLowerCase().includes(query) ||
        recipe.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // 人数フィルター
    if (state.servingsFilter > 1) {
      filtered = filtered.filter(recipe => 
        recipe.servings && recipe.servings >= state.servingsFilter
      );
    }

    // 時間フィルター
    if (state.maxTimeFilter < 180) {
      filtered = filtered.filter(recipe => {
        const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
        return totalTime <= state.maxTimeFilter;
      });
    }

    setState(prev => ({ ...prev, filteredRecipes: filtered }));
  }, [
    state.recipes,
    state.searchQuery,
    state.servingsFilter,
    state.maxTimeFilter,
  ]);

  // 初回データ取得
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return {
    ...state,
    fetchRecipes,
    selectRecipe,
    closeDialog,
    setSearchQuery,
    setServingsFilter,
    setMaxTimeFilter,
    refreshRecipes,
  };
};
