import * as React from 'react';
import { InstructionsItem, InstructionsItemProps } from './instructions-item';

interface InstructionsProps {
  steps: InstructionsItemProps[]; // 複数の手順を受け取る
}

const Instructions: React.FC<InstructionsProps> = ({ steps }) => {
  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-4">作り方 / 手順</h2>
      <div className="space-y-2">
        {steps.map(stepItem => (
          <InstructionsItem key={stepItem.step} {...stepItem} />
        ))}
      </div>
    </div>
  );
};

export { Instructions };
export type { InstructionsProps };
