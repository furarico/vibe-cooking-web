import * as React from 'react';
import { InstructionsItem, InstructionsItemProps } from './instructions-item';

interface RecipeInstructionProps {
  step: number; //
  description: string; // 手順の説明
}

const InstructionSteps: React.FC<InstructionsItemProps> = ({
  step,
  description,
}) => {
  return (
    <div className="w-full max-w-[600px] flex items-center gap-2">
      <div className="flex-shrink-0">
        <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-600 text-white rounded-full font-bold">
          {step}
        </span>
      </div>
      <div className="flex-wrap text-gray-900">
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

export type { InstructionsItemProps };
InstructionsItem.displayName = 'InstructionSteps';
export { InstructionSteps };
