'use client';
import { useDI } from '@/client/di/providers';
import { FixedBottomButton } from '@/components/ui/fixed-bottom-button';
import { Loading } from '@/components/ui/loading';
import { NoContent } from '@/components/ui/no-content';
import { RecipeCard } from '@/components/ui/recipe-card';
import { Recipe } from '@/lib/api-client';
import { getSavedRecipes, removeRecipe } from '@/lib/local-storage';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export default function Page() {
  const { recipeService } = useDI();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSavedRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ローカルストレージから保存されたレシピIDを取得
      const savedRecipeIds = getSavedRecipes();

      if (savedRecipeIds.length === 0) {
        setSavedRecipes([]);
        setLoading(false);
        return;
      }

      // 各レシピIDの詳細情報を取得
      const recipePromises = savedRecipeIds.map(async recipeId => {
        try {
          return await recipeService.getRecipeById(recipeId);
        } catch (error) {
          console.error(`レシピID ${recipeId} の取得に失敗しました:`, error);
          return null;
        }
      });

      const recipes = await Promise.all(recipePromises);
      // nullを除外してレシピのみを保持
      const validRecipes = recipes.filter(
        (recipe): recipe is Recipe => recipe !== null
      );

      setSavedRecipes(validRecipes);
    } catch (error) {
      console.error('保存されたレシピの読み込みに失敗しました:', error);
      setError('保存されたレシピの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, [recipeService]);

  useEffect(() => {
    loadSavedRecipes();
  }, [loadSavedRecipes]);

  const handleDeleteRecipe = (recipeId: string) => {
    const success = removeRecipe(recipeId);
    if (success) {
      // レシピリストを更新
      loadSavedRecipes();
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {savedRecipes.length === 0 ? (
          <NoContent text="調理するレシピがありません" />
        ) : (
          <div className="flex flex-col gap-4">
            {savedRecipes.map(recipe => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                <RecipeCard
                  variant="row"
                  title={recipe.title ?? ''}
                  description={recipe.description ?? ''}
                  tags={recipe.tags ?? []}
                  cookingTime={(recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)}
                  imageUrl={
                    recipe.imageUrl && recipe.imageUrl.length > 0
                      ? recipe.imageUrl
                      : 'https://r2.vibe-cooking.furari.co/images/recipe-thumbnails/default.png'
                  }
                  imageAlt={recipe.title ?? ''}
                  onDelete={() => recipe.id && handleDeleteRecipe(recipe.id)}
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      <FixedBottomButton
        buttons={[
          {
            href: '/recipes/cooking',
            children: 'Vibe Cookingを始める',
            variant: 'default',
          },
        ]}
      />
    </>
  );
}
