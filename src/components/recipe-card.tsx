import { Timer, Trash2 } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { Button } from './ui/button';

const recipeCardVariants = cva(
  'w-full items-stretch flex gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-md transition-all hover:shadow-lg cursor-pointer',
  {
    variants: {
      variant: {
        card: 'max-w-[220px] flex-col',
        row: 'flex-row items-center',
      },
    },
    defaultVariants: {
      variant: 'card',
    },
  }
);

interface RecipeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'card' | 'row';
  title: string;
  description: string;
  tags: string[];
  cookingTime: number;
  imageUrl: string;
  imageAlt: string;
  onDelete?: () => void;
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
      imageAlt,
      onDelete,
      ...props
    },
    ref
  ) => {
    return (
      <Card
        className={cn(recipeCardVariants({ variant, className }), 'relative')}
        ref={ref}
        {...props}
      >
        {/* Recipe Image */}
        <div
          className={cn(
            'relative overflow-hidden',
            variant === 'row'
              ? 'w-[100px] h-[100px] flex-shrink-0'
              : 'w-full h-[100px]'
          )}
        >
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="200px"
            className="object-cover rounded border-1 border-slate-200"
          />
        </div>

        {/* Content */}
        <div
          className={cn(
            'flex flex-col gap-2',
            variant === 'row' ? 'flex-1' : 'w-full'
          )}
        >
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

        {/* Delete Button */}
        {onDelete && (
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-red-600 items-center" />
          </Button>
        )}
      </Card>
    );
  }
);

export type { RecipeCardProps };
RecipeCard.displayName = 'RecipeCard';

export { RecipeCard, recipeCardVariants };
