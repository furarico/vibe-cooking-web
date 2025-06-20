'use client';

import { useDI } from '@/client/di/providers';
import { VibeRecipe } from '@/lib/api-client';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export interface VibeRecipePresenterState {
  vibeRecipe: VibeRecipe | null;
  loading: boolean;
  error: string | null;
}

export interface VibeRecipePresenterActions {
  createVibeRecipe: (recipeIds: string[]) => Promise<void>;
  reset: () => void;
}

export const useVibeRecipePresenter = (): VibeRecipePresenterState &
  VibeRecipePresenterActions => {
  const { vibeRecipeService } = useDI();

  const [state, setState] = useState<VibeRecipePresenterState>({
    vibeRecipe: null,
    loading: false,
    error: null,
  });

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
      vibeRecipe: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    createVibeRecipe,
    reset,
  };
};
