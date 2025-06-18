import { useDI } from '@/client/di/providers';
import type { Recipe } from '@/lib/api-client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface CandidatesPresenterState {
  loading: boolean;
  vibeCookingRecipeIds: string[];
  recipes: Recipe[];
}

interface CandidatesPresenterActions {
  onDeleteRecipe: (recipeId: string) => void;
}

interface CandidatesPresenter {
  state: CandidatesPresenterState;
  actions: CandidatesPresenterActions;
}

export const useCandidatesPresenter = (): CandidatesPresenter => {
  const { recipeService, vibeCookingService } = useDI();

  const [state, setState] = useState<CandidatesPresenterState>({
    loading: true,
    vibeCookingRecipeIds: [],
    recipes: [],
  });

  const actions: CandidatesPresenterActions = {
    onDeleteRecipe: (recipeId: string) => {
      try {
        vibeCookingService.removeVibeCookingRecipeId(recipeId);
        setState(prev => ({
          ...prev,
          recipes: prev.recipes.filter(recipe => recipe.id !== recipeId),
        }));
      } catch {
        toast.error('レシピの削除に失敗しました');
      }
    },
  };

  useEffect(() => {
    const getVibeCookingRecipeIds = () => {
      const vibeCookingRecipeIds = vibeCookingService.getVibeCookingRecipeIds();
      setState(prev => ({
        ...prev,
        vibeCookingRecipeIds: vibeCookingRecipeIds,
      }));
    };

    getVibeCookingRecipeIds();

    window.addEventListener('focus', getVibeCookingRecipeIds);
    return () => {
      window.removeEventListener('focus', getVibeCookingRecipeIds);
    };
  }, [vibeCookingService]);

  useEffect(() => {
    const fetchRecipes = async () => {
      setState(prev => ({ ...prev, loading: true }));
      try {
        const recipes = await Promise.all(
          state.vibeCookingRecipeIds.map(async recipeId => {
            return await recipeService.getRecipeById(recipeId);
          })
        );
        setState(prev => ({
          ...prev,
          recipes: recipes.filter(recipe => recipe !== null),
        }));
      } catch {
        toast.error('レシピの取得に失敗しました');
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    };
    fetchRecipes();
  }, [state.vibeCookingRecipeIds, recipeService]);

  return {
    state,
    actions,
  };
};
