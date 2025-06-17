import { useDI } from '@/client/di/providers';
import type { Recipe } from '@/lib/api-client';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface RecipesByCategoryPresenterState {
  recipes: Recipe[];
  loading: boolean;
}

interface RecipesByCategoryPresenterActions {
  fetchRecipesByCategory: (categoryId: string) => Promise<void>;
}

export const useRecipesByCategoryPresenter = (
  categoryId: string
): RecipesByCategoryPresenterState & RecipesByCategoryPresenterActions => {
  const { recipeService } = useDI();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipesByCategory = useCallback(
    async (categoryId: string) => {
      setLoading(true);
      setRecipes([]);

      try {
        const recipes = await recipeService.getRecipesByCategoryId(categoryId);
        setRecipes(recipes);
      } catch {
        toast.error('レシピの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    },
    [recipeService]
  );

  useEffect(() => {
    fetchRecipesByCategory(categoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]); // fetchRecipesByCategoryは依存から除く

  return {
    recipes,
    loading,
    fetchRecipesByCategory,
  };
};
