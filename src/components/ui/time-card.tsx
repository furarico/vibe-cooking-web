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
        className={cn("'w-full items-stretch flex gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-md transition-all hover:shadow-lg cursor-pointer max-w-[240px] flex-col'")}
        ref={ref}
        {...props}
      >
      </Card>
    );
  }
);

export type { TimeCardProps };
TimeCard.displayName = 'TimeCard';

export { TimeCard };
