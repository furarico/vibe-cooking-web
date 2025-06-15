import * as React from 'react';

interface IngredientsProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  amount?: string;
  unit?: string;
  note?: string;
}

const IngredientsListCard = React.forwardRef<HTMLDivElement, IngredientsProps>(
  ({ className, name, amount, unit, note, ...props }, ref) => {
    return (
      <div
        className={`w-full w-max-[400px] flex justify-between items-center rounded-md border border-slate-200 bg-white p-4 shadow-md transition-all ${className}`}
        ref={ref}
        {...props}
      >
        <div className="flex items-center gap-8">
          <p className="text-base font-medium text-slate-900">{name ?? ''}</p>
          {note && <p className="text-xs text-slate-600">{note}</p>}
        </div>
        <p className="text-base font-medium text-slate-900">
          {amount ?? ''} {unit ?? ''}
        </p>
      </div>
    );
  }
);

export type { IngredientsProps };
IngredientsListCard.displayName = 'IngredientsListCard';

export { IngredientsListCard };
