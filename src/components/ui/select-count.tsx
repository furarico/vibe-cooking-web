import { cn } from '@/lib/utils';
import * as React from 'react';

interface SelectCountProps {
  count: number;
  className?: string;
}

const SelectCount = React.forwardRef<HTMLDivElement, SelectCountProps>(
  ({ count, className, ...props }, ref) => {
    // カウントが0の場合は表示しない
    if (count <= 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center w-6 h-6 bg-slate-600 text-white text-xs font-semibold rounded-full',
          className
        )}
        {...props}
      >
        {count}
      </div>
    );
  }
);

SelectCount.displayName = 'SelectCount';

export { SelectCount };
export type { SelectCountProps };
