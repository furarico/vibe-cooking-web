import type { Meta, StoryObj } from '@storybook/nextjs';
import { InstructionsItem } from './instructions-item';

const meta: Meta<typeof InstructionsItem> = {
  title: 'UI/RecipeInstruction',
  component: InstructionsItem,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof InstructionsItem>;

export const Default: Story = {
  args: {
    step: 1,
    description: '玉ねぎはみじん切りにし、ミニトマトは4等分に切る。',
  },
};
