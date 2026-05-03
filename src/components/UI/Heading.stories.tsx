import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Heading } from '@/components/UI/Heading';

const meta = {
  title: 'UI/Heading',
  component: Heading,
  args: {
    children: '見出しテキスト',
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const H1: Story = {
  name: 'h1',
  args: {
    as: 'h1',
  },
  parameters: {
    docs: {
      description: {
        story: 'ページの主タイトル。1 ページに 1 つのみ使用する。',
      },
    },
  },
};

export const H2: Story = {
  name: 'h2',
  args: {
    as: 'h2',
  },
  parameters: {
    docs: {
      description: {
        story: 'ページ内の大セクション見出し。最も使用頻度が高い。',
      },
    },
  },
};

export const H3: Story = {
  name: 'h3',
  args: {
    as: 'h3',
  },
  parameters: {
    docs: {
      description: {
        story: 'H2 セクション内のサブセクション見出し。',
      },
    },
  },
};

export const H4: Story = {
  name: 'h4',
  args: {
    as: 'h4',
  },
  parameters: {
    docs: {
      description: {
        story: 'H3 セクション内のさらに細かい見出し。',
      },
    },
  },
};

export const H5: Story = {
  name: 'h5',
  args: {
    as: 'h5',
    children: '見出しレベル5',
  },
  parameters: {
    docs: {
      description: {
        story: '深いネストのセクション見出し。使用頻度は低い。',
      },
    },
  },
};

export const H6: Story = {
  name: 'h6',
  args: {
    as: 'h6',
    children: '見出しレベル6',
  },
  parameters: {
    docs: {
      description: {
        story: '最も深いネストの見出し。使用頻度は低い。',
      },
    },
  },
};

export const Bold: Story = {
  name: '太字',
  args: {
    as: 'h2',
    isBold: true,
  },
  parameters: {
    docs: {
      description: {
        story: '太字スタイルで強調した見出し。',
      },
    },
  },
};

export const WithTextSide: Story = {
  name: 'サイドテキスト',
  args: {
    as: 'h2',
    textSide: '(10)',
  },
  parameters: {
    docs: {
      description: {
        story: '見出し右側に件数などの補助テキストを表示する。',
      },
    },
  },
};

export const WithTextSub: Story = {
  name: '補足テキスト',
  args: {
    as: 'h2',
    textSub: '補足テキスト',
  },
  parameters: {
    docs: {
      description: {
        story: '見出し下部に補足説明を表示する。',
      },
    },
  },
};

export const WithTextSideAndSub: Story = {
  tags: ['!manifest'],
  name: 'サイド + 補足',
  args: {
    as: 'h2',
    textSide: '(10)',
    textSub: '補足テキスト',
  },
  parameters: {
    docs: {
      description: {
        story: 'サイドテキストと補足テキストの両方を表示する最大構成。',
      },
    },
  },
};
