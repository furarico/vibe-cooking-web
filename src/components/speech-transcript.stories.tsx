import type { Meta, StoryObj } from '@storybook/nextjs';
import { action } from 'storybook/actions';

import { SpeechTranscript } from './speech-transcript';

const meta: Meta<typeof SpeechTranscript> = {
  title: 'Components/SpeechTranscript',
  component: SpeechTranscript,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    transcript: {
      control: 'text',
      description: '確定した音声認識結果のテキスト',
    },
    interimTranscript: {
      control: 'text',
      description: '認識中の暫定テキスト',
    },
    triggerHistory: {
      control: 'object',
      description: '音声操作の履歴配列',
    },
    status: {
      control: 'select',
      options: ['idle', 'listening', 'processing', 'success', 'error'],
      description: '音声認識の現在の状態',
    },
    onClearTranscript: {
      action: 'transcript cleared',
      description: 'トランスクリプトクリアボタンクリック時のコールバック',
    },
    onClearTriggerHistory: {
      action: 'trigger history cleared',
      description: 'トリガー履歴クリアボタンクリック時のコールバック',
    },
  },
  args: {
    onClearTranscript: action('clear transcript clicked'),
    onClearTriggerHistory: action('clear trigger history clicked'),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    transcript: '',
    interimTranscript: '',
    triggerHistory: [],
    status: 'idle',
  },
  parameters: {
    docs: {
      description: {
        story:
          '空の状態。全てのデータが空の場合、コンポーネントは何も表示しません（null を返す）。',
      },
    },
  },
};

export const WithTranscript: Story = {
  args: {
    transcript: '今日の夕飯は何にしようかな。パスタが食べたい気分です。',
    interimTranscript: '',
    triggerHistory: [],
    status: 'success',
  },
  parameters: {
    docs: {
      description: {
        story:
          '確定したトランスクリプトのみが表示される状態。成功状態なので緑色の背景が適用されます。',
      },
    },
  },
};

export const WithInterimTranscript: Story = {
  args: {
    transcript: '今日の夕飯は何にしようかな。',
    interimTranscript: 'パスタが食べたい',
    triggerHistory: [],
    status: 'listening',
  },
  parameters: {
    docs: {
      description: {
        story:
          '確定したテキストと認識中の暫定テキストが表示される状態。暫定テキストは青色のハイライトで表示されます。',
      },
    },
  },
};

export const ListeningStatus: Story = {
  args: {
    transcript: '',
    interimTranscript: 'こんにちは、今日は',
    triggerHistory: [],
    status: 'listening',
  },
  parameters: {
    docs: {
      description: {
        story:
          '音声認識中の状態。青色の背景が適用され、暫定テキストが表示されます。',
      },
    },
  },
};

export const ProcessingStatus: Story = {
  args: {
    transcript: '音声を処理中です',
    interimTranscript: '',
    triggerHistory: [],
    status: 'processing',
  },
  parameters: {
    docs: {
      description: {
        story: '音声処理中の状態。黄色の背景が適用されます。',
      },
    },
  },
};

export const ErrorStatus: Story = {
  args: {
    transcript: '音声認識でエラーが発生しました',
    interimTranscript: '',
    triggerHistory: [],
    status: 'error',
  },
  parameters: {
    docs: {
      description: {
        story:
          'エラー状態。赤色の背景が適用されてエラー状態を視覚的に示します。',
      },
    },
  },
};

export const WithTriggerHistory: Story = {
  args: {
    transcript: '',
    interimTranscript: '',
    triggerHistory: [
      '次のステップに進む',
      '音量を上げる',
      'タイマーを5分にセット',
      '前のステップに戻る',
    ],
    status: 'idle',
  },
  parameters: {
    docs: {
      description: {
        story:
          'トリガー履歴のみが表示される状態。音声操作の履歴が最新10件まで表示されます。',
      },
    },
  },
};

export const WithBothTranscriptAndHistory: Story = {
  args: {
    transcript:
      '次の手順を教えてください。材料を炒める時間はどのくらいですか？',
    interimTranscript: '',
    triggerHistory: [
      '次のステップに進む',
      '音量を上げる',
      'タイマーを5分にセット',
      '前のステップに戻る',
      '材料リストを表示',
    ],
    status: 'success',
  },
  parameters: {
    docs: {
      description: {
        story:
          'トランスクリプトとトリガー履歴の両方が表示される状態。完全な機能を確認できます。',
      },
    },
  },
};

export const LongTranscript: Story = {
  args: {
    transcript: `今日は料理をしようと思っています。まず材料を準備して、野菜を切って、お肉を下味に漬けておきます。
それから鍋に油をひいて、野菜から炒めていきます。野菜がしんなりしたら、お肉を加えて一緒に炒めます。
最後に調味料を加えて味を整えて完成です。とても美味しそうな匂いがしてきました。
家族みんなで美味しく食べられそうです。`,
    interimTranscript: '',
    triggerHistory: [],
    status: 'success',
  },
  parameters: {
    docs: {
      description: {
        story:
          '長いトランスクリプトの表示例。テキストの折り返しや表示領域の確認に使用します。',
      },
    },
  },
};

export const ManyTriggerHistory: Story = {
  args: {
    transcript: '',
    interimTranscript: '',
    triggerHistory: [
      '次のステップに進む',
      '音量を上げる',
      'タイマーを5分にセット',
      '前のステップに戻る',
      '材料リストを表示',
      'タイマーを停止',
      '音量を下げる',
      'レシピを最初から',
      '次の材料を表示',
      'タイマーを10分にセット',
      '調理を終了',
      'ヘルプを表示',
      '前の手順を繰り返す',
      '材料の分量を確認',
      'レシピをお気に入りに追加',
    ],
    status: 'idle',
  },
  parameters: {
    docs: {
      description: {
        story:
          '多数のトリガー履歴がある場合の表示。最新10件のみが表示され、スクロール可能な領域で確認できます。',
      },
    },
  },
};

export const InteractiveDemo: Story = {
  args: {
    transcript: '今日のお昼ご飯は何にしようかな。',
    interimTranscript: '',
    triggerHistory: [
      '次のステップに進む',
      '音量を上げる',
      'タイマーを5分にセット',
    ],
    status: 'success',
  },
  parameters: {
    docs: {
      description: {
        story:
          'インタラクティブなデモ。クリアボタンをクリックしてアクションの動作を確認できます。',
      },
    },
  },
};
