import { Timer } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface RecipeHoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  tags: string[];
  cookingTime: number;
  imageUrl: string;
  imageAlt?: string;
}

const RecipeHoverCard = React.forwardRef<HTMLDivElement, RecipeHoverCardProps>(
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
        'flex w-fit max-w-[220px] flex-col gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-md transition-all hover:shadow-lg',
        className
      )}
      {...props}
    >
      {/* Recipe Image */}
      <div className="relative h-[98px] w-[188px] overflow-hidden rounded">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="188px"
        />
      </div>

      {/* Content */}
      <div className="flex w-[188px] flex-col gap-1">
        {/* Title */}
        <h3 className="text-left text-base font-bold leading-6 text-slate-900">
          {title}
        </h3>

        {/* Description */}
        <p className="text-left text-sm text-slate-900">{description}</p>

        {/* Tags */}
        <div className="flex items-center gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="text-xs text-slate-500">
              {tag}
            </span>
          ))}
        </div>

        {/* Cooking Time */}
        <div className="flex items-center gap-1">
          <Timer className="h-4 w-4 stroke-slate-700 stroke-2" />
          <span className="text-xs text-slate-700">{cookingTime}分</span>
        </div>
      </div>
    </div>
  )
);

RecipeHoverCard.displayName = 'RecipeHoverCard';

export { RecipeHoverCard };
export type { RecipeHoverCardProps };
