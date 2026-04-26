import type { Post } from '@/types/source';
import type { RawPost } from './raw';

export type ConvertRawPostDeps = {
  /**
   * Markdown to HTML converter. The build pipeline supplies the rehype/remark
   * chain; tests inject a deterministic fake.
   */
  markdownToHtml: (markdown: string, isSimple?: boolean) => Promise<string>;
};

/** Materialize a Post from a RawPost using the injected markdown converter. */
export async function convertRawPost(raw: RawPost, deps: ConvertRawPostDeps): Promise<Post> {
  const content = (await deps.markdownToHtml(raw.content, false)).trim();
  const noteContent = raw.note ? await deps.markdownToHtml(raw.note, true) : '';

  const post: Post = {
    title: raw.title,
    slug: raw.slug,
    date: raw.date,
    content,
    tags: raw.tags,
    noindex: raw.noindex,
  };

  if (raw.updated) post.updated = raw.updated;
  if (noteContent) post.note = noteContent;

  return post;
}
