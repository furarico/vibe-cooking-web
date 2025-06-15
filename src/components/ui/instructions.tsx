import * as React from 'react';
import { InstructionsItemProps } from './instructions-item';

interface InstructionsProps {
  steps: InstructionsItemProps[]; // 複数の手順を受け取る
}

const Instructions: React.FC<InstructionsProps> = ({ steps }) => {
  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-4">作り方 / 手順</h2>
      <div className="space-y-2">
        {steps.map(stepItem => (
          <div key={stepItem.step} className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-600 text-white rounded-full font-bold">
                {stepItem.step}
              </span>
            </div>
            <div className="flex-wrap text-gray-900">
              <p className="text-sm">{stepItem.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Instructions };
export type { InstructionsProps };
