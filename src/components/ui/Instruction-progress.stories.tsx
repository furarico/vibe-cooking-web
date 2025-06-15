import type { Meta, StoryObj } from '@storybook/nextjs';
import { ProgressBar, ProgressStep } from './Instruction-progress';

const steps: ProgressStep[] = [
  { step: 1 },
  { step: 2 },
  { step: 3 },
  { step: 4 },
  { step: 5 },
  { step: 6 },
  { step: 7 },
  { step: 8 },
  { step: 9 },
  { step: 10 },
];

const meta: Meta<typeof ProgressBar> = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'], // Docs タブの自動生成を促す
  parameters: {
    docs: {
      description: {
        component: 'ステップの進捗状況を示す ProgressBar コンポーネントです。',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    steps,
    currentStep: 5,
  },
};

export const Completed: Story = {
  args: {
    steps,
    currentStep: 10,
  },
};

export const Start: Story = {
  args: {
    steps,
    currentStep: 1,
  },
};
