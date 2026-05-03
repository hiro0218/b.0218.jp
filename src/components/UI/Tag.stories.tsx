import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PostTag } from '@/components/UI/Tag';

const meta = {
  title: 'UI/Tag',
  component: PostTag,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PostTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本',
  args: {
    tags: [{ slug: 'TypeScript' }, { slug: 'React' }, { slug: 'Next.js' }],
  },
  parameters: {
    docs: {
      description: {
        story: 'タグ名のみのシンプルな表示。記事詳細ページのタグ一覧に使用する。',
      },
    },
  },
};

export const WithCounts: Story = {
  name: '件数付き',
  args: {
    tags: [
      { slug: 'TypeScript', count: 15 },
      { slug: 'React', count: 12 },
      { slug: 'CSS', count: 8 },
      { slug: 'Next.js', count: 5 },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '各タグに記事数を併記する。タグ一覧ページに使用する。',
      },
    },
  },
};

export const Navigable: Story = {
  name: 'リンク付き',
  args: {
    tags: [
      { slug: 'TypeScript', count: 15, isNavigable: true },
      { slug: 'React', count: 12, isNavigable: true },
      { slug: 'CSS', count: 8, isNavigable: true },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'タグページへのリンク付き。クリックでタグ別記事一覧に遷移する。',
      },
    },
  },
};

export const Mixed: Story = {
  name: '混在',
  args: {
    tags: [
      { slug: 'TypeScript', count: 15, isNavigable: true },
      { slug: 'React', isNavigable: false },
      { slug: 'CSS', count: 8, isNavigable: true },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'リンク付きとテキストのみが混在する実運用パターン。',
      },
    },
  },
};

export const Empty: Story = {
  name: '空配列',
  args: {
    tags: [],
  },
  parameters: {
    docs: {
      description: {
        story: '空配列の場合。コンポーネントは null を返す。',
      },
    },
  },
};
