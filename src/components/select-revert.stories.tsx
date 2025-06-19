import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { SelectRevert } from './select-revert';

const meta: Meta<typeof SelectRevert> = {
  title: 'Components/SelectRevert',
  component: SelectRevert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '選択を取り消すためのボタンコンポーネント。ゴミ箱アイコンを表示し、削除や取り消し操作に使用します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      description: 'クリック時のコールバック関数',
      control: { type: 'function' },
    },
    disabled: {
      description: 'ボタンの無効状態',
      control: { type: 'boolean' },
    },
    className: {
      description: 'カスタムCSSクラス名',
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClick: action('clicked'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'デフォルトの選択取り消しボタン。赤いゴミ箱アイコンが表示されます。',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    onClick: action('clicked'),
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '無効化された状態のボタン。クリックできず、視覚的に無効であることを示します。',
      },
    },
  },
};

export const WithCustomClass: Story = {
  args: {
    onClick: action('clicked'),
    className: 'border border-red-200 rounded-md',
  },
  parameters: {
    docs: {
      description: {
        story: 'カスタムクラスを適用したボタン。境界線と角丸を追加した例です。',
      },
    },
  },
};

export const LargerSize: Story = {
  args: {
    onClick: action('clicked'),
    className: 'p-3',
  },
  parameters: {
    docs: {
      description: {
        story:
          'より大きなサイズのボタン。重要な削除操作に使用する場合に適用します。',
      },
    },
  },
};

export const SmallerSize: Story = {
  args: {
    onClick: action('clicked'),
    className: 'p-1',
  },
  parameters: {
    docs: {
      description: {
        story:
          'より小さなサイズのボタン。コンパクトなレイアウトで使用する場合に適用します。',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    onClick: action('revert-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'インタラクティブなデモ。ボタンをクリックするとActionsパネルでイベントを確認できます。',
      },
    },
  },
};

export const InItemList: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'アイテムリストでの使用例。各アイテムに削除ボタンが配置された場合の表示です。',
      },
    },
  },
  render: () => (
    <div className="space-y-2 w-80">
      {['アイテム1', 'アイテム2', 'アイテム3'].map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 border rounded-lg"
        >
          <span className="font-medium">{item}</span>
          <SelectRevert onClick={action(`delete-${item}`)} />
        </div>
      ))}
    </div>
  ),
};

export const InCard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'カードコンポーネント内での使用例。カードの右上に配置された削除ボタンの表示です。',
      },
    },
  },
  render: () => (
    <div className="relative p-6 border rounded-lg bg-white shadow-sm max-w-sm">
      <div className="absolute top-2 right-2">
        <SelectRevert onClick={action('delete-card')} />
      </div>
      <h3 className="text-lg font-semibold mb-2">カードタイトル</h3>
      <p className="text-gray-600 text-sm">
        これはカードの説明文です。右上の削除ボタンでこのカードを削除できます。
      </p>
    </div>
  ),
};

export const WithConfirmation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '確認ダイアログと組み合わせた使用例。削除前に確認を求める実装パターンです。',
      },
    },
  },
  render: function ConfirmationDemo() {
    const handleDelete = () => {
      if (window.confirm('本当に削除しますか？')) {
        action('confirmed-delete')();
      } else {
        action('cancelled-delete')();
      }
    };

    return (
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <span className="font-medium">重要なアイテム</span>
          <SelectRevert onClick={handleDelete} />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          削除ボタンをクリックすると確認ダイアログが表示されます
        </p>
      </div>
    );
  },
};

export const MultipleStates: Story = {
  parameters: {
    docs: {
      description: {
        story: '複数の状態を比較表示。有効・無効状態を並べて確認できます。',
      },
    },
  },
  render: () => (
    <div className="flex gap-4 items-center">
      <div className="text-center">
        <SelectRevert onClick={action('enabled-clicked')} />
        <p className="text-xs text-gray-500 mt-1">有効</p>
      </div>
      <div className="text-center">
        <SelectRevert onClick={action('disabled-clicked')} disabled />
        <p className="text-xs text-gray-500 mt-1">無効</p>
      </div>
      <div className="text-center">
        <SelectRevert
          onClick={action('custom-clicked')}
          className="border border-red-200"
        />
        <p className="text-xs text-gray-500 mt-1">カスタム</p>
      </div>
    </div>
  ),
};

export const InTable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'テーブル内での使用例。各行に削除ボタンが配置された場合の表示です。',
      },
    },
  },
  render: () => (
    <table className="w-full border-collapse border border-gray-200">
      <thead>
        <tr className="bg-gray-50">
          <th className="border border-gray-200 px-4 py-2 text-left">名前</th>
          <th className="border border-gray-200 px-4 py-2 text-left">種類</th>
          <th className="border border-gray-200 px-4 py-2 text-center">削除</th>
        </tr>
      </thead>
      <tbody>
        {[
          { name: 'レシピA', type: 'メイン' },
          { name: 'レシピB', type: 'デザート' },
          { name: 'レシピC', type: 'おかず' },
        ].map((item, index) => (
          <tr key={index}>
            <td className="border border-gray-200 px-4 py-2">{item.name}</td>
            <td className="border border-gray-200 px-4 py-2">{item.type}</td>
            <td className="border border-gray-200 px-4 py-2 text-center">
              <SelectRevert onClick={action(`delete-${item.name}`)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};
