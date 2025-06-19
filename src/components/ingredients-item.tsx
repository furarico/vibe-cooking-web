import * as React from 'react';

interface IngredientsItemProps {
  name: string;
  amount: number | string;
  unit: string;
  note?: string;
}

const IngredientsItem: React.FC<IngredientsItemProps> = ({
  name,
  amount,
  unit,
  note,
}) => {
  return (
    <div className="w-full flex items-center justify-between p-2 border-b border-slate-300">
      <div className="flex-1 flex items-center gap-x-2">
        <span className="font-medium">{name}</span>
        {note && <span className="text-sm text-gray-400">{note}</span>}
      </div>
      <span className="text-base">
        {amount} {unit}
      </span>
    </div>
  );
};

export type { IngredientsItemProps };
IngredientsItem.displayName = 'IngredientsItem';

export { IngredientsItem };
