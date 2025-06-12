import type { Meta, StoryObj } from '@storybook/nextjs';
import { RecipeHoverCard } from './recipe-hover-card';

const meta: Meta<typeof RecipeHoverCard> = {
  title: 'UI/RecipeHoverCard',
  component: RecipeHoverCard,
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
      control: 'object',
    },
    cookingTime: {
      control: 'text',
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
    title: '美味しいパスタ',
    description: 'トマトとバジルの香りが食欲をそそる定番のパスタレシピです。',
    tags: ['イタリアン', 'パスタ'],
    cookingTime: '30分',
    imageUrl: 'https://picsum.photos/188/98?random=1',
    imageAlt: '美味しいパスタの写真',
  },
};

export const LongTitle: Story = {
  args: {
    title: '本格的なイタリアンボロネーゼパスタ',
    description: 'じっくり煮込んだミートソースが絶品のボロネーゼです。',
    tags: ['イタリアン', 'パスタ', 'ミート'],
    cookingTime: '45分',
    imageUrl: 'https://picsum.photos/188/98?random=2',
    imageAlt: 'ボロネーゼパスタの写真',
  },
};

export const LongDescription: Story = {
  args: {
    title: 'カレーライス',
    description:
      'スパイスから作る本格的なカレーライス。野菜とお肉がたっぷり入って栄養満点です。家族みんなで楽しめる定番の味です。',
    tags: ['カレー', 'スパイス', '家族向け'],
    cookingTime: '60分',
    imageUrl: 'https://picsum.photos/188/98?random=3',
    imageAlt: 'カレーライスの写真',
  },
};

export const ManyTags: Story = {
  args: {
    title: 'ヘルシーサラダ',
    description: '新鮮な野菜をたっぷり使ったヘルシーなサラダです。',
    tags: ['ヘルシー', 'サラダ', 'ベジタリアン', '低カロリー', 'ビタミン'],
    cookingTime: '15分',
    imageUrl: 'https://picsum.photos/188/98?random=4',
    imageAlt: 'ヘルシーサラダの写真',
  },
};

export const QuickRecipe: Story = {
  args: {
    title: '簡単おにぎり',
    description: '忙しい朝にも簡単に作れるおにぎりです。',
    tags: ['和食', '簡単'],
    cookingTime: '5分',
    imageUrl: 'https://picsum.photos/188/98?random=5',
    imageAlt: 'おにぎりの写真',
  },
};
