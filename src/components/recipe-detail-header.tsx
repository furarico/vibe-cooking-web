import { cn } from '@/lib/utils';
import Link from 'next/link';
import * as React from 'react';

interface RecipeDetailHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  tags?: string[];
}

const RecipeDetailHeader = React.forwardRef<
  HTMLDivElement,
  RecipeDetailHeaderProps
>(({ className, title, description, tags, ...props }, ref) => {
  return (
    <div
      className={cn('w-full flex flex-col gap-4 items-start', className)}
      ref={ref}
      {...props}
    >
      <div className="flex flex-col gap-2">
        {/* タイトルを表示 */}
        <p className="text-xl font-semibold text-slate-900">{title ?? ''}</p>
        {/* 説明を表示 */}
        <p className="text-sm font-medium text-slate-900">
          {description ?? ''}
        </p>
      </div>
      {/* タグを表示 */}
      {tags?.length && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Link
              key={tag}
              href={`/recipes?tag=${tag}`}
              className="text-sm text-slate-600"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
});

export type { RecipeDetailHeaderProps };
RecipeDetailHeader.displayName = 'RecipeDetailHeader';

export { RecipeDetailHeader };
