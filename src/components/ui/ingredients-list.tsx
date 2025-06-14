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
      className={`w-full max-w-[600px] flex flex-col gap-4 p-4 bg-white rounded-md border border-slate-200${className}`}
    >
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
