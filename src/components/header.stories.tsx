import type { Meta, StoryObj } from '@storybook/nextjs';
import { action } from 'storybook/actions';

import { Header } from './header';

// Next.js routerのモック
const mockPush = action('router.push');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'アプリケーションのヘッダーコンポーネント。検索機能付きの入力フィールドを含みます。',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="bg-gray-50 min-h-[200px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'デフォルトのヘッダー表示。検索フィールドと検索ボタンが表示されます。',
      },
    },
  },
};

export const WithBackground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '背景色を設定した状態でのヘッダー表示。実際のアプリケーションでの表示に近い形です。',
      },
    },
  },
  decorators: [
    Story => (
      <div className="bg-white border-b">
        <Story />
      </div>
    ),
  ],
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'モバイル表示でのヘッダー。レスポンシブデザインの確認に使用します。',
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
          'タブレット表示でのヘッダー。中間サイズでの表示確認に使用します。',
      },
    },
  },
};

export const InteractiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'インタラクティブなデモ。検索フィールドに入力してEnterキーまたは検索ボタンをクリックするとアクションが発火します。',
      },
    },
  },
  render: function InteractiveHeader() {
    return <Header />;
  },
};

export const CustomStyling: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイリングを適用したヘッダー。異なる背景色や境界線での表示例です。',
      },
    },
  },
  decorators: [
    Story => (
      <div className="bg-blue-50 border border-blue-200 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const DarkMode: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#1f2937' }],
    },
    docs: {
      description: {
        story:
          'ダークモードでのヘッダー表示例。暗い背景での視認性確認に使用します。',
      },
    },
  },
  decorators: [
    Story => (
      <div className="bg-gray-800 text-white">
        <Story />
      </div>
    ),
  ],
};

// React import for InteractiveDemo
