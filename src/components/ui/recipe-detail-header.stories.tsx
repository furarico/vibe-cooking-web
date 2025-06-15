import type { Meta, StoryObj } from '@storybook/nextjs';
import { RecipeDetailHeader } from './recipe-detail-header';

const meta: Meta<typeof RecipeDetailHeader> = {
  title: 'UI/RecipeDetailHeader',
  component: RecipeDetailHeader,
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
      control: { type: 'object' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'アサリの味噌汁',
    description:
      'アサリの味噌汁は、シンプルで美味しい和食の一品です。アサリの旨味が味噌と絶妙に絡み、心温まる一杯になります。',
    tags: ['和食', '簡単'],
  },
};
