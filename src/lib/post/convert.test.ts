import { describe, expect, it } from 'vitest';
import { convertRawPost } from './convert';
import type { RawPost } from './raw';

const baseRaw: RawPost = {
  slug: 'hello',
  content: 'hello body',
  title: 'Hello',
  date: '2025-01-01T00:00:00.000Z',
  tags: ['intro'],
};

describe('convertRawPost', () => {
  it('markdown 本文を HTML に変換し前後の空白を除去する', async () => {
    const markdownToHtml = async (md: string) => `<p>${md}</p>\n`;
    const post = await convertRawPost(baseRaw, { markdownToHtml });
    expect(post.content).toBe('<p>hello body</p>');
  });

  it('updated が指定されている場合のみ Post に含める', async () => {
    const markdownToHtml = async () => '';
    const withUpdated = { ...baseRaw, updated: '2025-02-01T00:00:00.000Z' };
    const post = await convertRawPost(withUpdated, { markdownToHtml });
    expect(post.updated).toBe('2025-02-01T00:00:00.000Z');
  });

  it('updated が未指定の場合 Post に含まれない', async () => {
    const markdownToHtml = async () => '';
    const post = await convertRawPost(baseRaw, { markdownToHtml });
    expect(post.updated).toBeUndefined();
  });

  it('note が指定されている場合 simple モードで変換する', async () => {
    const calls: { md: string; isSimple: boolean | undefined }[] = [];
    const markdownToHtml = async (md: string, isSimple?: boolean) => {
      calls.push({ md, isSimple });
      return md;
    };
    const withNote = { ...baseRaw, note: 'note body' };
    const post = await convertRawPost(withNote, { markdownToHtml });
    expect(post.note).toBe('note body');
    expect(calls).toContainEqual({ md: 'note body', isSimple: true });
  });

  it('slug, title, date, tags, noindex を Post にコピーする', async () => {
    const markdownToHtml = async () => '';
    const raw: RawPost = { ...baseRaw, noindex: true };
    const post = await convertRawPost(raw, { markdownToHtml });
    expect(post.slug).toBe(baseRaw.slug);
    expect(post.title).toBe(baseRaw.title);
    expect(post.date).toBe(baseRaw.date);
    expect(post.tags).toBe(baseRaw.tags);
    expect(post.noindex).toBe(true);
  });
});
