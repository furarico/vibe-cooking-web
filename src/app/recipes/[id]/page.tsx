'use client';

import { useRecipeDetailPresenter } from '@/client/presenters/use-recipe-detail-presenter';
import { FixedBottomButton } from '@/components/ui/fixed-bottom-button';
import { Ingredients } from '@/components/ui/ingredients';
import { Instructions } from '@/components/ui/instructions';
import { Loading } from '@/components/ui/loading';
import { NoContent } from '@/components/ui/no-content';
import { RecipeDetailHeader } from '@/components/ui/recipe-detail-header';
import { SelectCount } from '@/components/ui/select-count';
import { TimeCard } from '@/components/ui/time-card';
import Image from 'next/image';
import { Suspense, useEffect } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const { state, actions } = useRecipeDetailPresenter();

  useEffect(() => {
    const fetchRecipeId = async () => {
      const resolvedParams = await params;
      actions.setRecipeId(resolvedParams.id);
    };
    fetchRecipeId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, actions.setRecipeId]);

  if (state.loading) {
    return <Loading />;
  }

  if (!state.recipe) {
    return <NoContent text="レシピが見つかりません" />;
  }

  // APIから取得したデータを材料コンポーネント用に変換
  const ingredientsData =
    state.recipe.ingredients?.map(ingredient => ({
      name: ingredient.name || '',
      amount: ingredient.amount || '',
      unit: ingredient.unit || '',
      note: ingredient.notes || '',
    })) || [];

  // APIから取得したデータを手順コンポーネント用に変換
  const instructionsData =
    state.recipe.instructions?.map(instruction => ({
      step: instruction.step || 0,
      title: instruction.title || '',
      description: instruction.description || '',
      imageUrl: instruction.imageUrl || '',
      audioUrl: instruction.audioUrl || '',
    })) || [];

  // 画像URLの処理（デフォルト画像を設定）
  const imageUrl =
    state.recipe.imageUrl && state.recipe.imageUrl.length > 0
      ? state.recipe.imageUrl
      : process.env.NEXT_PUBLIC_DEFAULT_IMAGE_URL;

  return (
    <Suspense fallback={<Loading />}>
      <div className="mb-40 flex flex-col gap-8">
        {/* レシピ画像 */}
        <Image
          src={imageUrl}
          alt={state.recipe.title || 'レシピ画像'}
          width={600}
          height={300}
          className="w-full h-[300px] object-cover rounded-lg border-2 border-slate-200"
          priority
        />

        <RecipeDetailHeader
          title={state.recipe.title || ''}
          description={state.recipe.description || ''}
          tags={state.recipe.tags || []}
        />

        {/* 調理時間カード */}
        <div className="flex flex-row items-center justify-center gap-2">
          <TimeCard variant="prep" number={state.recipe.prepTime || 0} />
          <TimeCard variant="cook" number={state.recipe.cookTime || 0} />
          <TimeCard variant="servings" number={state.recipe.servings || 0} />
        </div>

        {/* 材料リスト */}
        <Ingredients ingredients={ingredientsData} />

        {/* 作成手順 */}
        <Instructions steps={instructionsData} />
      </div>

      <FixedBottomButton
        buttons={[
          {
            href: `/cooking/${state.recipeId}`,
            children: 'このレシピのみで Vibe Cooking をはじめる',
          },
          {
            onClick: actions.onAddToVibeCookingListButtonTapped,
            href: '#',
            children: state.vibeCookingRecipeIds.includes(state.recipeId ?? '')
              ? 'Vibe Cooking リストから削除'
              : state.vibeCookingRecipeIds.length >= 3
                ? 'Vibe Cooking リストの上限に達しています'
                : 'Vibe Cooking リストに追加',
            variant: state.vibeCookingRecipeIds.includes(state.recipeId ?? '')
              ? 'outline'
              : 'default',
            disabled: state.vibeCookingRecipeIds.length >= 3 || !state.recipeId,
            className: state.vibeCookingRecipeIds.includes(state.recipeId ?? '')
              ? 'text-red-500 border-red-500 hover:text-red-500 hover:border-red-500'
              : '',
          },
          {
            href: '/candidates',
            children: (
              <div className="flex items-center justify-center gap-2">
                <SelectCount count={state.vibeCookingRecipeIds.length} />
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
