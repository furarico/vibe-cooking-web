import type { Meta, StoryObj } from '@storybook/nextjs';

import { Progress } from './progress';

const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '進捗の値（0-100%）',
    },
    className: {
      control: 'text',
      description: '追加のCSSクラス',
    },
  },
  decorators: [
    Story => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
  },
};

export const Empty: Story = {
  args: {
    value: 0,
  },
  parameters: {
    docs: {
      description: {
        story: '進捗が0%の状態',
      },
    },
  },
};

export const Quarter: Story = {
  args: {
    value: 25,
  },
  parameters: {
    docs: {
      description: {
        story: '進捗が25%の状態',
      },
    },
  },
};

export const Half: Story = {
  args: {
    value: 50,
  },
  parameters: {
    docs: {
      description: {
        story: '進捗が50%の状態',
      },
    },
  },
};

export const ThreeQuarters: Story = {
  args: {
    value: 75,
  },
  parameters: {
    docs: {
      description: {
        story: '進捗が75%の状態',
      },
    },
  },
};

export const Complete: Story = {
  args: {
    value: 100,
  },
  parameters: {
    docs: {
      description: {
        story: '進捗が100%（完了）の状態',
      },
    },
  },
};

export const OverValue: Story = {
  args: {
    value: 120,
  },
  parameters: {
    docs: {
      description: {
        story: '100%を超える値を設定した場合（100%でクランプされる）',
      },
    },
  },
};

export const NegativeValue: Story = {
  args: {
    value: -20,
  },
  parameters: {
    docs: {
      description: {
        story: '負の値を設定した場合（0%でクランプされる）',
      },
    },
  },
};

export const CustomWidth: Story = {
  args: {
    value: 60,
    className: 'w-96',
  },
  parameters: {
    docs: {
      description: {
        story: 'カスタムの幅を適用した進捗バー',
      },
    },
  },
  decorators: [
    Story => (
      <div>
        <Story />
      </div>
    ),
  ],
};
