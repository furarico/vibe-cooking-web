'use client';

import { useDI } from '@/client/di/providers';
import { Recipe } from '@/lib/api-client';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export interface CookingPresenterState {
  recipe: Recipe | null;
  loading: boolean;
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
}

export interface CookingPresenterActions {
  fetchRecipe: (id: string) => Promise<void>;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetProgress: () => void;
  markCompleted: () => void;
}

export const useCookingPresenter = (): CookingPresenterState &
  CookingPresenterActions => {
  const { recipeService } = useDI();

  const [state, setState] = useState<CookingPresenterState>({
    recipe: null,
    loading: false,
    currentStep: 0,
    totalSteps: 0,
    isCompleted: false,
  });

  // レシピ詳細取得
  const fetchRecipe = useCallback(
    async (id: string) => {
      setState(prev => ({ ...prev, loading: true }));

      try {
        const recipe = await recipeService.getRecipeById(id);

        if (!recipe) {
          setState(prev => ({ ...prev, loading: false }));
          toast.error('レシピが見つかりませんでした');
          return;
        }

        const totalSteps = recipe.instructions?.length || 0;

        setState(prev => ({
          ...prev,
          recipe,
          loading: false,
          currentStep: 0,
          totalSteps,
          isCompleted: false,
        }));
      } catch {
        setState(prev => ({ ...prev, loading: false }));
        toast.error('レシピの取得に失敗しました');
      }
    },
    [recipeService]
  );

  // 現在のステップ設定
  const setCurrentStep = useCallback((step: number) => {
    setState(prev => {
      if (!prev.recipe) return prev;

      const maxStep = prev.totalSteps - 1;
      const newStep = Math.max(0, Math.min(step, maxStep));

      return {
        ...prev,
        currentStep: newStep,
        isCompleted: newStep === maxStep,
      };
    });
  }, []);

  // 次のステップ
  const nextStep = useCallback(() => {
    setState(prev => {
      if (!prev.recipe) return prev;

      const maxStep = prev.totalSteps - 1;
      const newStep = Math.min(prev.currentStep + 1, maxStep);

      return {
        ...prev,
        currentStep: newStep,
        isCompleted: newStep === maxStep,
      };
    });
  }, []);

  // 前のステップ
  const prevStep = useCallback(() => {
    setState(prev => {
      if (!prev.recipe) return prev;

      return {
        ...prev,
        currentStep: Math.max(prev.currentStep - 1, 0),
        isCompleted: false,
      };
    });
  }, []);

  // 進行状況リセット
  const resetProgress = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: 0,
      isCompleted: false,
    }));
  }, []);

  // 完了マーク
  const markCompleted = useCallback(() => {
    setState(prev => ({
      ...prev,
      isCompleted: true,
    }));
  }, []);

  return {
    ...state,
    fetchRecipe,
    setCurrentStep,
    nextStep,
    prevStep,
    resetProgress,
    markCompleted,
  };
};
