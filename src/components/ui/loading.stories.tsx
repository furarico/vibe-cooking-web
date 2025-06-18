import { Loading } from '@/components/ui/loading';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'UI/Loading',
  component: Loading,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ローディング状態を表示するコンポーネント。画面幅に応じてテキストの表示/非表示が切り替わります。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'ローディング時に表示するテキスト',
      defaultValue: '読み込み中...',
    },
    className: {
      control: 'text',
      description: '追加のCSSクラス',
    },
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルト
export const Default: Story = {
  args: {},
};

// カスタムテキスト
export const CustomText: Story = {
  args: {
    text: '読み込み中...',
  },
};

// レシピ読み込み用
export const RecipeLoading: Story = {
  args: {
    text: 'レシピを取得中です...',
  },
};

// 音声認識用
export const VoiceProcessing: Story = {
  args: {
    text: '音声を認識中...',
  },
};

// データ処理用
export const DataProcessing: Story = {
  args: {
    text: 'データを処理中...',
  },
};

// スタイルカスタマイズ
export const CustomStyle: Story = {
  args: {
    text: 'カスタマイズされたローディング',
    className: 'mt-20 bg-gray-50 p-8 rounded-lg',
  },
};

// モバイル表示確認用（テキストなし）
export const MobileView: Story = {
  args: {
    text: 'このテキストはモバイルでは表示されません',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'モバイル表示では、スピナーのみが表示されます（768px未満）',
      },
    },
  },
};

// レスポンシブテスト用
export const ResponsiveTest: Story = {
  args: {
    text: '画面幅を変更してテキストの表示/非表示を確認してください',
  },
  parameters: {
    docs: {
      description: {
        story:
          '画面幅768px以上でテキストが表示されます。ブラウザのデベロッパーツールでレスポンシブモードを使用して確認してください。',
      },
    },
  },
};
