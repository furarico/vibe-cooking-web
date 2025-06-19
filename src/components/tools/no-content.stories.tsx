import { NoContent } from '@/components/tools/no-content';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Tools/NoContent',
  component: NoContent,
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
} satisfies Meta<typeof NoContent>;

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルト
export const Default: Story = {
  args: {},
};

// カスタムテキスト
export const CustomText: Story = {
  args: {
    text: '調理するレシピがありません',
  },
};
