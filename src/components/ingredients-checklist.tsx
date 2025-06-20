'use client';

import { useDI } from '@/client/di/providers';
import { Recipe } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Ingredients } from './ingredients';
import { Loading } from './tools/loading';

interface IngredientsChecklistProps {
  recipeIds: string[];
  className?: string;
}

const IngredientsChecklist: React.FC<IngredientsChecklistProps> = ({
  recipeIds,
  className,
}) => {
  const { recipeService } = useDI();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (recipeIds.length === 0) {
        setRecipes([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const recipePromises = recipeIds.map(async recipeId => {
          const recipe = await recipeService.getRecipeById(recipeId);
          return recipe;
        });

        const fetchedRecipes = await Promise.all(recipePromises);
        const validRecipes = fetchedRecipes.filter(
          (recipe): recipe is Recipe => recipe !== null
        );

        setRecipes(validRecipes);
      } catch (error) {
        console.error('レシピの取得に失敗しました:', error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [recipeIds, recipeService]);

  if (loading) {
    return <Loading />;
  }

  if (recipes.length === 0) {
    return (
      <div className={cn('w-full text-center text-gray-500', className)}>
        表示するレシピがありません
      </div>
    );
  }

  return (
    <div className={cn('w-full flex flex-col gap-10', className)}>
      {recipes.map(recipe => {
        // レシピの材料をIngredientsItemProps形式に変換
        const ingredientsProps = recipe.ingredients.map(ingredient => ({
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          note: ingredient.notes || undefined,
          className: 'text-xl',
        }));

        return (
          <Ingredients
            key={recipe.id}
            ingredients={ingredientsProps}
            title={recipe.title}
          />
        );
      })}
    </div>
  );
};

export type { IngredientsChecklistProps };
IngredientsChecklist.displayName = 'IngredientsChecklist';

export { IngredientsChecklist };
