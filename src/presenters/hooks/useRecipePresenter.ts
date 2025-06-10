'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDI } from '@/di/providers';
import { EnrichedRecipe } from '@/services/recipe/RecipeService';

export interface RecipePresenterState {
  recipes: EnrichedRecipe[];
  filteredRecipes: EnrichedRecipe[];
  selectedRecipe: EnrichedRecipe | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  difficultyFilter: 'all' | 'easy' | 'medium' | 'hard';
  showDialog: boolean;
}

export interface RecipePresenterActions {
  fetchRecipes: () => Promise<void>;
  selectRecipe: (recipe: EnrichedRecipe) => void;
  closeDialog: () => void;
  setSearchQuery: (query: string) => void;
  setDifficultyFilter: (filter: 'all' | 'easy' | 'medium' | 'hard') => void;
  refreshRecipes: () => Promise<void>;
}

export const useRecipePresenter = (): RecipePresenterState & RecipePresenterActions => {
  const { recipeService } = useDI();

  const [state, setState] = useState<RecipePresenterState>({
    recipes: [],
    filteredRecipes: [],
    selectedRecipe: null,
    loading: false,
    error: null,
    searchQuery: '',
    difficultyFilter: 'all',
    showDialog: false
  });

  // レシピ一覧取得
  const fetchRecipes = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const recipes = await recipeService.getAllRecipes();
      setState(prev => ({
        ...prev,
        recipes,
        filteredRecipes: recipes,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '不明なエラーが発生しました',
        loading: false
      }));
    }
  }, [recipeService]);

  // レシピ選択
  const selectRecipe = useCallback((recipe: EnrichedRecipe) => {
    setState(prev => ({
      ...prev,
      selectedRecipe: recipe,
      showDialog: true
    }));
  }, []);

  // ダイアログを閉じる
  const closeDialog = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedRecipe: null,
      showDialog: false
    }));
  }, []);

  // 検索クエリ設定
  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  // 難易度フィルター設定
  const setDifficultyFilter = useCallback((filter: 'all' | 'easy' | 'medium' | 'hard') => {
    setState(prev => ({ ...prev, difficultyFilter: filter }));
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
      filtered = recipeService.searchRecipes(filtered, state.searchQuery);
    }

    // 難易度フィルター
    if (state.difficultyFilter !== 'all') {
      filtered = recipeService.filterByDifficulty(filtered, state.difficultyFilter);
    }

    setState(prev => ({ ...prev, filteredRecipes: filtered }));
  }, [state.recipes, state.searchQuery, state.difficultyFilter, recipeService]);

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
    setDifficultyFilter,
    refreshRecipes
  };
};