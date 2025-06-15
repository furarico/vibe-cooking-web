import type { Meta, StoryObj } from '@storybook/nextjs';
import { IngredientsListCard } from './ingredients-list-card';

const meta: Meta<typeof IngredientsListCard> = {
  title: 'Components/IngredientsListCard',
  component: IngredientsListCard,
};

export default meta;
type Story = StoryObj<typeof IngredientsListCard>;

export const Default: Story = {
  args: {
    name: 'トマト',
    amount: '2',
    unit: '個',
    note: '軽く水で洗っておく',
  },
};
