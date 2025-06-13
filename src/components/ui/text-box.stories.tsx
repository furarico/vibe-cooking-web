import type { Meta, StoryObj } from '@storybook/nextjs';
import { TextBox } from './text-box';

const meta: Meta<typeof TextBox> = {
  title: 'UI/TextBox',
  component: TextBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    tags: {
      control: { type: 'object' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '調理時間',
    description: '30分',
    tags: ['和食', '簡単'],
  },
};
