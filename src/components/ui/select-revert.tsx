import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import * as React from 'react';

interface SelectRevertProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const SelectRevert = React.forwardRef<HTMLButtonElement, SelectRevertProps>(
  ({ onClick, disabled = false, className, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // イベントの伝播を停止してリンクのナビゲーションを防ぐ
      e.preventDefault();
      e.stopPropagation();

      if (onClick) {
        onClick();
      }
    };

    return (
      <Button
        ref={ref}
        variant="ghost"
        onClick={handleClick}
        disabled={disabled}
        className={`text-red-600 hover:text-red-700 hover:bg-red-50 ${className}`}
        {...props}
      >
        <Trash2 className="w-4 h-4 text-red-600 items-center" />
      </Button>
    );
  }
);

SelectRevert.displayName = 'SelectRevert';

export { SelectRevert };
export type { SelectRevertProps };
