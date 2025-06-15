// IngredientItem.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';
import { IngredientItem } from './ingredient-item';

const meta: Meta<typeof IngredientItem> = {
  title: 'UI/IngredientItem',
  component: IngredientItem,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IngredientItem>;

export const Default: Story = {
  args: {
    name: 'トマト',
    amount: 2,
    unit: '個',
    note: '軽く水で洗っておく',
  },
};

export const WithoutNote: Story = {
  args: {
    name: '玉ねぎ',
    amount: 1,
    unit: '個',
  },
};
