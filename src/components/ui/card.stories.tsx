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

export const WithImage: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>画像付きカード</CardTitle>
        <CardDescription>画像を含むカードの例です。</CardDescription>
      </CardHeader>
      <CardContent>
        <img
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop"
          alt="美味しい料理"
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <p>美味しそうな料理の写真と説明文を組み合わせたカードです。</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">詳細を見る</Button>
        <Button>お気に入り</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithMultipleActions: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>複数アクション</CardTitle>
        <CardDescription>複数のボタンを持つカードです。</CardDescription>
      </CardHeader>
      <CardContent>
        <p>このカードには複数のアクションボタンがあります。</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline">キャンセル</Button>
        <Button variant="secondary">下書き保存</Button>
        <Button>公開</Button>
      </CardFooter>
    </Card>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>長いコンテンツ</CardTitle>
        <CardDescription>長いテキストを含むカードの例です。</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          これは長いコンテンツを含むカードの例です。Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua.
        </p>
        <p className="mb-4">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
      </CardContent>
      <CardFooter>
        <Button>続きを読む</Button>
      </CardFooter>
    </Card>
  ),
};

export const Minimal: Story = {
  render: () => (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold">ミニマルカード</h3>
          <p className="text-sm text-gray-600 mt-2">必要最小限の情報のみ</p>
        </div>
      </CardContent>
    </Card>
  ),
};

export const WithList: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>リスト表示</CardTitle>
        <CardDescription>
          リスト形式でデータを表示するカードです。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span>項目1</span>
            <span className="font-medium">値1</span>
          </li>
          <li className="flex justify-between">
            <span>項目2</span>
            <span className="font-medium">値2</span>
          </li>
          <li className="flex justify-between">
            <span>項目3</span>
            <span className="font-medium">値3</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full">全て表示</Button>
      </CardFooter>
    </Card>
  ),
};
