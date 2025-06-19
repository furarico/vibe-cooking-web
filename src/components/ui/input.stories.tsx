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

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: '読み取り専用のテキスト',
  },
};

export const Required: Story = {
  args: {
    required: true,
    placeholder: '必須入力フィールド',
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'デフォルト値',
    placeholder: 'プレースホルダー',
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: '検索キーワードを入力',
  },
};

export const Tel: Story = {
  args: {
    type: 'tel',
    placeholder: '電話番号を入力',
  },
};

export const Url: Story = {
  args: {
    type: 'url',
    placeholder: 'URLを入力',
  },
};

export const Date: Story = {
  args: {
    type: 'date',
  },
};

export const Time: Story = {
  args: {
    type: 'time',
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">テキスト</label>
        <Input type="text" placeholder="テキストを入力" />
      </div>
      <div>
        <label className="text-sm font-medium">パスワード</label>
        <Input type="password" placeholder="パスワードを入力" />
      </div>
      <div>
        <label className="text-sm font-medium">メール</label>
        <Input type="email" placeholder="メールアドレスを入力" />
      </div>
      <div>
        <label className="text-sm font-medium">数値</label>
        <Input type="number" placeholder="数値を入力" />
      </div>
      <div>
        <label className="text-sm font-medium">検索</label>
        <Input type="search" placeholder="検索キーワードを入力" />
      </div>
      <div>
        <label className="text-sm font-medium">日付</label>
        <Input type="date" />
      </div>
    </div>
  ),
};
