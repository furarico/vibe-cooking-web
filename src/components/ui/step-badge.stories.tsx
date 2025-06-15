import type { Meta, StoryObj } from '@storybook/nextjs';
import { StepBadge } from './step-badge';

const meta: Meta<typeof StepBadge> = {
  title: 'UI/StepBadge',
  component: StepBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    step: {
      control: { type: 'number', min: 1, max: 99 },
      description: 'ステップ番号',
    },
    className: {
      control: 'text',
      description: '追加のCSSクラス',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    step: 1,
  },
};

export const MultipleSteps: Story = {
  render: () => (
    <div className="flex gap-4">
      <StepBadge step={1} />
      <StepBadge step={2} />
      <StepBadge step={3} />
      <StepBadge step={4} />
      <StepBadge step={5} />
    </div>
  ),
};

export const LargeNumbers: Story = {
  render: () => (
    <div className="flex gap-4">
      <StepBadge step={10} />
      <StepBadge step={25} />
      <StepBadge step={99} />
    </div>
  ),
};

export const WithCustomClass: Story = {
  args: {
    step: 1,
    className: 'bg-blue-600 hover:bg-blue-700 transition-colors',
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <StepBadge step={1} className="w-6 h-6 text-xs" />
      <StepBadge step={2} />
      <StepBadge step={3} className="w-10 h-10 text-lg" />
      <StepBadge step={4} className="w-12 h-12 text-xl" />
    </div>
  ),
};
