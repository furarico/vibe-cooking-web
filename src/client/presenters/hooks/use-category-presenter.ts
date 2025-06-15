import { useDI } from '@/client/di/providers';
import type { Category } from '@/lib/api-client';
import { useCallback, useEffect, useState } from 'react';

interface CategoryPresenterState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

interface CategoryPresenterActions {
  fetchCategories: () => Promise<void>;
}

export const useCategoryPresenter = (): CategoryPresenterState &
  CategoryPresenterActions => {
  const { categoryService } = useDI();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedCategories = await categoryService.getAllCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'カテゴリの取得に失敗しました'
      );
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
    error,
    fetchCategories,
  };
};
