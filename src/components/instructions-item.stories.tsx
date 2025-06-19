import type { Meta, StoryObj } from '@storybook/nextjs';
import { InstructionsItem } from './instructions-item';

const meta: Meta<typeof InstructionsItem> = {
  title: 'Components/InstructionsItem',
  component: InstructionsItem,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof InstructionsItem>;

export const Default: Story = {
  args: {
    step: 1,
    title: '玉ねぎを切る',
    description: '玉ねぎはみじん切りにし、ミニトマトは4等分に切る。',
  },
};

export const NoTitle: Story = {
  args: {
    step: 1,
    description: '玉ねぎはみじん切りにし、ミニトマトは4等分に切る。',
  },
};

export const LongDescription: Story = {
  args: {
    step: 1,
    title: '玉ねぎを切る',
    description:
      '玉ねぎはみじん切りにし、ミニトマトは4等分に切る。玉ねぎはみじん切りにし、ミニトマトは4等分に切る。玉ねぎはみじん切りにし、ミニトマトは4等分に切る。',
  },
};

export const LongDescriptionWithNoTitle: Story = {
  args: {
    step: 1,
    description:
      '玉ねぎはみじん切りにし、ミニトマトは4等分に切る。玉ねぎはみじん切りにし、ミニトマトは4等分に切る。玉ねぎはみじん切りにし、ミニトマトは4等分に切る。玉ねぎはみじん切りにし、ミニトマトは4等分に切る。玉ねぎはみじん切りにし、ミニトマトは4等分に切る。玉ねぎはみじん切りにし、ミニトマトは4等分に切る。',
  },
};
