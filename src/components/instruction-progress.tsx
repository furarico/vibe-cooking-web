'use client';

import { Progress } from '@/components/ui/progress';
import * as React from 'react';

interface ProgressStepProps {
  totalSteps: number;
  currentStep: number;
}

const ProgressBar: React.FC<ProgressStepProps> = ({
  totalSteps,
  currentStep,
}) => {
  const progressValue =
    totalSteps > 0
      ? Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100)
      : 0;

  return (
    <div className="w-full flex flex-row items-center gap-2">
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
export type { ProgressStepProps };
