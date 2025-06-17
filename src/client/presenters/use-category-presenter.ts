import { useDI } from '@/client/di/providers';
import type { Category } from '@/lib/api-client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface CategoryPresenterState {
  categories: Category[];
  loading: boolean;
  vibeCookingRecipeIds: string[];
}

interface CategoryPresenterActions { }

interface CategoryPresenter {
  state: CategoryPresenterState;
  actions: CategoryPresenterActions;
}

export const useCategoryPresenter = (): CategoryPresenter => {
  const { categoryService, vibeCookingService } = useDI();

  const [state, setState] = useState<CategoryPresenterState>({
    categories: [],
    loading: true,
    vibeCookingRecipeIds: [],
  });

  const actions: CategoryPresenterActions = {};

  useEffect(() => {
    const fetchCategories = async () => {
      setState(prev => ({ ...prev, loading: true }));
      try {
        const fetchedCategories = await categoryService.getAllCategories();
        setState(prev => ({ ...prev, categories: fetchedCategories }));
      } catch {
        toast.error('カテゴリの取得に失敗しました');
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    const getVibeCookingRecipeIds = () => {
      const vibeCookingRecipeIds = vibeCookingService.getVibeCookingRecipeIds();
      setState(prev => ({ ...prev, vibeCookingRecipeIds }));
    };

    fetchCategories();
    getVibeCookingRecipeIds();

    window.addEventListener('focus', getVibeCookingRecipeIds);
    return () => {
      window.removeEventListener('focus', getVibeCookingRecipeIds);
    };
  }, []);

  return {
    state,
    actions,
  };
};
