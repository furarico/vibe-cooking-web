import type { Meta, StoryObj } from '@storybook/nextjs';
import { Footer } from './footer';

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'アプリケーションのフッターコンポーネント。コピーライト情報を表示します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      description: 'カスタムCSSクラス名',
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'デフォルトのフッター表示。基本的なコピーライト情報が表示されます。',
      },
    },
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'bg-gray-100 py-8',
  },
  parameters: {
    docs: {
      description: {
        story:
          'カスタムクラスを適用したフッター。背景色とパディングを追加した例です。',
      },
    },
  },
};

export const WithBorder: Story = {
  args: {
    className: 'border-t border-gray-200 py-4',
  },
  parameters: {
    docs: {
      description: {
        story:
          '上部に境界線を追加したフッター。ページコンテンツとの境界を明確にします。',
      },
    },
  },
};

export const DarkTheme: Story = {
  args: {
    className: 'bg-gray-800 text-white py-6',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#1f2937' }],
    },
    docs: {
      description: {
        story:
          'ダークテーマでのフッター表示。暗い背景に白いテキストを使用した例です。',
      },
    },
  },
};

export const Minimal: Story = {
  args: {
    className: 'py-2',
  },
  parameters: {
    docs: {
      description: {
        story: 'ミニマルなフッター表示。最小限のパディングで表示した例です。',
      },
    },
  },
};

export const Spacious: Story = {
  args: {
    className: 'py-12 bg-slate-50',
  },
  parameters: {
    docs: {
      description: {
        story:
          'スペースを多く取ったフッター表示。大きなパディングと背景色を適用した例です。',
      },
    },
  },
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'モバイル表示でのフッター。レスポンシブデザインの確認に使用します。',
      },
    },
  },
};

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story:
          'タブレット表示でのフッター。中間サイズでの表示確認に使用します。',
      },
    },
  },
};

export const InContext: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'ページコンテンツの文脈でのフッター表示。実際の使用環境に近い形での表示例です。',
      },
    },
  },
  decorators: [
    Story => (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 bg-white p-8">
          <h1 className="text-2xl font-bold mb-4">ページコンテンツ</h1>
          <p className="text-gray-600 mb-4">
            ここにメインコンテンツが表示されます。フッターは画面の最下部に配置されます。
          </p>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};
