import * as React from 'react';

interface StepBadgeProps {
  step: number;
  className?: string;
}

const StepBadge: React.FC<StepBadgeProps> = ({ step, className = '' }) => {
  return (
    <div
      className={`inline-flex items-center justify-center w-8 h-8 bg-slate-600 text-white rounded-full font-bold ${className}`}
    >
      {step}
    </div>
  );
};

export type { StepBadgeProps };
StepBadge.displayName = 'StepBadge';
export { StepBadge };
