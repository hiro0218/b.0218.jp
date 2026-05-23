import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';

import { ArticleCard } from '@/components/UI/ArticleCard';
import { StoryFrame, StoryGrid, StoryStack, StoryWidth } from '@/stories/_internal/StorySurface';

const POST_LINK = '/posts/example';

const DEFAULT_ARGS = {
  link: POST_LINK,
  title: '[Codex] refresh token already usedエラーの対処',
  date: '2026-04-27',
} satisfies ComponentProps<typeof ArticleCard>;

const FULL_ARGS = {
  link: POST_LINK,
  title: '[TypeScript] パフォーマンスとAI AgentのためにBarrelファイルを廃止する',
  date: '2026-05-02',
  updated: '2026-05-04',
  excerpt:
    'index.ts でまとめる Barrel ファイルは、Tree Shaking の効きにくさ・dev server の初期化連鎖・AI コード追跡コストを生む。入口の自明性を保ったまま 3 つのコストを抑える設計を組めるか。',
  tags: ['Biome', 'TypeScript', '設計'],
  category: 'development',
} satisfies ComponentProps<typeof ArticleCard>;

const EXCERPT_ARGS = {
  link: POST_LINK,
  title: '仕様駆動開発（SDD）とフロントエンドの相性',
  date: '2026-03-08',
  excerpt: '「仕様さえ渡せばAIが実装できる」という期待が高まる中、フロントエンドにこの前提はそのまま乗らない。',
} satisfies ComponentProps<typeof ArticleCard>;

const TAGS_ARGS = {
  link: POST_LINK,
  title: '[CSS] `:hover` などのネスト時の親要素参照（`&`）有無による挙動の違い',
  date: '2024-08-02',
  tags: ['CSS', 'CSS in JS', 'Sass'],
} satisfies ComponentProps<typeof ArticleCard>;

const UPDATED_ARGS = {
  link: POST_LINK,
  title: 'PrettierからOxfmtへの移行はMarkdownプロジェクトで有効か',
  date: '2026-03-31',
  updated: '2026-04-12',
  excerpt:
    'Prettier 互換を掲げる Rust 製フォーマッタ Oxfmt が Markdown プロジェクトでも同様の高速化をもたらすか検証した。',
} satisfies ComponentProps<typeof ArticleCard>;

const CATEGORY_ARGS = {
  link: POST_LINK,
  title: '[感想] Eorzean Symphony FINAL FANTASY XIV Orchestra Concert 2025',
  date: '2025-12-29',
  category: 'other',
  tags: ['イベント', 'レビュー', '雑記'],
} satisfies ComponentProps<typeof ArticleCard>;

const LONG_TITLE_ARGS = {
  link: POST_LINK,
  title:
    '確証バイアスを避けるためにAIには逆の視点でも確認する、というメタ手法を実運用に落とすときに具体的なプロンプトを残しておきたかったので書く',
  date: '2025-11-26',
  excerpt: '質問の前提と AI の応答が同じ方向に寄ることがある。反対側の立場で聞くと、その偏りを確認しやすい。',
} satisfies ComponentProps<typeof ArticleCard>;

const NARROW_ARGS = {
  link: POST_LINK,
  title: '[Git] GPG署名エラー（pinentry）の解決方法',
  date: '2026-03-15',
  category: 'development',
  tags: ['Git', 'macOS', 'GPG'],
  excerpt: 'git commit 時の GPG 署名がある時点から失敗するようになり、pinentry-curses の入力が動かなくなった。',
} satisfies ComponentProps<typeof ArticleCard>;

const MEDIUM_ARGS = {
  link: POST_LINK,
  title: '[GitHub] リアクション絵文字の意味は公式に定義されていない',
  date: '2026-02-18',
  category: 'other',
  tags: ['GitHub', '絵文字', '調査'],
  excerpt: '👍 を「賛成」、👎 を「反対」と使う場面は多いが、その意味付けは公式には存在しない。',
} satisfies ComponentProps<typeof ArticleCard>;

const REFERENCE_EXCERPT_ARGS = {
  link: POST_LINK,
  title: '仕様駆動開発（SDD）とフロントエンドの相性',
  date: '2026-03-08',
  excerpt: '仕様の品質が成果物の品質を直接左右するため、フロントエンドでは仕様の完全化が構造的に難しい。',
} satisfies ComponentProps<typeof ArticleCard>;

const REFERENCE_UPDATED_ARGS = {
  link: POST_LINK,
  title: '[CSS] `:hover` などのネスト時の親要素参照（`&`）有無による挙動の違い',
  date: '2024-08-02',
  updated: '2026-01-15',
  excerpt: '`&` の有無でセレクタの解釈が変わる。検証してどちらを採るべきか整理した。',
} satisfies ComponentProps<typeof ArticleCard>;

const meta = {
  title: 'UI/ArticleCard',
  component: ArticleCard,
  args: DEFAULT_ARGS,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <StoryWidth maxInlineSize="600px">
        <Story />
      </StoryWidth>
    ),
  ],
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * タイトルと日付だけのスキャン優先表示。古い記事の年表的な一覧で、本文プレビューを出すと密度が上がりすぎるときに選ぶ。
 *
 * @summary 最小情報、年表的な一覧向け
 */
export const Default: Story = {
  name: '基本',
};

/**
 * 概要を 1〜2 文添える形。クリックで開くか迷うところに導線を 1 つ足したい一覧で選ぶ。
 *
 * @summary 開く前に内容判断を助ける概要付き
 */
