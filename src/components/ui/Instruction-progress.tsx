'use client';

import { Progress } from '@/components/ui/progress';
import * as React from 'react';

interface ProgressStep {
  step: number;
}

interface ProgressStepProps {
  steps: ProgressStep[];
  currentStep: number;
}

const ProgressBar: React.FC<ProgressStepProps> = ({ steps, currentStep }) => {
  const totalSteps = steps.length;
  const progressValue = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="w-full max-w-[600px] flex items-center gap-4">
      <Progress
        value={progressValue}
        className="flex-1 h-2 bg-slate-200 [&>div]:bg-slate-600"
      />
      <div className="text-sm text-gray-600 whitespace-nowrap">
        {currentStep} / {totalSteps}
      </div>
    </div>
  );
};

export { ProgressBar };
export type { ProgressStep, ProgressStepProps };
