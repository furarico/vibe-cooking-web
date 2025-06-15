import { useDI } from '@/client/di/providers';
import type { Category } from '@/lib/api-client';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface CategoryPresenterState {
  categories: Category[];
  loading: boolean;
}

interface CategoryPresenterActions {
  fetchCategories: () => Promise<void>;
}

export const useCategoryPresenter = (): CategoryPresenterState &
  CategoryPresenterActions => {
  const { categoryService } = useDI();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedCategories = await categoryService.getAllCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      toast.error('カテゴリの取得に失敗しました');
      console.error('カテゴリ取得エラー:', err);
    } finally {
      setLoading(false);
    }
  }, [categoryService]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    fetchCategories,
  };
};
