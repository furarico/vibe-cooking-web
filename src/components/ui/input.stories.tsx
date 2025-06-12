import type { Meta, StoryObj } from '@storybook/nextjs';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="w-[350px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'テキストを入力してください',
  },
};

export const WithValue: Story = {
  args: {
    value: '入力済みのテキスト',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'パスワードを入力してください',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'メールアドレスを入力してください',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '数値を入力してください',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '無効な入力フィールド',
  },
};
