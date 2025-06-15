import type { Meta, StoryObj } from '@storybook/nextjs';
import { IngredientsList } from './ingredients-list';

const meta: Meta<typeof IngredientsList> = {
  title: 'Components/IngredientsList',
  component: IngredientsList,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof IngredientsList>;

export const Default: Story = {
  args: {
    ingredients: [
      { name: '小麦粉', amount: '200', unit: 'g' },
      { name: '砂糖', amount: '100', unit: 'g', note: '上白糖がおすすめ' },
      { name: '卵', amount: 2, unit: '個' },
      { name: '牛乳', amount: '150', unit: 'ml' },
    ],
  },
};
