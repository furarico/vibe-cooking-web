import * as React from 'react';
import { IngredientItem } from './ingredient-item';

interface IngredientsList {
  name: string;
  amount: number | string;
  unit: string;
  note?: string;
}
interface IngredientsListProps {
  ingredients: IngredientsList[];
  className?: string;
}

const IngredientsList: React.FC<IngredientsListProps> = ({
  ingredients,
  className,
}) => {
  return (
    <div
      className={`w-full max-w-[600px] flex items-center flex-col gap-4  p-4 bg-white rounded-md border border-slate-200 text-center${className}`}
    >
      <h2 className="text-xl font-bold text-slate-600">材料</h2>
      {ingredients.map((ingredient, index) => (
        <IngredientItem
          key={index}
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
