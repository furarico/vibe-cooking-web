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
        <h2 className="text-xl font-semibold text-slate-900">{title ?? ''}</h2>
        {/* 説明を表示 */}
        <p className="text-m font-medium text-slate-900">{description ?? ''}</p>
        {/* タグを表示 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
              <span key={tag} className="text-sm text-slate-600">
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
