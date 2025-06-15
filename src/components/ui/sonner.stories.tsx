import type { Meta, StoryObj } from '@storybook/nextjs';
import { toast } from 'sonner';
import { Button } from './button';
import { Toaster } from './sonner';

const meta: Meta<typeof Toaster> = {
  title: 'UI/Toaster',
  component: Toaster,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div>
        <Story />
        <div className="flex flex-col gap-4 p-8">
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => toast('基本的なトースト')}>
              基本的なトースト
            </Button>
            <Button onClick={() => toast.success('成功しました！')}>
              成功トースト
            </Button>
            <Button onClick={() => toast.error('エラーが発生しました')}>
              エラートースト
            </Button>
            <Button onClick={() => toast.warning('警告メッセージ')}>
              警告トースト
            </Button>
            <Button onClick={() => toast.info('情報メッセージ')}>
              情報トースト
            </Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() =>
                toast('レシピが保存されました', {
                  description: '新しいレシピがレシピ集に追加されました',
                })
              }
            >
              説明付きトースト
            </Button>
            <Button
              onClick={() =>
                toast.success('調理完了！', {
                  description: '美味しい料理ができました',
                  action: {
                    label: '写真を撮る',
                    onClick: () => toast('写真を撮りました📸'),
                  },
                })
              }
            >
              アクション付きトースト
            </Button>
            <Button
              onClick={() =>
                toast('永続的なトースト', {
                  duration: Infinity,
                  description: 'このトーストは手動で閉じるまで表示されます',
                })
              }
            >
              永続的なトースト
            </Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() =>
                toast.loading('レシピを保存しています...', {
                  id: 'saving-recipe',
                })
              }
            >
              ローディングトースト
            </Button>
            <Button
              onClick={() =>
                toast.success('保存完了！', {
                  id: 'saving-recipe',
                })
              }
            >
              ローディング完了
            </Button>
            <Button
              onClick={() =>
                toast.promise(
                  new Promise(resolve => setTimeout(resolve, 2000)),
                  {
                    loading: 'レシピを削除しています...',
                    success: 'レシピが削除されました',
                    error: '削除に失敗しました',
                  }
                )
              }
            >
              プロミストースト
            </Button>
          </div>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithPosition: Story = {
  args: {
    position: 'top-right',
  },
};

export const WithRichColors: Story = {
  args: {
    richColors: true,
  },
};

export const WithExpand: Story = {
  args: {
    expand: true,
  },
};

export const WithCloseButton: Story = {
  args: {
    closeButton: true,
  },
};
