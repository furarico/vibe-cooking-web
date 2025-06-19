import * as React from 'react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ClockIcon, UsersIcon } from 'lucide-react';

interface TimeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: 'prep' | 'cook' | 'servings';
  number: number;
}

const TimeCard = React.forwardRef<HTMLDivElement, TimeCardProps>(
  ({ className, variant, number, ...props }, ref) => {
    return (
      <Card
        className={cn(
          'w-full items-center flex gap-0 rounded-md border border-slate-200 bg-white px-4 py-2 flex-col',
          className
        )}
        ref={ref}
        {...props}
      >
        {/* タイトルを表示 */}
        <div className="flex flex-row items-center gap-2">
          {variant === 'prep' && (
            <>
              <ClockIcon className="w-4 h-4 text-slate-500" />
              <div className="text-sm font-medium text-slate-500">準備時間</div>
            </>
          )}
          {variant === 'cook' && (
            <>
              <ClockIcon className="w-4 h-4 text-slate-500" />
              <div className="text-sm font-medium text-slate-500">調理時間</div>
            </>
          )}
          {variant === 'servings' && (
            <>
              <UsersIcon className="w-4 h-4 text-slate-500" />
              <div className="text-sm font-medium text-slate-500">分量</div>
            </>
          )}
        </div>
        {/* 時間や人前を表示 */}
        <p className="text-lg font-semibold text-slate-900">
          {number} {variant === 'servings' && '人前'}{' '}
          {variant === 'prep' && '分'} {variant === 'cook' && '分'}
        </p>
      </Card>
    );
  }
);

export type { TimeCardProps };
TimeCard.displayName = 'TimeCard';

export { TimeCard };
