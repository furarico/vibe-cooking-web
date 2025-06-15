'use client';

import { RecipeCard } from '@/components/ui/recipe-card';
import { DefaultApi, Recipe } from '@/lib/api-client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const api = new DefaultApi();

export default function Page() {
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          q: searchParams.get('q') || undefined,
          tag: searchParams.get('tag') || undefined,
          category: searchParams.get('category') || undefined,
          categoryId: searchParams.get('categoryId') || undefined,
        };

        const response = await api.recipesGet(params);
        setRecipes(response.recipes || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'レシピの取得に失敗しました'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">レシピ一覧</h1>

      {recipes.length === 0 ? (
        <div className="text-center text-gray-600">
          レシピが見つかりませんでした
        </div>
      ) : (
        <div className="space-y-4">
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              variant="row"
              title={recipe.title || ''}
              description={recipe.description || ''}
              tags={recipe.tags || []}
              cookingTime={(recipe.cookTime || 0) + (recipe.prepTime || 0)}
              imageUrl={recipe.imageUrl || '/placeholder-recipe.jpg'}
              imageAlt={recipe.title || 'レシピ画像'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
