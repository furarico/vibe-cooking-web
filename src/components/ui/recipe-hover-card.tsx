import { Timer } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { Card } from './card';

const recipeCardVariants = cva(
  'w-full items-stretch flex gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-md transition-all hover:shadow-lg cursor-pointer',
  {
    variants: {
      variant: {
        card: 'max-w-[240px] flex-col',
        row: 'flex-row',
      },
    },
    defaultVariants: {
      variant: 'card',
    },
  }
);

interface RecipeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'card' | 'row';
  title?: string;
  description?: string;
  tags: string[];
  cookingTime: number;
  imageUrl: string;
  imageAlt?: string;
}

const RecipeCard = React.forwardRef<HTMLDivElement, RecipeCardProps>(
  (
    {
      className,
      variant,
      title,
      description,
      tags,
      cookingTime,
      imageUrl,
      imageAlt = '',
      ...props
    },
    ref
  ) => {
    return (
      <Card
        className={cn(recipeCardVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {/* Recipe Image */}
        <div className="w-full h-[100px] rounded relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="200px"
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            {/* Title */}
            <div className="text-left text-base font-bold text-slate-900 line-clamp-1">
              {title}
            </div>

            {/* Description */}
            <p className="text-left text-xs text-slate-900 line-clamp-2">
              {description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-[4px]">
            {tags.map((tag, index) => (
              <span key={index} className="text-xs text-slate-500">
                #{tag}
              </span>
            ))}
          </div>

          {/* Cooking Time */}
          <div className="flex items-center gap-1 ml-[-2px]">
            <Timer className="w-4 h-4 stroke-slate-700 stroke-2" />
            <span className="text-xs text-slate-700 mt-[1px]">
              {cookingTime}min
            </span>
          </div>
        </div>
      </Card>
    );
  }
);

export type { RecipeCardProps };
RecipeCard.displayName = 'RecipeCard';

export { RecipeCard, recipeCardVariants };
