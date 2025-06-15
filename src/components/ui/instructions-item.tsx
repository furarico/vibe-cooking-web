import * as React from 'react';
import { StepBadge } from './step-badge';

interface InstructionsItemProps {
  step: number; //
  description: string; // 手順の説明
}

const InstructionsItem: React.FC<InstructionsItemProps> = ({
  step,
  description,
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">
        <StepBadge step={step} />
      </div>
      <div className="flex-wrap text-gray-900">
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

export type { InstructionsItemProps };
InstructionsItem.displayName = 'InstructionsItem';
export { InstructionsItem };
