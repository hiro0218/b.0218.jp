import { describe, expect, it } from 'vitest';
import {
  createTagArchiveMetadataModel,
  createTagArchivePageModel,
  createTagArchivePaginationStaticParams,
  getTagArchivePageHref,
  parseTagPageSegment,
} from './tagArchiveModel';

const posts = Array.from({ length: 12 }, (_, index) => ({
  title: `Post ${index + 1}`,
  slug: `post-${index + 1}`,
  date: '2026-01-01',
}));

describe('parseTagPageSegment', () => {
  it('2以上の整数文字列の場合、ページ番号を返す', () => {
    expect(parseTagPageSegment('2')).toBe(2);
  });

  it('1以下または整数ではない場合、null を返す', () => {
    expect(parseTagPageSegment('1')).toBeNull();
    expect(parseTagPageSegment('0')).toBeNull();
    expect(parseTagPageSegment('2.5')).toBeNull();
    expect(parseTagPageSegment('abc')).toBeNull();
  });
});

describe('createTagArchiveMetadataModel', () => {
  it('1ページ目の場合、タグの canonical URL を返す', () => {
    expect(createTagArchiveMetadataModel({ routeSlug: 'TypeScript', tag: 'TypeScript' })).toEqual({
      title: 'TypeScript',
      description: 'TypeScriptの記事一覧',
      canonicalUrl: 'https://b.0218.jp/tags/TypeScript',
    });
  });

  it('2ページ目以降の場合、ページ番号つきの canonical URL を返す', () => {
    expect(createTagArchiveMetadataModel({ routeSlug: 'TypeScript', tag: 'TypeScript', currentPage: 2 })).toEqual({
      title: 'TypeScript（2ページ目）',
      description: 'TypeScriptの記事一覧（2ページ目）',
      canonicalUrl: 'https://b.0218.jp/tags/TypeScript/2',
    });
  });
});

describe('createTagArchivePaginationStaticParams', () => {
  it('2ページ目以降がある場合、静的生成用の page params を返す', () => {
    expect(createTagArchivePaginationStaticParams('TypeScript', 12)).toEqual([{ slug: 'TypeScript', page: '2' }]);
  });

  it('1ページだけの場合、空配列を返す', () => {
    expect(createTagArchivePaginationStaticParams('TypeScript', 5)).toEqual([]);
  });
});

describe('getTagArchivePageHref', () => {
  it('1ページ目の場合、ページ番号を付けないタグページの URL を返す', () => {
    expect(getTagArchivePageHref('/tags/TypeScript', 1)).toBe('/tags/TypeScript');
  });

  it('2ページ目以降の場合、タグページの URL の後ろにページ番号を付ける', () => {
    expect(getTagArchivePageHref('/tags/TypeScript', 2)).toBe('/tags/TypeScript/2');
  });

  it('基準の URL が / で終わる場合、/ を重ねずにページ番号を付ける', () => {
    expect(getTagArchivePageHref('/tags/TypeScript/', 3)).toBe('/tags/TypeScript/3');
    expect(getTagArchivePageHref('/tags/TypeScript/', 1)).toBe('/tags/TypeScript');
  });
});

describe('createTagArchivePageModel', () => {
  it('1ページ目の場合、先頭の記事と全ページ数を返す', () => {
    const model = createTagArchivePageModel({
      routeSlug: 'TypeScript',
      tag: 'TypeScript',
      posts,
      currentPage: 1,
    });

    expect(model?.posts.map((post) => post.slug)).toEqual([
      'post-1',
      'post-2',
      'post-3',
      'post-4',
      'post-5',
      'post-6',
      'post-7',
      'post-8',
      'post-9',
      'post-10',
    ]);
    expect(model?.totalPages).toBe(2);
  });

  it('2ページ目の場合、該当ページの記事と全ページ数を返す', () => {
    const model = createTagArchivePageModel({
      routeSlug: 'TypeScript',
      tag: 'TypeScript',
      posts,
      currentPage: 2,
    });

    expect(model?.posts.map((post) => post.slug)).toEqual(['post-11', 'post-12']);
    expect(model?.totalPages).toBe(2);
  });

  it('範囲外ページの場合、null を返す', () => {
    expect(
      createTagArchivePageModel({
        routeSlug: 'TypeScript',
        tag: 'TypeScript',
        posts,
        currentPage: 3,
      }),
    ).toBeNull();
  });
});
