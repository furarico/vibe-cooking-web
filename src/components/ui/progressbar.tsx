import * as React from 'react';

interface ProgressStep {
  step: number; // 手順の値を受け取る
}

interface ProgressStepProps {
  steps: ProgressStep[];
  currentStep: number; // 現在のステップを受け取る
}
const ProgressBar: React.FC<ProgressStepProps> = ({ steps, currentStep }) => {
  const totalSteps = steps.length;
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-[600px] flex items-center gap-4">
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-slate-600 transition-all duration-300 ease-out"
          style={{ width: `${progressValue}%` }}
        />
      </div>
      <div className="text-sm text-gray-600 whitespace-nowrap">
        {currentStep} / {totalSteps}
      </div>
    </div>
  );
};

export { ProgressBar };
export type { ProgressStep, ProgressStepProps };
