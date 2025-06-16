'use client';

import { useRecipeDetailPresenter } from '@/client/presenters/use-recipe-detail-presenter';
import { FixedBottomButton } from '@/components/ui/fixed-bottom-button';
import { Ingredients } from '@/components/ui/ingredients';
import { Instructions } from '@/components/ui/instructions';
import Loading from '@/components/ui/loading';
import { RecipeDetailHeader } from '@/components/ui/recipe-detail-header';
import { SelectCount } from '@/components/ui/select-count';
import { TimeCard } from '@/components/ui/time-card';
import { useSavedRecipe } from '@/hooks/use-saved-recipe';
import { getSavedRecipesCount } from '@/lib/local-storage';
import Image from 'next/image';
import { Suspense, useEffect, useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const [recipeId, setRecipeId] = useState<string>('');
  const [savedCount, setSavedCount] = useState(0);
  const { recipe, loading, fetchRecipe } = useRecipeDetailPresenter();
  const { isSaved, canSave, saveRecipe } = useSavedRecipe(recipeId);

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
  const handleAddRecipe = () => {
    if (!isSaved && canSave) {
      const success = saveRecipe();
      if (success) {
        setSavedCount(getSavedRecipesCount()); // カウントを更新
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!recipe) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-lg text-gray-600">レシピが見つかりません</p>
      </div>
    );
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
          /*
          {
            href: `/recipes/${recipeId}/cooking`,
            children: 'Vibe Cooking をはじめる',
          },
        */
          {
            onClick: isSaved || !canSave ? undefined : handleAddRecipe,
            href: isSaved && !canSave ? undefined : undefined,
            children: isSaved
              ? '✓ 追加済み'
              : !canSave
                ? '保存上限に達しています（3/3）'
                : 'お気に入りに追加',
            variant: isSaved ? 'default' : 'outline',
            disabled: isSaved || !canSave,
            className: isSaved
              ? 'bg-slate-300 text-white cursor-not-allowed opacity-70 border-0'
              : !canSave
                ? 'bg-slate-300 text-slate-600 cursor-not-allowed opacity-70 border-0'
                : 'bg-black text-white hover:bg-slate-600 transition-all duration-200 font-medium border-0',
          },
          {
            href: '/recipes/add',
            children: (
              <div className="flex items-center justify-center w-full gap-2">
                <SelectCount count={savedCount} />
                <span>保存済みレシピ一覧</span>
              </div>
            ),
            variant: 'ghost',
            className:
              'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-200',
          },
        ]}
      />
    </Suspense>
  );
}
