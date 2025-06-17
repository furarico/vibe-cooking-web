import { useDI } from '@/client/di/providers';
import type { Category } from '@/lib/api-client';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface CategoryPresenterState {
  categories: Category[];
  loading: boolean;
  vibeCookingRecipeIds: string[];
}

interface CategoryPresenterActions {
  fetchCategories: () => Promise<void>;
}

interface CategoryPresenter {
  state: CategoryPresenterState;
  actions: CategoryPresenterActions;
}

export const useCategoryPresenter = (): CategoryPresenter => {
  const { categoryService, savedRecipeService } = useDI();

  const [state, setState] = useState<CategoryPresenterState>({
    categories: [],
    loading: true,
    vibeCookingRecipeIds: [],
  });

  const fetchCategories = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const fetchedCategories = await categoryService.getAllCategories();
      setState(prev => ({ ...prev, categories: fetchedCategories }));
    } catch {
      toast.error('カテゴリの取得に失敗しました');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [categoryService]);

  const actions: CategoryPresenterActions = {
    fetchCategories,
  };

  useEffect(() => {
    const getVibeCookingRecipeIds = () => {
      const vibeCookingRecipeIds = savedRecipeService.getSavedRecipeIds();
      setState(prev => ({ ...prev, vibeCookingRecipeIds }));
    };

    fetchCategories();
    getVibeCookingRecipeIds();

    window.addEventListener('focus', getVibeCookingRecipeIds);
    return () => {
      window.removeEventListener('focus', getVibeCookingRecipeIds);
    };
  }, [fetchCategories, savedRecipeService]);

  return {
    state,
    actions,
  };
};
