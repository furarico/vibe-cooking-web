'use client';
import { useDI } from '@/client/di/providers';
import { FixedBottomButton } from '@/components/ui/fixed-bottom-button';
import Loading from '@/components/ui/loading';
import { RecipeCard } from '@/components/ui/recipe-card';
import { Recipe } from '@/lib/api-client';
import {
  getMaxSavedRecipes,
  getSavedRecipes,
  removeRecipe,
} from '@/lib/local-storage';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Page() {
  const { recipeService } = useDI();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSavedRecipes = async () => {
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
  };

  useEffect(() => {
    loadSavedRecipes();
  }, [recipeService]);

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
    <div className="w-full max-w-[600px] mx-auto min-h-screen p-4">
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          保存されたレシピ
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {savedRecipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <p className="text-lg text-gray-600 mb-2">
              保存されたレシピがありません
            </p>
            <p className="text-sm text-gray-500">
              レシピ詳細ページで「お気に入りに追加」を押すと、ここに表示されます
            </p>
          </div>
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

        {savedRecipes.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            {savedRecipes.length}/{getMaxSavedRecipes()}
            件のレシピが保存されています
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
    </div>
  );
}
