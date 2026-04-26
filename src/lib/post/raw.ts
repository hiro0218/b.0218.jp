import matter from 'gray-matter';

/**
 * gray-matter で markdown を parse した直後の frontmatter 形状。
 * `date` と `updated` は YAML 表記によって ISO 文字列または Date のどちらにもなり得る。
 */
export type RawPostFrontmatter = {
  title: string;
  date: string | Date;
  updated?: string | Date;
  note?: string;
  tags?: string[];
  noindex?: boolean;
};

/**
 * markdown -> Post 変換に渡す中間表現。
 * 検証済みの frontmatter に slug を割り当て、日付を ISO 文字列に正規化したもの。
 * `content` は markdown 本文（HTML 変換前）。
 */
export type RawPost = {
  slug: string;
  content: string;
  title: string;
  date: string;
  updated?: string;
  note?: string;
  tags: string[];
  noindex?: boolean;
};

/** markdown ソースを frontmatter（未検証）と本文に分離する。 */
export function parseFrontmatter(source: string): { frontmatter: unknown; markdown: string } {
  const result = matter(source);
  return { frontmatter: result.data, markdown: result.content };
}

function parseDate(value: unknown): Date | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'string' && value.trim()) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/**
 * 不正な値や parse 不能な文字列を undefined に落として ISO 8601 文字列に正規化する。
 * `Page.date` のように常に ISO を期待する箇所と、`updated` のように壊れていても
 * 記事を落としたくない箇所の双方で利用する。
 */
export function tryToIso(value: unknown): string | undefined {
  return parseDate(value)?.toISOString();
}

/**
 * 型ガード: 必須の title と date が妥当であることを保証する。
 * オプショナルなフィールド（updated/note/tags/noindex）は実行時の形を問わず
 * 受け入れ、orchestrator 側で防御的に coerce する。これにより quirky な YAML
 * で記事が silently に dist から落ちることを避ける。
 */
export function isValidFrontmatter(value: unknown): value is RawPostFrontmatter {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  if (typeof v.title !== 'string' || !v.title.trim()) return false;
  if (parseDate(v.date) === null) return false;
  return true;
}
