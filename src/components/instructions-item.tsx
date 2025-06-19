import * as React from 'react';
import { StepBadge } from './step-badge';

interface InstructionsItemProps {
  step: number;
  title?: string;
  description: string;
  imageUrl?: string;
  audioUrl?: string;
}

const InstructionsItem: React.FC<InstructionsItemProps> = ({
  step,
  title,
  description,
}) => {
  if (!title) {
    return (
      <div className="flex flex-row items-center gap-2">
        <StepBadge className="flex-shrink-0" step={step} />
        <div className="text-sm flex-wrap text-gray-900">{description}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <StepBadge className="flex-shrink-0" step={step} />
        <div className="text-lg font-bold text-gray-900">{title}</div>
      </div>
      <div className="ml-10 text-sm flex-wrap text-gray-900">{description}</div>
    </div>
  );
};

export type { InstructionsItemProps };
InstructionsItem.displayName = 'InstructionsItem';
export { InstructionsItem };
