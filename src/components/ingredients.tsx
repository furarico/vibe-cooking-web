import { cn } from '@/lib/utils';
import * as React from 'react';
import { IngredientsItem, IngredientsItemProps } from './ingredients-item';
import { Card } from './ui/card';

interface IngredientsProps {
  ingredients: IngredientsItemProps[];
  title?: string;
  className?: string;
}

const Ingredients: React.FC<IngredientsProps> = ({
  ingredients,
  title = '材料',
  className,
}) => {
  // 一意のidを生成してingredientsWithIdに格納
  const ingredientsWithId = ingredients.map((item, index) => ({
    id: `${item.name}-${index}`, // nameとindexを組み合わせて一意のIDを生成
    ...item,
  }));

  return (
    <div className={cn('w-full flex flex-col gap-4', className)}>
      <h2 className="text-lg font-bold">{title}</h2>
      <Card className="p-4 flex flex-col gap-2">
        {ingredientsWithId.map(ingredient => (
          <IngredientsItem
            key={ingredient.id} // 生成したidをkeyに使う
            name={ingredient.name}
            amount={ingredient.amount}
            unit={ingredient.unit}
            note={ingredient.note}
          />
        ))}
      </Card>
    </div>
  );
};

export type { IngredientsProps };
Ingredients.displayName = 'Ingredients';

export { Ingredients };
