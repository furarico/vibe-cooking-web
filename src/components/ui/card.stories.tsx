import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from './button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
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
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>カード タイトル</CardTitle>
        <CardDescription>カードの説明文です。</CardDescription>
      </CardHeader>
      <CardContent>
        <p>カードのコンテンツ部分です。ここに主要な情報を表示します。</p>
      </CardContent>
      <CardFooter>
        <Button>アクション</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithoutDescription: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>カード タイトル</CardTitle>
      </CardHeader>
      <CardContent>
        <p>説明文のないカードです。</p>
      </CardContent>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card>
      <CardContent className="pt-6">
        <p>ヘッダーとフッターのないシンプルなカードです。</p>
      </CardContent>
    </Card>
  ),
};
