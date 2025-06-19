import type { Meta, StoryObj } from '@storybook/nextjs';
import { action } from 'storybook/internal/actions';
import { RecipeCard } from './recipe-card';

const meta: Meta<typeof RecipeCard> = {
  title: 'Components/RecipeCard',
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
    imageUrl: 'https://r2.vibe-cooking.app/images/default.png',
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
    imageUrl: 'https://r2.vibe-cooking.app/images/default.png',
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
    imageUrl: 'https://r2.vibe-cooking.app/images/default.png',
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
    imageUrl: 'https://r2.vibe-cooking.app/images/default.png',
    imageAlt: 'ヘルシーサラダの写真',
  },
};

export const Row: Story = {
  args: {
    variant: 'row',
    title: '簡単おにぎり',
    description: '忙しい朝にも簡単に作れるおにぎりです。',
    tags: ['和食', '簡単'],
    cookingTime: 5,
    imageUrl: 'https://r2.vibe-cooking.app/images/default.png',
    imageAlt: 'おにぎりの写真',
  },
};

export const WithDelete: Story = {
  args: {
    variant: 'row',
    title: '美味しいパスタ',
    description: 'トマトとバジルの香りが食欲をそそる定番のパスタレシピです。',
    tags: ['イタリアン', 'パスタ'],
    cookingTime: 20,
    imageUrl: 'https://r2.vibe-cooking.app/images/default.png',
    onDelete: action('delete'),
  },
};
