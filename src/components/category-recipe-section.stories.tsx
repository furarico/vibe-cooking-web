import { sampleCategories, sampleRecipes } from '@/lib/mock-data';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { CategoryRecipeSection } from './category-recipe-section';

const meta: Meta<typeof CategoryRecipeSection> = {
  title: 'Components/CategoryRecipeSection',
  component: CategoryRecipeSection,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'カテゴリ別のレシピ一覧を表示するセクションコンポーネント。カテゴリ名とレシピカードリストを表示し、「もっと見る」ボタンを提供します。',
      },
    },
    mockData: {
      useRecipesByCategoryPresenter: {
        recipes: sampleRecipes.filter(
          recipe => recipe.category.id === sampleCategories[0].id
        ),
        loading: false,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    category: {
      description: 'レシピカテゴリ情報',
      control: { type: 'object' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    category: sampleCategories[0], // ご飯
  },
  parameters: {
    docs: {
      description: {
        story:
          'デフォルトのカテゴリレシピセクション表示。レシピが存在する場合の表示例です。',
      },
    },
    mockData: {
      useRecipesByCategoryPresenter: {
        recipes: sampleRecipes.filter(
          recipe => recipe.category.id === sampleCategories[0].id
        ),
        loading: false,
      },
    },
  },
};

export const WithManyRecipes: Story = {
  args: {
    category: sampleCategories[1], // おかず
  },
  parameters: {
    docs: {
      description: {
        story:
          '複数のレシピがある場合の表示例。「もっと見る」ボタンの有用性を確認できます。',
      },
    },
    mockData: {
      useRecipesByCategoryPresenter: {
        recipes: sampleRecipes.filter(
          recipe => recipe.category.id === sampleCategories[1].id
        ),
        loading: false,
      },
    },
  },
};

export const Loading: Story = {
  args: {
    category: sampleCategories[0],
  },
  parameters: {
    docs: {
      description: {
        story:
          'レシピデータの読み込み中の表示状態。ローディングスピナーが表示されます。',
      },
    },
    mockData: {
      useRecipesByCategoryPresenter: {
        recipes: [],
        loading: true,
      },
    },
  },
};

export const EmptyRecipes: Story = {
  args: {
    category: { id: 'empty-category', name: '該当なし' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'カテゴリにレシピが存在しない場合の表示状態。セクション全体が表示されません。',
      },
    },
    mockData: {
      useRecipesByCategoryPresenter: {
        recipes: [],
        loading: false,
      },
    },
  },
};

export const DesertCategory: Story = {
  args: {
    category: sampleCategories[2], // デザート
  },
  parameters: {
    docs: {
      description: {
        story:
          'デザートカテゴリの表示例。異なるカテゴリでの表示確認に使用します。',
      },
    },
    mockData: {
      useRecipesByCategoryPresenter: {
        recipes: sampleRecipes.filter(
          recipe => recipe.category.id === sampleCategories[2].id
        ),
        loading: false,
      },
    },
  },
};

export const LongCategoryName: Story = {
  args: {
    category: { id: 'long-name', name: '季節の野菜を使った健康的な家庭料理' },
  },
  parameters: {
    docs: {
      description: {
        story: '長いカテゴリ名での表示例。レイアウトの確認に使用します。',
      },
    },
    mockData: {
      useRecipesByCategoryPresenter: {
        recipes: sampleRecipes.slice(0, 2),
        loading: false,
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    category: sampleCategories[1],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'モバイル表示でのカテゴリレシピセクション。レスポンシブデザインの確認に使用します。',
      },
    },
    mockData: {
      useRecipesByCategoryPresenter: {
        recipes: sampleRecipes.filter(
          recipe => recipe.category.id === sampleCategories[1].id
        ),
        loading: false,
      },
    },
  },
};
