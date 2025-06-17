'use client';

import { useRecipeDetailPresenter } from '@/client/presenters/use-recipe-detail-presenter';
import { useSavedRecipePresenter } from '@/client/presenters/use-saved-recipe-presenter';
import { FixedBottomButton } from '@/components/ui/fixed-bottom-button';
import { Ingredients } from '@/components/ui/ingredients';
import { Instructions } from '@/components/ui/instructions';
import { Loading } from '@/components/ui/loading';
import { NoContent } from '@/components/ui/no-content';
import { RecipeDetailHeader } from '@/components/ui/recipe-detail-header';
import { SelectCount } from '@/components/ui/select-count';
import { TimeCard } from '@/components/ui/time-card';
import { getSavedRecipesCount } from '@/lib/local-storage';
import Image from 'next/image';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const [recipeId, setRecipeId] = useState<string>('');
  const [savedCount, setSavedCount] = useState(0);
  const { recipe, loading, fetchRecipe } = useRecipeDetailPresenter();
  const { isSaved, canSave, saveRecipe, removeRecipe } =
    useSavedRecipePresenter(recipeId);

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

  useEffect(() => {
    const updateSavedCount = () => {
      setSavedCount(getSavedRecipesCount());
    };

    updateSavedCount();

    const handleFocus = () => {
      updateSavedCount();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // 追加ボタンクリック時の処理
  const handleOperateListButtonTapped = () => {
    if (!canSave) {
      toast.error('Vibe Cooking リストの上限に達しています');
      return;
    }

    const result = isSaved ? removeRecipe() : saveRecipe();
    if (result) {
      setSavedCount(getSavedRecipesCount());

      if (isSaved) {
        toast.success('Vibe Cooking リストから削除しました');
      } else {
        toast.success('Vibe Cooking リストに追加しました');
      }
    } else {
      toast.error('Vibe Cooking リストの追加に失敗しました');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!recipe) {
    return <NoContent text="レシピが見つかりません" />;
  }

  // APIから取得したデータを材料コンポーネント用に変換
  const ingredientsData =
    recipe.ingredients?.map(ingredient => ({
      name: ingredient.name || '',
      amount: ingredient.amount || '',
      unit: ingredient.unit || '',
      note: ingredient.notes || '',
    })) || [];

  // APIから取得したデータを手順コンポーネント用に変換
  const instructionsData =
    recipe.instructions?.map(instruction => ({
      step: instruction.step || 0,
      title: instruction.title || '',
      description: instruction.description || '',
      imageUrl: instruction.imageUrl || '',
      audioUrl: instruction.audioUrl || '',
    })) || [];

  // 画像URLの処理（デフォルト画像を設定）
  const imageUrl =
    recipe.imageUrl && recipe.imageUrl.length > 0
      ? recipe.imageUrl
      : 'https://r2.vibe-cooking.furari.co/images/recipe-thumbnails/default.png';

  return (
    <Suspense fallback={<Loading />}>
      <div className="mb-40 flex flex-col gap-8">
        {/* レシピ画像 */}
        <Image
          src={imageUrl}
          alt={recipe.title || 'レシピ画像'}
          width={600}
          height={300}
          className="w-full h-[300px] object-cover rounded-lg border-2 border-slate-200"
          priority
        />

        <RecipeDetailHeader
          title={recipe.title || ''}
          description={recipe.description || ''}
          tags={recipe.tags || []}
        />

        {/* 調理時間カード */}
        <div className="flex flex-row items-center justify-center gap-2">
          <TimeCard variant="prep" number={recipe.prepTime || 0} />
          <TimeCard variant="cook" number={recipe.cookTime || 0} />
          <TimeCard variant="servings" number={recipe.servings || 0} />
        </div>

        {/* 材料リスト */}
        <Ingredients ingredients={ingredientsData} />

        {/* 作成手順 */}
        <Instructions steps={instructionsData} />
      </div>

      <FixedBottomButton
        buttons={[
          {
            href: `/cooking/${recipeId}`,
            children: 'このレシピのみで Vibe Cooking をはじめる',
          },
          {
            onClick: handleOperateListButtonTapped,
            href: '#',
            children: isSaved
              ? 'Vibe Cooking リストから削除'
              : !canSave
                ? 'Vibe Cooking リストの上限に達しています'
                : 'Vibe Cooking リストに追加',
            variant: isSaved ? 'outline' : 'default',
            disabled: !canSave,
            className: isSaved
              ? 'text-red-500 border-red-500 hover:text-red-500 hover:border-red-500'
              : '',
          },
          {
            href: '/candidates',
            children: (
              <div className="flex items-center justify-center gap-2">
                <SelectCount count={savedCount} />
                <span>Vibe Cooking リスト</span>
              </div>
            ),
            variant: 'outline',
          },
        ]}
      />
    </Suspense>
  );
}
