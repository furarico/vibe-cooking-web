'use client';

import { useRecipeDetailPresenter } from '@/client/presenters/hooks/use-recipe-detail-presenter';
import { Ingredients } from '@/components/ui/ingredients';
import { Instructions } from '@/components/ui/instructions';
import { RecipeDetailHeader } from '@/components/ui/recipe-detail-header';
import { TimeCard } from '@/components/ui/time-card';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const [recipeId, setRecipeId] = useState<string>('');
  const { recipe, loading, error, fetchRecipe } = useRecipeDetailPresenter();

  useEffect(() => {
    const fetchRecipeId = async () => {
      const resolvedParams = await params;
      setRecipeId(resolvedParams.id);
    };
    fetchRecipeId();
  }, [params]);

  useEffect(() => {
    if (!recipeId) return;
    fetchRecipe(recipeId);
  }, [recipeId, fetchRecipe]);

  if (loading) {
    return (
      <div className="w-full max-w-[600px] mx-auto min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[600px] mx-auto min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="w-full max-w-[600px] mx-auto min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">レシピが見つかりません</p>
      </div>
    );
  }

  // APIから取得したデータを材料コンポーネント用に変換
  const ingredientsData =
    recipe.ingredients?.map((ingredient, index) => ({
      name: ingredient.name || '',
      amount: ingredient.amount || '',
      unit: ingredient.unit || '',
      note: ingredient.notes || '',
    })) || [];

  // APIから取得したデータを手順コンポーネント用に変換
  const instructionsData =
    recipe.instructions?.map(instruction => ({
      step: instruction.step || 0,
      description: instruction.description || '',
    })) || [];

  // 画像URLの処理（デフォルト画像を設定）
  const imageUrl =
    recipe.imageUrl && recipe.imageUrl.length > 0
      ? recipe.imageUrl
      : 'https://r2.vibe-cooking.furari.co/images/recipe-thumbnails/default.png';

  return (
    <div className="w-full max-w-[600px] mx-auto min-h-screen mb-20">
      <div className="flex flex-col gap-8">
        {/* レシピ画像 */}
        <div className="w-full">
          <Image
            src={imageUrl}
            alt={recipe.title || 'レシピ画像'}
            width={600}
            height={300}
            className="w-full h-[300px] object-cover rounded-lg"
            priority
          />
        </div>

        <div className="items-center justify-center">
          <RecipeDetailHeader
            title={recipe.title || ''}
            description={recipe.description || ''}
            tags={recipe.tags || []}
          />
        </div>
        {/* 調理時間カード */}
        <div className="flex flex-row items-center justify-center gap-2">
          <TimeCard title="準備時間" label={`${recipe.prepTime || 0}分`} />
          <TimeCard title="調理時間" label={`${recipe.cookTime || 0}分`} />
          <TimeCard title="人前" label={`${recipe.servings || 0}人前`} />
        </div>

        {/* 材料リスト */}
        <Ingredients ingredients={ingredientsData} />

        {/* 作成手順 */}
        <Instructions steps={instructionsData} />
      </div>
    </div>
  );
}
