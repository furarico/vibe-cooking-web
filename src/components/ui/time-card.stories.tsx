import type { Meta, StoryObj } from '@storybook/nextjs';
import { TimeCard } from './time-card';

const meta: Meta<typeof TimeCard> = {
  title: 'UI/TimeCard',
  component: TimeCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    label: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '調理時間',
    label: '30分',
  },
};
