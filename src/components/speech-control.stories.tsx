import type { Meta, StoryObj } from '@storybook/nextjs';
import { action } from 'storybook/actions';

import { SpeechControl } from './speech-control';

const meta: Meta<typeof SpeechControl> = {
  title: 'Components/SpeechControl',
  component: SpeechControl,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isRecording: {
      control: 'boolean',
      description: '音声認識が録音中かどうかの状態',
    },
    isProcessing: {
      control: 'boolean',
      description: '音声認識が処理中かどうかの状態',
    },
    status: {
      control: 'select',
      options: ['idle', 'listening', 'processing', 'success', 'error'],
      description: '音声認識の現在の状態',
    },
    statusMessage: {
      control: 'text',
      description: '状態に応じて表示されるメッセージ',
    },
    onStartRecording: {
      action: 'recording started',
      description: '録音開始ボタンクリック時のコールバック',
    },
    onStopRecording: {
      action: 'recording stopped',
      description: '録音停止ボタンクリック時のコールバック',
    },
  },
  args: {
    onStartRecording: action('start recording clicked'),
    onStopRecording: action('stop recording clicked'),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isRecording: false,
    isProcessing: false,
    status: 'idle',
    statusMessage: '',
  },
  parameters: {
    docs: {
      description: {
        story:
          'デフォルトの状態（アイドル）。録音開始ボタンが有効で、停止ボタンが無効になっています。',
      },
    },
  },
};

export const Idle: Story = {
  args: {
    isRecording: false,
    isProcessing: false,
    status: 'idle',
    statusMessage: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'アイドル状態。録音が開始されていない初期状態です。',
      },
    },
  },
};

export const Listening: Story = {
  args: {
    isRecording: true,
    isProcessing: false,
    status: 'listening',
    statusMessage: '音声を聞き取っています...',
  },
  parameters: {
    docs: {
      description: {
        story:
          '音声認識中の状態。録音中アニメーションとマイクアイコンが表示されます。',
      },
    },
  },
};

export const Processing: Story = {
  args: {
    isRecording: false,
    isProcessing: true,
    status: 'processing',
    statusMessage: '音声を処理しています...',
  },
  parameters: {
    docs: {
      description: {
        story:
          '音声処理中の状態。スピナーアニメーションが表示され、両方のボタンが無効になります。',
      },
    },
  },
};

export const Success: Story = {
  args: {
    isRecording: false,
    isProcessing: false,
    status: 'success',
    statusMessage: '音声認識に成功しました',
  },
  parameters: {
    docs: {
      description: {
        story:
          '音声認識成功の状態。成功アイコンと緑色のテキストが表示されます。',
      },
    },
  },
};

export const Error: Story = {
  args: {
    isRecording: false,
    isProcessing: false,
    status: 'error',
    statusMessage: '音声認識に失敗しました',
  },
  parameters: {
    docs: {
      description: {
        story:
          '音声認識エラーの状態。エラーアイコンと赤色のテキストが表示されます。',
      },
    },
  },
};

export const LongStatusMessage: Story = {
  args: {
    isRecording: false,
    isProcessing: false,
    status: 'error',
    statusMessage:
      'ネットワークエラーが発生しました。インターネット接続を確認して、もう一度お試しください。',
  },
  parameters: {
    docs: {
      description: {
        story:
          '長いステータスメッセージの表示例。テキストの折り返しや表示の確認に使用します。',
      },
    },
  },
};

export const InteractiveDemo: Story = {
  args: {
    isRecording: false,
    isProcessing: false,
    status: 'idle',
    statusMessage: '',
  },
  parameters: {
    docs: {
      description: {
        story:
          'インタラクティブなデモ。ボタンクリックで状態遷移をシミュレートできます。',
      },
    },
  },
  render: function InteractiveSpeechControl(args) {
    const [isRecording, setIsRecording] = React.useState(args.isRecording);
    const [isProcessing, setIsProcessing] = React.useState(args.isProcessing);
    const [status, setStatus] = React.useState<
      'idle' | 'listening' | 'processing' | 'success' | 'error'
    >(args.status);
    const [statusMessage, setStatusMessage] = React.useState(
      args.statusMessage
    );

    const handleStartRecording = () => {
      setIsRecording(true);
      setIsProcessing(false);
      setStatus('listening');
      setStatusMessage('音声を聞き取っています...');
      action('start recording clicked')();
    };

    const handleStopRecording = () => {
      setIsRecording(false);
      setIsProcessing(true);
      setStatus('processing');
      setStatusMessage('音声を処理しています...');
      action('stop recording clicked')();

      // 2秒後に成功状態に遷移
      setTimeout(() => {
        setIsProcessing(false);
        setStatus('success');
        setStatusMessage('音声認識が完了しました');
      }, 2000);

      // さらに3秒後にアイドル状態に戻る
      setTimeout(() => {
        setStatus('idle');
        setStatusMessage('');
      }, 5000);
    };

    return (
      <SpeechControl
        isRecording={isRecording}
        isProcessing={isProcessing}
        status={status}
        statusMessage={statusMessage}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
      />
    );
  },
};

// React import for InteractiveDemo
import React from 'react';
