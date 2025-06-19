import type { Meta, StoryObj } from '@storybook/nextjs';
import { Instructions } from './instructions';

const meta: Meta<typeof Instructions> = {
  title: 'Components/Instructions',
  component: Instructions,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Instructions>;

export const Default: Story = {
  args: {
    steps: [
      {
        step: 1,
        description:
          '玉ねぎはみじん切りにし、ミニトマトは4等分に切る。レタスはひと口大にちぎり、トルティーヤチップスは粗く砕く。',
      },
    ],
  },
};

export const MultipleSteps: Story = {
  render: () => (
    <Instructions
      steps={[
        {
          step: 1,
          description: '玉ねぎはみじん切りにし、ミニトマトは4等分に切る。',
        },
        {
          step: 2,
          description:
            'レタスはひと口大にちぎり、トルティーヤチップスは粗く砕く。',
        },
      ]}
    />
  ),
};
