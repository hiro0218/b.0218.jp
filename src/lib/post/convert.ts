import type { Post } from '@/types/source';
import type { RawPost } from './raw';

export type ConvertRawPostDeps = {
  /**
   * Post 本文用の Markdown 変換。
   */
  markdownToPostHtml: (markdown: string) => Promise<string>;
  /**
   * note 用の簡易 Markdown 変換。
   */
  markdownToNoteHtml: (markdown: string) => Promise<string>;
};

/** 注入された markdown コンバータを使って RawPost から Post を構築する。 */
export async function convertRawPost(raw: RawPost, deps: ConvertRawPostDeps): Promise<Post> {
  const [content, noteContent] = await Promise.all([
    deps.markdownToPostHtml(raw.content).then((html) => html.trim()),
    raw.note ? deps.markdownToNoteHtml(raw.note) : Promise.resolve(''),
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
