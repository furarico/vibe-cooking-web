import { ProgressBar, ProgressStep } from './progressbar';

export default {
  title: 'UI/ProgressBar',
  component: ProgressBar,
};

const steps: ProgressStep[] = [
  { step: 1 },
  { step: 2 },
  { step: 3 },
  { step: 4 },
];

export const Default = () => <ProgressBar steps={steps} currentStep={2} />;

export const Completed = () => <ProgressBar steps={steps} currentStep={4} />;

export const Start = () => <ProgressBar steps={steps} currentStep={1} />;
