import { Recipe } from '@/lib/api-client';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { RecipeCardList } from './recipe-card-list';

// モックデータ用のレシピサンプル
const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: '和風チキンカレー',
    description:
      '醤油ベースの和風だしを使った優しい味のチキンカレーです。日本人の味覚に合わせたまろやかな味わいが特徴です。',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    ingredients: [],
    instructions: [],
    tags: ['和風', 'カレー', 'チキン', '家族向け'],
    imageUrl:
      'https://r2.vibe-cooking.furari.co/images/recipe-thumbnails/default.png',
    categoryId: '1',
    category: {
      id: '1',
      name: 'メイン料理',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: '手作りハンバーグ',
    description:
      'ジューシーで柔らかい手作りハンバーグ。特製デミグラスソースでより美味しく仕上げました。',
    prepTime: 20,
    cookTime: 25,
    servings: 3,
    ingredients: [],
    instructions: [],
    tags: ['洋食', 'ハンバーグ', '手作り', '肉料理'],
    imageUrl:
      'https://r2.vibe-cooking.furari.co/images/recipe-thumbnails/default.png',
    categoryId: '1',
    category: {
      id: '1',
      name: 'メイン料理',
    },
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    title: '野菜炒め',
    description:
      'シャキシャキとした食感を残した彩り豊かな野菜炒めです。オイスターソースでコクのある味付けに。',
    prepTime: 10,
    cookTime: 8,
    servings: 2,
    ingredients: [],
    instructions: [],
    tags: ['中華', '野菜', 'ヘルシー', '簡単'],
    imageUrl:
      'https://r2.vibe-cooking.furari.co/images/recipe-thumbnails/default.png',
    categoryId: '2',
    category: {
      id: '2',
      name: '副菜',
    },
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    title: 'クリームパスタ',
    description:
      '濃厚なクリームソースとプリプリのエビが絶品のパスタです。特別な日のディナーにもぴったり。',
    prepTime: 12,
    cookTime: 15,
    servings: 2,
    ingredients: [],
    instructions: [],
    tags: ['イタリアン', 'パスタ', 'クリーム', 'エビ'],
    imageUrl:
      'https://r2.vibe-cooking.furari.co/images/recipe-thumbnails/default.png',
    categoryId: '1',
    category: {
      id: '1',
      name: 'メイン料理',
    },
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
  {
    id: '5',
    title: 'オムライス',
    description:
      'ふわとろの卵で包んだケチャップライスの定番オムライス。子供から大人まで大人気のメニューです。',
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    ingredients: [],
    instructions: [],
    tags: ['洋食', 'オムライス', '卵料理', '定番'],
    imageUrl:
      'https://r2.vibe-cooking.furari.co/images/recipe-thumbnails/default.png',
    categoryId: '1',
    category: {
      id: '1',
      name: 'メイン料理',
    },
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
];

const meta: Meta<typeof RecipeCardList> = {
  title: 'UI/RecipeCardList',
  component: RecipeCardList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    recipes: {
      description: '表示するレシピの配列',
    },
    className: {
      control: 'text',
      description: '追加のCSSクラス',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    recipes: mockRecipes,
  },
  parameters: {
    docs: {
      description: {
        story: '複数のレシピカードを水平にスクロール可能なリストで表示',
      },
    },
  },
};

export const SingleRecipe: Story = {
  args: {
    recipes: [mockRecipes[0]],
  },
  parameters: {
    docs: {
      description: {
        story: 'レシピが1つだけの場合の表示',
      },
    },
  },
};

export const TwoRecipes: Story = {
  args: {
    recipes: mockRecipes.slice(0, 2),
  },
  parameters: {
    docs: {
      description: {
        story: 'レシピが2つの場合の表示',
      },
    },
  },
};

export const ManyRecipes: Story = {
  args: {
    recipes: [
      ...mockRecipes,
      // 追加レシピでスクロールを確認
      {
        id: '6',
        title: '唐揚げ',
        description:
          'サクサクジューシーな定番の唐揚げ。下味をしっかりつけて美味しく仕上げました。',
        prepTime: 30,
        cookTime: 15,
        servings: 4,
        ingredients: [],
        instructions: [],
        tags: ['和食', '鶏肉', '揚げ物', '定番'],
        imageUrl:
          'https://r2.vibe-cooking.furari.co/images/recipe-thumbnails/default.png',
        categoryId: '1',
        category: { id: '1', name: 'メイン料理' },
        createdAt: '2024-01-06T00:00:00Z',
        updatedAt: '2024-01-06T00:00:00Z',
      },
      {
        id: '7',
        title: 'みそ汁',
        description:
          'わかめと豆腐の定番みそ汁。毎日の食卓に欠かせない一品です。',
        prepTime: 5,
        cookTime: 10,
        servings: 4,
        ingredients: [],
        instructions: [],
        tags: ['和食', 'みそ汁', '汁物', '定番'],
        imageUrl:
          'https://r2.vibe-cooking.furari.co/images/recipe-thumbnails/default.png',
        categoryId: '3',
        category: { id: '3', name: '汁物' },
        createdAt: '2024-01-07T00:00:00Z',
        updatedAt: '2024-01-07T00:00:00Z',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '多数のレシピがある場合の水平スクロール表示',
      },
    },
  },
};

export const EmptyList: Story = {
  args: {
    recipes: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'レシピがない場合は何も表示されない（null を返す）',
      },
    },
  },
};

export const CustomClassName: Story = {
  args: {
    recipes: mockRecipes.slice(0, 3),
    className: 'bg-slate-50 p-4 rounded-lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'カスタムCSSクラスを適用した場合の表示',
      },
    },
  },
};

export const LongTitlesAndDescriptions: Story = {
  args: {
    recipes: [
      {
        ...mockRecipes[0],
        title:
          'とても長いタイトルのレシピ名前がここに入ります。これは文字数制限のテストです。',
        description:
          'とても長い説明文がここに入ります。このレシピは複雑な工程を含み、多くの材料を使用する高度な料理です。説明が長くても適切に表示されることを確認するためのテストケースです。文字数制限により適切に省略されることを期待しています。',
      },
      ...mockRecipes.slice(1, 3),
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'タイトルや説明文が長い場合の表示（文字数制限による省略確認）',
      },
    },
  },
};
