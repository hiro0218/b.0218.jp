import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Alert } from './index';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    html: '<p>これはアラートメッセージのデモです。重要な情報をユーザーに伝える際に使用します。</p>',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Note: Story = {
  name: 'Note',
  args: {
    type: 'note',
  },
};

export const Tip: Story = {
  name: 'Tip',
  args: {
    type: 'tip',
  },
};

export const Important: Story = {
  name: 'Important',
  args: {
    type: 'important',
  },
};

export const Warning: Story = {
  name: 'Warning',
  args: {
    type: 'warning',
  },
};

export const Caution: Story = {
  name: 'Caution',
  args: {
    type: 'caution',
  },
};

export const HiddenLabel: Story = {
  name: 'ラベル非表示',
  args: {
    type: 'note',
    hideLabel: true,
  },
};
