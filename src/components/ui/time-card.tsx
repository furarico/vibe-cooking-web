import { Timer } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { Card } from './card';

interface TimeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  label?: string;
}

const TimeCard = React.forwardRef<HTMLDivElement, TimeCardProps>(
  (
    {
      className,
      title,
      label,
      ...props
    },
    ref
  ) => {
    return (
      <Card
        className={cn("w-full items-center flex gap-0 rounded-md border border-slate-200 bg-white px-4 py-2 shadow-md transition-all hover:shadow-lg cursor-pointer flex-col")}
        ref={ref}
        {...props}
      >
         {/* タイトルを表示 */}
        {title && <p className="text-m font-Medium text-slate-500">{title}</p>}
        {/* タイトルを表示 */}
        {label && <p className="text-lg font-semibold text-slate-900">{label}</p>}

      </Card>
    );
  }
);

export type { TimeCardProps };
TimeCard.displayName = 'TimeCard';

export { TimeCard };
