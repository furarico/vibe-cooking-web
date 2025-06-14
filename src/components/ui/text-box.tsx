import { cn } from '@/lib/utils';
import * as React from 'react';

interface TextBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  tags?: string[];
}

const TextBox = React.forwardRef<HTMLDivElement, TextBoxProps>(
  ({ className, title, description, tags, ...props }, ref) => {
    return (
      <div
        className={cn('w-full items-start flex px-4 py-2 flex-col', className)}
        ref={ref}
        {...props}
      >
        {/* タイトルを表示 */}
        <p className="text-xl font-semibold text-slate-900">{title ?? ''}</p>
        {/* 説明を表示 */}
        <p className="text-sm font-medium text-slate-900">
          {description ?? ''}
        </p>
        {/* タグを表示 */}
        {tags?.length && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span key={`${tag}-${index}`} className="text-sm text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }
);

export type { TextBoxProps };
TextBox.displayName = 'TextBox';

export { TextBox };
