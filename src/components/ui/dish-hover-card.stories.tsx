import type { Meta, StoryObj } from '@storybook/nextjs';
import { DishHoverCard } from './dish-hover-card';

const meta: Meta<typeof DishHoverCard> = {
  title: 'UI/DishHoverCard',
  component: DishHoverCard,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
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

// Figmaデザインに基づくデフォルトの例
export const Default: Story = {
  args: {
    title: '料理名',
    description:
      '料理補足情報テキストテキストテキストテキストテキストテキストテキスト',
    tags: ['rice', 'okinawa', 'tomato'],
    cookingTime: '30min',
    imageUrl: 'https://picsum.photos/90/90?random=1',
    imageAlt: '料理の写真',
  },
};

export const JapaneseRecipe: Story = {
  args: {
    title: '沖縄風チャンプルー',
    description: '沖縄の伝統的な炒め物。ゴーヤとトマトの組み合わせが絶品です。',
    tags: ['okinawa', 'vegetables', 'healthy'],
    cookingTime: '25min',
    imageUrl: 'https://picsum.photos/90/90?random=2',
    imageAlt: '沖縄風チャンプルーの写真',
  },
};

export const LongTitle: Story = {
  args: {
    title: '本格的なイタリアンボロネーゼパスタ',
    description: 'じっくり煮込んだミートソースが絶品のボロネーゼです。',
    tags: ['italian', 'pasta', 'meat'],
    cookingTime: '45min',
    imageUrl: 'https://picsum.photos/90/90?random=3',
    imageAlt: 'ボロネーゼパスタの写真',
  },
};

export const LongDescription: Story = {
  args: {
    title: 'トマトライス',
    description:
      'トマトの酸味とライスの甘みが絶妙にマッチした一品。野菜をたっぷり使って栄養満点。家族みんなで楽しめる定番料理です。',
    tags: ['rice', 'tomato', 'family'],
    cookingTime: '30min',
    imageUrl: 'https://picsum.photos/90/90?random=4',
    imageAlt: 'トマトライスの写真',
  },
};

export const ManyTags: Story = {
  args: {
    title: 'ヘルシーサラダボウル',
    description: '新鮮な野菜をたっぷり使ったヘルシーなサラダです。',
    tags: ['healthy', 'salad', 'vegetarian', 'lowcal', 'vitamin', 'fresh'],
    cookingTime: '15min',
    imageUrl: 'https://picsum.photos/90/90?random=5',
    imageAlt: 'ヘルシーサラダの写真',
  },
};

export const QuickRecipe: Story = {
  args: {
    title: '簡単おにぎり',
    description: '忙しい朝にも簡単に作れるおにぎりです。',
    tags: ['rice', 'quick'],
    cookingTime: '5min',
    imageUrl: 'https://picsum.photos/90/90?random=6',
    imageAlt: 'おにぎりの写真',
  },
};
