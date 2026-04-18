import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ArticleCard from './index';

const meta = {
  title: 'UI/ArticleCard',
  component: ArticleCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本',
  args: {
    link: '/posts/example-post',
    title: 'TypeScript 5.0 の新機能まとめ',
    date: '2024-01-15',
  },
  parameters: {
    docs: {
      description: {
        story: '最小限の必須 Props のみ指定した基本形。タイトルと日付のみ表示される。',
      },
    },
  },
};

export const WithExcerpt: Story = {
  name: '概要文付き',
  args: {
    link: '/posts/example-post',
    title: 'Next.js App Router の設計パターン',
    date: '2024-02-20',
    excerpt:
      'App Router を使った実践的な設計パターンについて解説します。Server Components と Client Components の使い分けがポイントです。',
  },
  parameters: {
    docs: {
      description: {
        story: '概要文付きで記事の内容を事前に把握できる。一覧ページでの標準的な表示形式。',
      },
    },
  },
};

export const WithTags: Story = {
  name: 'タグ付き',
  args: {
    link: '/posts/example-post',
    title: 'React 19 の新機能と移行ガイド',
    date: '2024-03-10',
    tags: ['React', 'TypeScript', 'Next.js'],
  },
  parameters: {
    docs: {
      description: {
        story: 'タグ付き。コンテナ幅 480px 以下ではタグが非表示になる。',
      },
    },
  },
};

export const WithUpdatedDate: Story = {
  name: '更新日付き',
  args: {
    link: '/posts/example-post',
    title: 'CSS Container Queries の実践ガイド',
    date: '2024-01-01',
    updated: '2024-06-15',
    excerpt: 'Container Queries を使ったレスポンシブデザインの新しいアプローチを紹介します。',
  },
  parameters: {
    docs: {
      description: {
        story: '更新日がある場合、投稿日に取り消し線が付き更新日が併記される。',
      },
    },
  },
};

export const DevelopmentCategory: Story = {
  name: '開発カテゴリ',
  args: {
    link: '/posts/example-post',
    title: 'Panda CSS でスタイリングを効率化する',
    date: '2024-04-01',
    category: 'development',
    tags: ['CSS', 'Panda CSS'],
  },
  parameters: {
    docs: {
      description: {
        story: '開発カテゴリのアイコンと背景色が表示される。',
      },
    },
  },
};

export const TechnologyCategory: Story = {
  name: 'テクノロジーカテゴリ',
  args: {
    link: '/posts/example-post',
    title: 'AI コーディングアシスタントの活用法',
    date: '2024-05-01',
    category: 'technology',
    tags: ['AI', 'Productivity'],
  },
  parameters: {
    docs: {
      description: {
        story: 'テクノロジーカテゴリのアイコンと背景色が表示される。',
      },
    },
  },
};

export const OtherCategory: Story = {
  name: 'その他カテゴリ',
  args: {
    link: '/posts/example-post',
    title: '技術ブログを書き続けるコツ',
    date: '2024-06-01',
    category: 'other',
  },
  parameters: {
    docs: {
      description: {
        story: 'その他カテゴリのアイコンと背景色が表示される。',
      },
    },
  },
};

export const FullContent: Story = {
  tags: ['!manifest'],
  name: '全属性',
  args: {
    link: '/posts/example-post',
    title: 'Storybook v10 で Next.js アプリのコンポーネントカタログを構築する完全ガイド',
    date: '2024-01-15',
    updated: '2024-07-01',
    excerpt:
      'Storybook v10 の新機能を活用して、Next.js アプリケーションのコンポーネントカタログを効率的に構築する方法を詳しく解説します。',
    tags: ['Storybook', 'Next.js', 'React', 'Testing'],
    category: 'development',
  },
  parameters: {
    docs: {
      description: {
        story: '全 Props を指定したリファレンス。レイアウトの最大構成を確認するために使用する。',
      },
    },
  },
};

export const WithTitleH2: Story = {
  name: 'h2 タイトル',
  args: {
    link: '/posts/example-post',
    title: 'TypeScript 5.0 の新機能まとめ',
    date: '2024-01-15',
    titleTagName: 'h2',
  },
  parameters: {
    docs: {
      description: {
        story: '見出しレベルを h2 に変更。一覧ページのトップレベルで使用する場合に指定する。',
      },
    },
  },
};

export const LongTitle: Story = {
  name: '長いタイトル',
  args: {
    link: '/posts/example-post',
    title:
      'TypeScript と React Server Components を組み合わせたモダンなフルスタック Web アプリケーション開発の実践的アプローチについて詳しく解説する',
    date: '2024-01-15',
    excerpt: '非常に長いタイトルのテキストオーバーフローを確認するためのストーリーです。',
  },
  parameters: {
    docs: {
      description: {
        story: '長いタイトルのテキストオーバーフロー（line-clamp）を確認するためのストーリー。',
      },
    },
  },
};

export const Narrow: Story = {
  name: '幅 300px',
  args: {
    link: '/posts/example-post',
    title: 'コンテナ幅 300px での表示確認',
    date: '2024-01-15',
    category: 'development',
    tags: ['React', 'TypeScript'],
    excerpt: 'コンテナ幅 320px 以下でカテゴリバッジが上部に移動し、480px 以下でタグが非表示になる。',
  },
  parameters: {
    docs: {
      description: {
        story: 'コンテナ幅 300px。320px 以下でカテゴリバッジが上部に移動する。',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Medium: Story = {
  name: '幅 450px',
  args: {
    link: '/posts/example-post',
    title: 'コンテナ幅 450px での表示確認',
    date: '2024-01-15',
    category: 'technology',
    tags: ['CSS', 'Container Queries'],
    excerpt: 'コンテナ幅 320px〜480px ではヘッダーは横並び、タグは非表示。',
  },
  parameters: {
    docs: {
      description: {
        story: 'コンテナ幅 450px。タグは非表示でヘッダーは横並びの中間状態。',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '450px' }}>
        <Story />
      </div>
    ),
  ],
};
