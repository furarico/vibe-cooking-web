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
    return (
      <Button
        ref={ref}
        variant="ghost"
        onClick={onClick}
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
