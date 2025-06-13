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
        className={cn(
          'w-full items-center flex gap-0 rounded-md border border-slate-200 bg-white px-4 py-2 shadow-md transition-all hover:shadow-lg cursor-pointer flex-col',
          className
        )}
        ref={ref}
        {...props}
      >
        {/* タイトルを表示 */}
        <p className="text-m font-Medium text-slate-500">{title ?? ''}</p>
        {/* 説明を表示 */}
        <p className="text-lg font-semibold text-slate-900">
          {description ?? ''}
        </p>
        {/* タグを表示 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
              >
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
