'use client';

import { useRecipeDetailPresenter } from '@/client/presenters/use-recipe-detail-presenter';
import { Ingredients } from '@/components/ingredients';
import { Instructions } from '@/components/instructions';
import { RecipeDetailHeader } from '@/components/recipe-detail-header';
import { TimeCard } from '@/components/time-card';
import { Loading } from '@/components/tools/loading';
import { usePageButtons } from '@/hooks/use-buttom-buttons';
import { Recipe } from '@/lib/api-client';
import Image from 'next/image';
import { Suspense } from 'react';

export default function Client({ recipe }: { recipe: Recipe }) {
  const { state, actions } = useRecipeDetailPresenter(recipe);

  // ボタンの設定
  usePageButtons(
    [
      {
        id: 'start-cooking',
        href: `/cooking/${recipe.id}`,
        children: 'このレシピのみで Vibe Cooking をはじめる',
      },
      {
        id: 'toggle-vibe-list',
        onClick: actions.onAddToVibeCookingListButtonTapped,
        href: '#',
        children: state.vibeCookingRecipeIds.includes(recipe.id ?? '')
          ? 'Vibe Cooking リストから削除'
          : state.vibeCookingRecipeIds.length >= 3
            ? 'Vibe Cooking リストの上限に達しています'
            : 'Vibe Cooking リストに追加',
        variant: state.vibeCookingRecipeIds.includes(recipe.id ?? '')
          ? 'outline'
          : 'default',
        disabled:
          (!state.vibeCookingRecipeIds.includes(recipe.id ?? '') &&
            state.vibeCookingRecipeIds.length >= 3) ||
          !recipe.id,
        className: state.vibeCookingRecipeIds.includes(recipe.id ?? '')
          ? 'text-red-500 border-red-500 hover:text-red-500 hover:border-red-500'
          : '',
      },
    ],
    [
      recipe.id,
      state.vibeCookingRecipeIds,
      actions.onAddToVibeCookingListButtonTapped,
    ]
  );

  if (state.loading) {
    return <Loading />;
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

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="lg:w-[50%] flex flex-col gap-8">
          {/* レシピ画像 */}
          <Image
            src={
              recipe.imageUrl && recipe.imageUrl.length > 0
                ? recipe.imageUrl
                : (process.env.NEXT_PUBLIC_DEFAULT_IMAGE_URL ?? '')
            }
            alt={recipe.title || 'レシピ画像'}
            width={800}
            height={450}
            className="w-full object-cover rounded-lg border-2 border-slate-200"
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
        </div>

        <div className="lg:w-[50%] flex flex-col gap-8 lg:py-4">
          {/* 材料リスト */}
          <Ingredients ingredients={ingredientsData} title="材料" />

          {/* 作成手順 */}
          <Instructions steps={instructionsData} />
        </div>
      </div>
    </Suspense>
  );
}
