import { Meta, StoryObj } from '@storybook/nextjs';
import { CookingCompletedCard } from './cooking-completed-card';

const meta: Meta<typeof CookingCompletedCard> = {
  title: 'Components/CookingCompletedCard',
  component: CookingCompletedCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CookingCompletedCard>;

export const Default: Story = {
  render: args => <CookingCompletedCard {...args} />,
  args: {
    className: '',
  },
};

export const WithCustomClass: Story = {
  render: args => <CookingCompletedCard {...args} />,
  args: {
    className: 'bg-yellow-100',
  },
};
