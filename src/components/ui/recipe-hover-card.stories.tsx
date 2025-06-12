import type { Meta, StoryObj } from '@storybook/nextjs';
import { RecipeCard } from './recipe-hover-card';

const meta: Meta<typeof RecipeCard> = {
  title: 'UI/RecipeCard',
  component: RecipeCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['card', 'row'],
    },
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    tags: {
      control: 'object',
    },
    cookingTime: {
      control: 'number',
    },
    imageUrl: {
      control: 'text',
    },
    imageAlt: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'card',
    title: '美味しいパスタ',
    description: 'トマトとバジルの香りが食欲をそそる定番のパスタレシピです。',
    tags: ['イタリアン', 'パスタ'],
    cookingTime: 30,
    imageUrl: 'https://picsum.photos/188/98?random=1',
    imageAlt: '美味しいパスタの写真',
  },
};

export const LongTitle: Story = {
  args: {
    variant: 'card',
    title: '本格的なイタリアンボロネーゼパスタ',
    description: 'じっくり煮込んだミートソースが絶品のボロネーゼです。',
    tags: ['イタリアン', 'パスタ', 'ミート'],
    cookingTime: 45,
    imageUrl: 'https://picsum.photos/188/98?random=2',
    imageAlt: 'ボロネーゼパスタの写真',
  },
};

export const LongDescription: Story = {
  args: {
    variant: 'card',
    title: 'カレーライス',
    description:
      'スパイスから作る本格的なカレーライス。野菜とお肉がたっぷり入って栄養満点です。家族みんなで楽しめる定番の味です。',
    tags: ['カレー', 'スパイス', '家族向け'],
    cookingTime: 60,
    imageUrl: 'https://picsum.photos/188/98?random=3',
    imageAlt: 'カレーライスの写真',
  },
};

export const ManyTags: Story = {
  args: {
    variant: 'card',
    title: 'ヘルシーサラダ',
    description: '新鮮な野菜をたっぷり使ったヘルシーなサラダです。',
    tags: ['ヘルシー', 'サラダ', 'ベジタリアン', '低カロリー', 'ビタミン'],
    cookingTime: 15,
    imageUrl: 'https://picsum.photos/188/98?random=4',
    imageAlt: 'ヘルシーサラダの写真',
  },
};

export const QuickRecipe: Story = {
  args: {
    variant: 'row',
    title: '簡単おにぎり',
    description: '忙しい朝にも簡単に作れるおにぎりです。',
    tags: ['和食', '簡単'],
    cookingTime: 5,
    imageUrl: 'https://picsum.photos/188/98?random=5',
    imageAlt: 'おにぎりの写真',
  },
};

// 異なる幅でのテスト用ストーリー
export const SmallWidth: Story = {
  args: {
    variant: 'card',
    title: '小さい幅テスト',
    description: '幅が小さい場合のレイアウトテストです。',
    tags: ['テスト'],
    cookingTime: 20,
    imageUrl: 'https://picsum.photos/188/98?random=6',
    imageAlt: 'テスト画像',
  },
  decorators: [
    Story => (
      <div style={{ width: '120px' }}>
        <Story />
      </div>
    ),
  ],
};

export const LargeWidth: Story = {
  args: {
    variant: 'card',
    title: '大きい幅テスト',
    description:
      '幅が大きい場合のレイアウトテストです。テキストの折り返しや全体のバランスを確認できます。',
    tags: ['テスト', '大きい幅'],
    cookingTime: 25,
    imageUrl: 'https://picsum.photos/188/98?random=7',
    imageAlt: 'テスト画像',
  },
  decorators: [
    Story => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};
