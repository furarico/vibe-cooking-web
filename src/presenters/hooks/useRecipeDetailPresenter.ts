'use client';

import { useState, useCallback } from 'react';
import { useDI } from '@/di/providers';
import { Recipe } from '@/lib/api';

export interface RecipeDetailPresenterState {
  recipe: Recipe | null;
  loading: boolean;
  error: string | null;
  currentStep: number;
  isCompleted: boolean;
}

export interface RecipeDetailPresenterActions {
  fetchRecipe: (id: string) => Promise<void>;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetProgress: () => void;
  markCompleted: () => void;
}

export const useRecipeDetailPresenter = (): RecipeDetailPresenterState & RecipeDetailPresenterActions => {
  const { recipeService } = useDI();

  const [state, setState] = useState<RecipeDetailPresenterState>({
    recipe: null,
    loading: false,
    error: null,
    currentStep: 0,
    isCompleted: false
  });

  // レシピ詳細取得
  const fetchRecipe = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const recipe = await recipeService.getRecipeById(id);

      if (!recipe) {
        setState(prev => ({
          ...prev,
          error: 'レシピが見つかりませんでした',
          loading: false
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        recipe,
        loading: false,
        currentStep: 0,
        isCompleted: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '不明なエラーが発生しました',
        loading: false
      }));
    }
  }, [recipeService]);

  // 現在のステップ設定
  const setCurrentStep = useCallback((step: number) => {
    setState(prev => {
      if (!prev.recipe) return prev;

      const maxStep = (prev.recipe.instructions?.length || 1) - 1;
      const newStep = Math.max(0, Math.min(step, maxStep));

      return {
        ...prev,
        currentStep: newStep,
        isCompleted: newStep === maxStep
      };
    });
  }, []);

  // 次のステップ
  const nextStep = useCallback(() => {
    setState(prev => {
      if (!prev.recipe) return prev;

      const maxStep = (prev.recipe.instructions?.length || 1) - 1;
      const newStep = Math.min(prev.currentStep + 1, maxStep);

      return {
        ...prev,
        currentStep: newStep,
        isCompleted: newStep === maxStep
      };
    });
  }, []);

  // 前のステップ
  const prevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
      isCompleted: false
    }));
  }, []);

  // 進行状況リセット
  const resetProgress = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: 0,
      isCompleted: false
    }));
  }, []);

  // 完了マーク
  const markCompleted = useCallback(() => {
    setState(prev => ({
      ...prev,
      isCompleted: true
    }));
  }, []);

  return {
    ...state,
    fetchRecipe,
    setCurrentStep,
    nextStep,
    prevStep,
    resetProgress,
    markCompleted
  };
};