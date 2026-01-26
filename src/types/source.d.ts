// ========================================
// ユーティリティ型
// ========================================

/**
 * Optional型ヘルパー - 指定したプロパティをオプショナルにする
 * @template T - 対象の型
 * @template K - オプショナルにするプロパティのキー
 */
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 類似度スコアの型（0-1の範囲）
 */
type SimilarityScore = number;

// ========================================
// 基本型定義
// ========================================

/**
 * 記事の基本型
 * すべての記事系コンテンツの基底となる型
 */
export type Article = {
  /** 記事タイトル */
  title: string;
  /** URLスラッグ */
  slug: string;
  /** 公開日（ISO 8601形式: YYYY-MM-DDTHH:mm:ss.sssZ） */
  date: string;
  /** 更新日（ISO 8601形式） */
  updated?: string | undefined;
  /** 記事本文（HTML文字列） */
  content: string;
};

// ========================================
// エンティティ型定義
// ========================================

/**
 * ページ型（pages.json）
 * 固定ページやaboutページなどで使用
 */
export type Page = Article;

/**
 * 記事要約型
 * アーカイブページなどでタグ情報なしで表示する際に使用
 * contentフィールドを除外し、updatedをオプショナルにした型
 */
export type ArticleSummary = Optional<Omit<Article, 'content'>, 'updated'>;

/**
 * タグ情報を持つ型
 * 記事やコンテンツにタグを関連付ける際に使用
 */
export type WithTags = {
  /** 記事に紐づくタグの配列 */
  tags: string[];
};

/**
 * ブログ投稿固有のメタデータ型
 * 記事の基本情報に追加される投稿固有の情報
 */
export type PostMetadata = WithTags & {
  /** 記事の注釈（オプショナル） */
  note?: string;
  /** 検索エンジンのインデックスを拒否するフラグ */
  noindex?: boolean;
};

/**
 * ブログ投稿の完全型（posts.json）
 * すべての投稿記事情報を含む型
 */
export type Post = Article & PostMetadata;

/**
 * ブログ投稿の要約型（posts-list.json）
 * 一覧ページやサイドバーなどで使用する軽量な型
 * 実際のデータ形式：[{ title, slug, date, tags }, ...]
 */
export type PostSummary = ArticleSummary & WithTags;

/**
 * 閲覧履歴アイテムの型定義
 */
export type ReadingHistoryItem = Pick<Post, 'title' | 'slug' | 'date' | 'tags'> & {
  /** 閲覧日時（UNIXタイムスタンプ） */
  viewedAt: number;
};

/**
 * 閲覧履歴入力型
 * viewedAt は自動的に付与されるため、入力時は不要
 */
export type ReadingHistoryInput = Omit<ReadingHistoryItem, 'viewedAt'>;

// ========================================
// インデックス・スコア型定義
// ========================================

/**
 * タグインデックス型（tags.json）
 * キー：タグ名、値：そのタグを持つ記事のスラッグ配列
 * 実際のデータ形式：{ "タグ名": ["slug1", "slug2", ...], ... }
 */
export type TagIndex = Record<string, string[]>;

/**
 * タグ類似度スコア型（tags-similarity.json）
 * キー：タグ名、値：他のタグとの類似度スコア
 * 実際のデータ形式：{ "タグ1": { "タグ2": 0.5, ... }, ... }
 */
export type TagSimilarityScores = Record<string, Record<string, SimilarityScore>>;

/**
 * 記事類似度マトリックス型（posts-similarity.json）
 * 各要素は記事slugをキーとし、他の記事との類似度マップを値とする配列
 * 実際のデータ形式：[{ "slug1": { "slug2": 0.3, ... } }, ...]
 */
export type PostSimilarityMatrix = Record<string, Record<string, SimilarityScore>>[];

/**
 * 人気度の詳細情報
 */
export type PopularityDetail = {
  /** 合算スコア（ソート用） */
  total: number;
  /** Google Analytics ページビュー数 */
  ga: number;
  /** はてなブックマーク数 */
  hatena: number;
};

/**
 * 記事人気度スコア型（posts-popular.json）
 * キー：記事スラッグ、値：人気度詳細
 * 実際のデータ形式：{ "slug1": { total: 1234, ga: 1000, hatena: 234 }, ... }
 */
export type PostPopularityScores = Record<string, PopularityDetail>;

/**
 * タグカウント型（tags-with-count.json）
 */
export type TagCounts = {
  slug: string;
  count: number;
};