export const WithExcerpt: Story = {
  name: '概要付き',
  args: EXCERPT_ARGS,
};

/**
 * タグを併記する形。狭幅では非表示になるので、必須情報をタグに乗せない。
 *
 * @summary 補助情報としてのタグ表示
 */
export const WithTags: Story = {
  name: 'タグ付き',
  args: TAGS_ARGS,
};

/**
 * 公開日と更新日の両方を出す形。古い記事を直したときに鮮度を一覧で伝えるために選ぶ。
 *
 * @summary 公開後に内容を更新した記事
 */
export const WithUpdatedDate: Story = {
  name: '更新日付き',
  args: UPDATED_ARGS,
};

/**
 * カテゴリで左上のアイコンと色が変わる。development / technology / other を Controls で切り替えて確認できる。
 *
 * @summary 大分類アイコン付き
 */
export const WithCategory: Story = {
  name: 'カテゴリ付き',
  args: CATEGORY_ARGS,
  argTypes: {
    category: {
      control: 'select',
      options: ['development', 'technology', 'other'],
    },
  },
};

/**
 * 一覧ページ用に h2 を直に出す形。トップレベル見出しとしてカードを並べるときに必要になる。
 *
 * @summary トップレベル見出しとしての h2
 */
export const WithTitleH2: Story = {
  name: 'h2 見出し',
  args: { titleTagName: 'h2' },
};

/**
 * 全 props を埋めた最大構成。アンカーやマージンが他要素と干渉していないかを目視確認する用の標本。
 *
 * @summary 全 props 指定の最大構成
 */
export const FullContent: Story = {
  tags: ['!manifest'],
  name: '最大構成',
  args: FULL_ARGS,
};

/**
 * 連結記号なしで折り返せない長文タイトルの破綻チェック。line-clamp と word-break の組み合わせが効いている確認。
 *
 * @summary 長文タイトルの折り返しチェック
 */
export const LongTitle: Story = {
  tags: ['!manifest'],
  name: '長文タイトル',
  args: LONG_TITLE_ARGS,
};

/**
 * コンテナ 300px 以下の状態。カテゴリバッジは上段に逃げ、タグは省略される。
 *
 * @summary 狭幅レイアウト 300px
 */
export const Narrow: Story = {
  tags: ['!manifest'],
  name: '300px',
  args: NARROW_ARGS,
  decorators: [
    (Story) => (
      <StoryWidth inlineSize="300px">
        <Story />
      </StoryWidth>
    ),
  ],
};

/**
 * コンテナ 450px。ヘッダーは横並びを保ち、タグだけが落ちる中間状態。
 *
 * @summary 中間幅 450px
 */
export const Medium: Story = {
  tags: ['!manifest'],
  name: '450px',
  args: MEDIUM_ARGS,
  decorators: [
    (Story) => (
      <StoryWidth inlineSize="450px">
        <Story />
      </StoryWidth>
    ),
  ],
};

/**
 * 構成差を 1 画面で並べた標本群。どの props 組み合わせが情報密度上どこに着地するかを比較する用。
 *
 * @summary 構成差の比較標本
 */
export const VariantReference: Story = {
  tags: ['!manifest'],
  name: '構成差の比較',
  parameters: { controls: { disable: true } },
  render: () => (
    <StoryGrid minItemWidth="20rem">
      <StoryFrame caption="タイトルと日付だけ。年表的な一覧向け。" label="01 — minimal" title="最小構成">
        <ArticleCard {...DEFAULT_ARGS} />
      </StoryFrame>
      <StoryFrame caption="開く前に内容判断を助ける概要。" label="02 — excerpt" title="概要付き">
        <ArticleCard {...REFERENCE_EXCERPT_ARGS} />
      </StoryFrame>
      <StoryFrame caption="鮮度を伝える更新日表記。" label="03 — updated" title="更新日付き">
        <ArticleCard {...REFERENCE_UPDATED_ARGS} />
      </StoryFrame>
      <StoryFrame caption="大分類のアイコンと色で読み分け。" label="04 — categorized" title="カテゴリ付き">
        <ArticleCard {...CATEGORY_ARGS} />
      </StoryFrame>
    </StoryGrid>
  ),
};

/**
 * コンテナ幅の閾値ごとに、何が省略されるかを縦に並べた標本群。レスポンシブ設計時の確認用。
 *
 * @summary 幅別レスポンシブ標本
 */
export const ResponsiveReference: Story = {
  tags: ['!manifest'],
  name: '幅別レスポンシブ',
  parameters: { controls: { disable: true } },
  render: () => (
    <StoryStack>
      <StoryFrame
        caption="カテゴリバッジが上段に移動し、タグは省略される。"
        inlineSize="300px"
        label="01"
        title="狭幅 — 300px"
      >
        <ArticleCard {...FULL_ARGS} />
      </StoryFrame>
      <StoryFrame
        caption="ヘッダーは横並びを保つが、タグは省略される。"
        inlineSize="450px"
        label="02"
        title="中間 — 450px"
      >
        <ArticleCard {...FULL_ARGS} />
      </StoryFrame>
      <StoryFrame caption="カテゴリ・概要・タグまで揃う標準幅。" inlineSize="600px" label="03" title="標準 — 600px">
        <ArticleCard {...FULL_ARGS} />
      </StoryFrame>
    </StoryStack>
  ),
};
