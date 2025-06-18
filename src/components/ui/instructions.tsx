import { cn } from '@/lib/utils';
import * as React from 'react';
import { Card } from './card';
import { InstructionsItem, InstructionsItemProps } from './instructions-item';

interface InstructionsProps {
  steps: InstructionsItemProps[]; // 複数の手順を受け取る
  className?: string;
}

const Instructions: React.FC<InstructionsProps> = ({ steps, className }) => {
  return (
    <div className={cn('w-full flex flex-col gap-4', className)}>
      <h2 className="text-lg font-bold">手順</h2>
      <Card className="p-4 flex flex-col gap-4">
        {steps.map(stepItem => (
          <InstructionsItem key={stepItem.step} {...stepItem} />
        ))}
      </Card>
    </div>
  );
};

export { Instructions };
Instructions.displayName = 'Instructions';

export type { InstructionsProps };
