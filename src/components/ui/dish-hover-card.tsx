import { Timer } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface DishHoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  tags: string[];
  cookingTime: string;
  imageUrl: string;
  imageAlt?: string;
}

const DishHoverCard = React.forwardRef<HTMLDivElement, DishHoverCardProps>(
  (
    {
      className,
      title,
      description,
      tags,
      cookingTime,
      imageUrl,
      imageAlt = '',
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        'flex w-full flex-row items-stretch gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-md transition-all hover:shadow-lg',
        className
      )}
      {...props}
    >
      {/* Dish Image */}
      <div className="relative h-[90px] w-[90px] flex-shrink-0 overflow-hidden rounded">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="90px"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1">
        {/* Title */}
        <h3 className="text-left text-base font-bold leading-6 text-slate-900">
          {title}
        </h3>

        {/* Description */}
        <p className="text-left text-sm leading-[1.43] text-slate-900">
          {description}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="text-xs leading-[1.33] text-slate-500">
              #{tag}
            </span>
          ))}
        </div>

        {/* Cooking Time */}
        <div className="flex items-center gap-1">
          <Timer className="h-4 w-4 stroke-slate-700 stroke-2" />
          <span className="text-xs leading-[1.33] text-slate-700">
            {cookingTime}
          </span>
        </div>
      </div>
    </div>
  )
);

DishHoverCard.displayName = 'DishHoverCard';

export { DishHoverCard };
export type { DishHoverCardProps };
