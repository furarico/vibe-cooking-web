import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'ボタン',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: '削除',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'アウトライン',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'セカンダリ',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'ゴースト',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'リンク',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: '小さなボタン',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: '大きなボタン',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: '無効なボタン',
  },
};
