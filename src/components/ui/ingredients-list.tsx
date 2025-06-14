import { cn } from '@/lib/utils';
import * as React from 'react';
import { IngredientItem } from './ingredient-item';

interface Ingredient {
  name: string;
  amount: number | string;
  unit: string;
  note?: string;
}

interface IngredientsListProps {
  ingredients: Ingredient[];
  className?: string;
}

const IngredientsList: React.FC<IngredientsListProps> = ({
  ingredients,
  className,
}) => {
  // 一意のidを生成してingredientsWithIdに格納
  const ingredientsWithId = ingredients.map((item, index) => ({
    id: `${item.name}-${index}`, // nameとindexを組み合わせて一意のIDを生成
    ...item,
  }));

  return (
    <div
      className={cn(
        'w-full max-w-[600px] flex items-center flex-col gap-4 p-4 bg-white rounded-md border border-slate-200 text-center',
        className
      )}
    >
      <h2 className="text-xl font-bold text-slate-600">材料</h2>
      {ingredientsWithId.map(ingredient => (
        <IngredientItem
          key={ingredient.id} // 生成したidをkeyに使う
          name={ingredient.name}
          amount={ingredient.amount}
          unit={ingredient.unit}
          note={ingredient.note}
        />
      ))}
    </div>
  );
};

export type { IngredientsListProps };
IngredientsList.displayName = 'IngredientsList';

export { IngredientsList };
