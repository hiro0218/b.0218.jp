import { describe, expect, it } from 'vitest';
import {
  createTagArchiveMetadataModel,
  createTagArchivePageModel,
  createTagArchivePaginationStaticParams,
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
      title: 'Tag: TypeScript',
      description: 'Tag: TypeScript - 零弐壱蜂',
      canonicalUrl: 'https://b.0218.jp/tags/TypeScript',
    });
  });

  it('2ページ目以降の場合、ページ番号つきの canonical URL を返す', () => {
    expect(createTagArchiveMetadataModel({ routeSlug: 'TypeScript', tag: 'TypeScript', currentPage: 2 })).toEqual({
      title: 'Tag: TypeScript - Page 2',
      description: 'Tag: TypeScript - Page 2 - 零弐壱蜂',
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

describe('createTagArchivePageModel', () => {
  it('1ページ目の場合、先頭の記事と pagination model を返す', () => {
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
    expect(model?.pagination.previousHref).toBeNull();
    expect(model?.pagination.nextHref).toBe('/tags/TypeScript/2');
    expect(model?.pagination.items).toEqual([
      { type: 'page', page: 1, href: '/tags/TypeScript', isCurrent: true },
      { type: 'page', page: 2, href: '/tags/TypeScript/2', isCurrent: false },
    ]);
  });

  it('2ページ目の場合、該当ページの記事と前後リンクを返す', () => {
    const model = createTagArchivePageModel({
      routeSlug: 'TypeScript',
      tag: 'TypeScript',
      posts,
      currentPage: 2,
    });

    expect(model?.posts.map((post) => post.slug)).toEqual(['post-11', 'post-12']);
    expect(model?.pagination.previousHref).toBe('/tags/TypeScript');
    expect(model?.pagination.nextHref).toBeNull();
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
