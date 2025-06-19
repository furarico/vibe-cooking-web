import type { Meta, StoryObj } from '@storybook/nextjs';
import { ProgressBar } from './instruction-progress';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
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
    totalSteps: 10,
    currentStep: 5,
  },
};

export const Completed: Story = {
  args: {
    totalSteps: 10,
    currentStep: 10,
  },
};

export const Start: Story = {
  args: {
    totalSteps: 10,
    currentStep: 1,
  },
};
