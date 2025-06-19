import type { Meta, StoryObj } from '@storybook/nextjs';
import { TimeCard } from './time-card';

const meta: Meta<typeof TimeCard> = {
  title: 'Components/TimeCard',
  component: TimeCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['prep', 'cook', 'servings'],
    },
    number: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'cook',
    number: 30,
  },
};

export const Prep: Story = {
  args: {
    variant: 'prep',
    number: 10,
  },
};

export const Cook: Story = {
  args: {
    variant: 'cook',
    number: 30,
  },
};

export const Servings: Story = {
  args: {
    variant: 'servings',
    number: 4,
  },
};
