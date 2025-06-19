import type { Meta, StoryObj } from '@storybook/nextjs';
import { Ingredients } from './ingredients';

const meta: Meta<typeof Ingredients> = {
  title: 'Components/Ingredients',
  component: Ingredients,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Ingredients>;

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
