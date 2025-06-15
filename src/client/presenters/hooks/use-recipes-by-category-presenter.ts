import { useDI } from '@/client/di/providers';
import type { Recipe } from '@/lib/api-client';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface RecipesByCategoryPresenterState {
  recipesByCategory: Record<string, Recipe[]>;
  loading: boolean;
}

interface RecipesByCategoryPresenterActions {
  fetchRecipesByCategory: (
    categoryId: string,
    categoryName: string
  ) => Promise<void>;
  fetchRecipesForAllCategories: (
    categoryIds: { id: string; name: string }[]
  ) => Promise<void>;
}

export const useRecipesByCategoryPresenter =
  (): RecipesByCategoryPresenterState & RecipesByCategoryPresenterActions => {
    const { recipeService } = useDI();
    const [recipesByCategory, setRecipesByCategory] = useState<
      Record<string, Recipe[]>
    >({});
    const [loading, setLoading] = useState(false);

    const fetchRecipesByCategory = useCallback(
      async (categoryId: string, categoryName: string) => {
        try {
          const recipes =
            await recipeService.getRecipesByCategoryId(categoryId);
          setRecipesByCategory(prev => ({
            ...prev,
            [categoryName]: recipes,
          }));
        } catch (err) {
          toast.error('レシピの取得に失敗しました');
          console.error(`カテゴリ ${categoryName} のレシピ取得エラー:`, err);
        }
      },
      [recipeService]
    );

    const fetchRecipesForAllCategories = useCallback(
      async (categoryIds: { id: string; name: string }[]) => {
        setLoading(true);
        setRecipesByCategory({});

        try {
          const promises = categoryIds.map(category =>
            fetchRecipesByCategory(category.id, category.name)
          );
          await Promise.all(promises);
        } catch (err) {
          toast.error('レシピの一括取得に失敗しました');
          console.error('全カテゴリのレシピ取得エラー:', err);
        } finally {
          setLoading(false);
        }
      },
      [fetchRecipesByCategory]
    );

    return {
      recipesByCategory,
      loading,
      fetchRecipesByCategory,
      fetchRecipesForAllCategories,
    };
  };
