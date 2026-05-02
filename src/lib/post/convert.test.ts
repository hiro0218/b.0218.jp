import { describe, expect, it } from 'vitest';
import { type ConvertRawPostDeps, convertRawPost } from './convert';
import type { RawPost } from './raw';

const baseRaw: RawPost = {
  slug: 'hello',
  content: 'hello body',
  title: 'Hello',
  date: '2025-01-01T00:00:00.000Z',
  tags: ['intro'],
};

const createDeps = (overrides: Partial<ConvertRawPostDeps> = {}): ConvertRawPostDeps => ({
  markdownToPostHtml: async () => '',
  markdownToNoteHtml: async () => '',
  ...overrides,
});

describe('convertRawPost', () => {
  it('markdown 本文を HTML に変換し前後の空白を除去する', async () => {
    const markdownToPostHtml = async (md: string) => `<p>${md}</p>\n`;
    const post = await convertRawPost(baseRaw, createDeps({ markdownToPostHtml }));
    expect(post.content).toBe('<p>hello body</p>');
  });

  it('updated が指定されている場合のみ Post に含める', async () => {
    const withUpdated = { ...baseRaw, updated: '2025-02-01T00:00:00.000Z' };
    const post = await convertRawPost(withUpdated, createDeps());
    expect(post.updated).toBe('2025-02-01T00:00:00.000Z');
  });

  it('updated が未指定の場合 Post に含まれない', async () => {
    const post = await convertRawPost(baseRaw, createDeps());
    expect(post.updated).toBeUndefined();
  });

  it('note が指定されている場合 note 用コンバータで変換する', async () => {
    const calls: string[] = [];
    const markdownToNoteHtml = async (md: string) => {
      calls.push(md);
      return md;
    };
    const withNote = { ...baseRaw, note: 'note body' };
    const post = await convertRawPost(withNote, createDeps({ markdownToNoteHtml }));
    expect(post.note).toBe('note body');
    expect(calls).toContain('note body');
  });

  it('slug, title, date, tags, noindex を Post にコピーする', async () => {
    const raw: RawPost = { ...baseRaw, noindex: true };
    const post = await convertRawPost(raw, createDeps());
    expect(post.slug).toBe(baseRaw.slug);
    expect(post.title).toBe(baseRaw.title);
    expect(post.date).toBe(baseRaw.date);
    expect(post.tags).toBe(baseRaw.tags);
    expect(post.noindex).toBe(true);
  });
});
