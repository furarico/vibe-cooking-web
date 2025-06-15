import type { Meta, StoryObj } from '@storybook/nextjs';
import { InstructionsItem } from './instructions-item';

const meta: Meta<typeof InstructionsItem> = {
  title: 'UI/InstructionStep',
  component: InstructionsItem,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof InstructionsItem>;

export const Default: Story = {
  args: {
    step: 1,
    description:
      '玉ねぎはみじん切りにし、ミニトマトは4等分に切る。レタスはひと口大にちぎり、トルティーヤチップスは粗く砕く。',
  },
};

export const MultipleSteps: Story = {
  render: () => (
    <div className="space-y-2">
      <InstructionsItem
        step={1}
        description="玉ねぎはみじん切りにし、ミニトマトは4等分に切る。"
      />
      <InstructionsItem step={2} description="レタスはひと口大にちぎる。" />
      <InstructionsItem
        step={3}
        description="トルティーヤチップスは粗く砕く。"
      />
    </div>
  ),
};
