import type { Meta, StoryObj } from '@storybook/nextjs';
import { action } from 'storybook/actions';

import { AudioControl } from './audio-control';

const meta: Meta<typeof AudioControl> = {
  title: 'Components/AudioControl',
  component: AudioControl,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isPlaying: {
      control: 'boolean',
      description: '音声が再生中かどうかの状態',
    },
    onPlay: {
      action: 'played',
      description: '再生ボタンクリック時のコールバック',
    },
    onPause: {
      action: 'paused',
      description: '一時停止ボタンクリック時のコールバック',
    },
    onStop: {
      action: 'stopped',
      description: '停止ボタンクリック時のコールバック',
    },
  },
  args: {
    onPlay: action('play clicked'),
    onPause: action('pause clicked'),
    onStop: action('stop clicked'),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isPlaying: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'デフォルトの状態（停止中）。再生ボタンが表示されます。',
      },
    },
  },
};

export const Stopped: Story = {
  args: {
    isPlaying: false,
  },
  parameters: {
    docs: {
      description: {
        story: '停止状態の音声コントロール。再生ボタンのみが表示されます。',
      },
    },
  },
};

export const Playing: Story = {
  args: {
    isPlaying: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '再生中の音声コントロール。一時停止・停止ボタンと再生中インジケーターが表示されます。',
      },
    },
  },
};

export const InteractiveDemo: Story = {
  args: {
    isPlaying: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'インタラクティブなデモ。ボタンをクリックしてアクションログを確認できます。',
      },
    },
  },
  render: function InteractiveAudioControl(args) {
    const [isPlaying, setIsPlaying] = React.useState(args.isPlaying);

    const handlePlay = () => {
      setIsPlaying(true);
      action('play clicked')();
    };

    const handlePause = () => {
      setIsPlaying(false);
      action('pause clicked')();
    };

    const handleStop = () => {
      setIsPlaying(false);
      action('stop clicked')();
    };

    return (
      <AudioControl
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStop={handleStop}
      />
    );
  },
};

export const PlayingWithAnimation: Story = {
  args: {
    isPlaying: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '再生中のアニメーション表示。青い点が点滅するアニメーションが確認できます。',
      },
    },
  },
};

// React import for InteractiveDemo
import React from 'react';
