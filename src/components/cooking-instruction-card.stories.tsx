import { CookingInstructionCard } from '@/components/cooking-instruction-card';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof CookingInstructionCard> = {
  title: 'Components/CookingInstructionCard',
  component: CookingInstructionCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    step: {
      control: { type: 'number', min: 1 },
      description: '手順番号',
    },
    title: {
      control: 'text',
      description: '手順のタイトル',
    },
    description: {
      control: 'text',
      description: '手順の詳細説明',
    },
    imageUrl: {
      control: 'text',
      description: '手順の画像URL',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CookingInstructionCard>;

export const Default: Story = {
  args: {
    step: 1,
    title: '野菜を切る',
    description: '玉ねぎを薄切りに、人参を細切りにします。',
    imageUrl: process.env.NEXT_PUBLIC_DEFAULT_IMAGE_URL,
  },
};

export const LongDescription: Story = {
  args: {
    step: 2,
    title: '炒める',
    description:
      'フライパンに油を熱し、玉ねぎを透明になるまで炒めます。その後、人参を加えてさらに3分ほど炒めてください。野菜がしんなりしたら次の工程に進みます。',
  },
};

export const HighStepNumber: Story = {
  args: {
    step: 15,
    title: '盛り付け',
    description: 'お皿に盛り付けて完成です。',
  },
};
