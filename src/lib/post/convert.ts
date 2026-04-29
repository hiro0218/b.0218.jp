import type { Post } from '@/types/source';
import type { RawPost } from './raw';

export type ConvertRawPostDeps = {
  /**
   * Markdown を HTML に変換する関数。ビルド時は rehype/remark チェーンを、
   * テストでは決定的な fake を注入する。
   */
  markdownToHtml: (markdown: string, isSimple?: boolean) => Promise<string>;
};

/** 注入された markdown コンバータを使って RawPost から Post を構築する。 */
export async function convertRawPost(raw: RawPost, deps: ConvertRawPostDeps): Promise<Post> {
  const [content, noteContent] = await Promise.all([
    deps.markdownToHtml(raw.content, false).then((html) => html.trim()),
    raw.note ? deps.markdownToHtml(raw.note, true) : Promise.resolve(''),
  ]);

  return {
    title: raw.title,
    slug: raw.slug,
    date: raw.date,
    content,
    tags: raw.tags,
    noindex: raw.noindex,
    ...(raw.updated && { updated: raw.updated }),
    ...(noteContent && { note: noteContent }),
  };
}
