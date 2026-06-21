import type { Post } from '@/types/source';

import { getBlogPostingImage, getBlogPostingStructured } from './json-ld';

const createPost = (tags: string[]): Post => ({
  slug: 'example',
  title: 'Example',
  date: '2025-01-01T00:00:00.000Z',
  content: '<p>本文</p>',
  tags,
});

describe('getBlogPostingImage', () => {
  it('development カテゴリのタグでは develop サムネイルを返す', () => {
    expect(getBlogPostingImage(createPost(['CSS']))).toBe('https://b.0218.jp/thumbnail/develop.png');
  });

  it('technology カテゴリのタグでは tech サムネイルを返す', () => {
    expect(getBlogPostingImage(createPost(['AI']))).toBe('https://b.0218.jp/thumbnail/tech.png');
  });

  it('other カテゴリのタグでは note サムネイルを返す', () => {
    expect(getBlogPostingImage(createPost(['雑記']))).toBe('https://b.0218.jp/thumbnail/note.png');
  });

  it('映画系タグでは movie サムネイルを優先する', () => {
    expect(getBlogPostingImage(createPost(['名探偵コナン']))).toBe('https://b.0218.jp/thumbnail/movie.png');
  });

  it('カテゴリを判定できない場合は etc サムネイルを返す', () => {
    expect(getBlogPostingImage(createPost(['unknown']))).toBe('https://b.0218.jp/thumbnail/etc.png');
  });
});

describe('getBlogPostingStructured', () => {
  it('schema.org image にカテゴリ別サムネイルを設定する', () => {
    expect(getBlogPostingStructured(createPost(['CSS'])).image).toEqual(['https://b.0218.jp/thumbnail/develop.png']);
  });
});
