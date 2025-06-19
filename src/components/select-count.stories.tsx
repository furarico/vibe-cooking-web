import type { Meta, StoryObj } from '@storybook/nextjs';
import { SelectCount } from './select-count';

const meta: Meta<typeof SelectCount> = {
  title: 'Components/SelectCount',
  component: SelectCount,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '選択数を表示するカウントバッジコンポーネント。0以下の場合は表示されません。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    count: {
      description: '表示する数値',
      control: { type: 'number' },
    },
    className: {
      description: 'カスタムCSSクラス名',
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    count: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'デフォルトのカウント表示。数値が3の場合の表示例です。',
      },
    },
  },
};

export const SingleDigit: Story = {
  args: {
    count: 5,
  },
  parameters: {
    docs: {
      description: {
        story: '1桁の数値での表示例。標準的な使用ケースです。',
      },
    },
  },
};

export const DoubleDigit: Story = {
  args: {
    count: 12,
  },
  parameters: {
    docs: {
      description: {
        story: '2桁の数値での表示例。多くの項目が選択された場合の表示です。',
      },
    },
  },
};

export const LargeNumber: Story = {
  args: {
    count: 99,
  },
  parameters: {
    docs: {
      description: {
        story: '大きな数値での表示例。99までの数値表示確認に使用します。',
      },
    },
  },
};

export const VeryLargeNumber: Story = {
  args: {
    count: 999,
  },
  parameters: {
    docs: {
      description: {
        story:
          '非常に大きな数値での表示例。レイアウトの崩れがないか確認します。',
      },
    },
  },
};

export const Zero: Story = {
  args: {
    count: 0,
  },
  parameters: {
    docs: {
      description: {
        story:
          '0の場合の表示例。コンポーネントが非表示になることを確認できます。',
      },
    },
  },
};

export const NegativeNumber: Story = {
  args: {
    count: -5,
  },
  parameters: {
    docs: {
      description: {
        story:
          '負の数値の場合の表示例。コンポーネントが非表示になることを確認できます。',
      },
    },
  },
};

export const WithCustomClass: Story = {
  args: {
    count: 7,
    className: 'bg-red-500 text-white',
  },
  parameters: {
    docs: {
      description: {
        story: 'カスタムクラスを適用した表示例。背景色を赤に変更した例です。',
      },
    },
  },
};

export const WithLargerSize: Story = {
  args: {
    count: 8,
    className: 'w-8 h-8 text-sm',
  },
  parameters: {
    docs: {
      description: {
        story:
          'より大きなサイズでの表示例。重要な情報を強調したい場合に使用します。',
      },
    },
  },
};

export const WithSmallerSize: Story = {
  args: {
    count: 2,
    className: 'w-4 h-4 text-xs',
  },
  parameters: {
    docs: {
      description: {
        story:
          'より小さなサイズでの表示例。コンパクトなレイアウトで使用する場合に適用します。',
      },
    },
  },
};

export const WithDifferentColors: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '異なる色のバリエーション例。様々なコンテキストでの使用パターンを確認できます。',
      },
    },
  },
  render: () => (
    <div className="flex gap-4 items-center">
      <SelectCount count={3} />
      <SelectCount count={5} className="bg-green-500" />
      <SelectCount count={8} className="bg-blue-500" />
      <SelectCount count={12} className="bg-purple-500" />
      <SelectCount count={25} className="bg-orange-500" />
    </div>
  ),
};

export const InContext: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '実際の使用コンテキストでの表示例。ボタンやカードと組み合わせた場合の表示です。',
      },
    },
  },
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-4 border rounded-lg">
        <span className="text-sm font-medium">選択されたアイテム</span>
        <SelectCount count={4} />
      </div>
      <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium">お気に入り</span>
        <SelectCount count={12} className="bg-red-500" />
      </div>
      <div className="flex items-center gap-2 p-4 border rounded-lg">
        <span className="text-sm font-medium">未読通知</span>
        <SelectCount count={0} />
        <span className="text-xs text-gray-500">（0の場合は非表示）</span>
      </div>
    </div>
  ),
};
