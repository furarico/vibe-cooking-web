import type { Meta, StoryObj } from '@storybook/nextjs';
import { IngredientsItem } from './ingredients-item';

const meta: Meta<typeof IngredientsItem> = {
  title: 'UI/IngredientsItem',
  component: IngredientsItem,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof IngredientsItem>;

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
