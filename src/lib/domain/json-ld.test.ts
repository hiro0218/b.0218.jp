import type { ListItem } from 'schema-dts';

import type { Activities, Post } from '@/types/source';

import { getActivitiesStructured, getBlogPostingImage, getBlogPostingStructured } from './json-ld';

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

  it('author は about ページを指す @id 参照と、Google 推奨の name/url を返す', () => {
    expect(getBlogPostingStructured(createPost(['CSS'])).author).toEqual({
      '@type': 'Person',
      '@id': 'https://b.0218.jp/about',
      name: 'hiro',
      url: 'https://b.0218.jp/about',
    });
  });
});

describe('getActivitiesStructured', () => {
  const activities: Activities = {
    companies: [{ id: 'zozo', name: '株式会社ZOZO', url: 'https://corp.zozo.com/' }],
    works: [
      { type: 'slide', title: '登壇資料', url: 'https://speakerdeck.com/example', companyId: 'zozo' },
      { type: 'blog', title: '寄稿記事', url: 'https://techblog.example.com/entry', companyId: null },
      {
        type: 'event',
        title: '登壇イベント',
        url: 'https://connpass.com/event/example',
        companyId: 'zozo',
        date: '2023-11-06T19:00:00+09:00',
      },
    ],
  };

  it('event はデータが不完全なため ItemList から除外する', () => {
    const itemListElement = getActivitiesStructured(activities).itemListElement as ListItem[];
    expect(itemListElement).toHaveLength(2);
  });

  it('ItemList の position を 1 始まりの連番で振る', () => {
    const itemListElement = getActivitiesStructured(activities).itemListElement as ListItem[];
    expect(itemListElement.map((item) => item.position)).toEqual([1, 2]);
  });

  it('slide は PresentationDigitalDocument に変換し、companyId から publisher を解決する', () => {
    const itemListElement = getActivitiesStructured(activities).itemListElement as ListItem[];
    const [slideItem] = itemListElement;
    expect(slideItem.item).toEqual({
      '@type': 'PresentationDigitalDocument',
      name: '登壇資料',
      url: 'https://speakerdeck.com/example',
      author: { '@type': 'Person', '@id': 'https://b.0218.jp/about', name: 'hiro', url: 'https://b.0218.jp/about' },
      publisher: { '@type': 'Organization', name: '株式会社ZOZO', url: 'https://corp.zozo.com/' },
    });
  });

  it('blog は Article に変換し、companyId が null なら publisher を含めない', () => {
    const itemListElement = getActivitiesStructured(activities).itemListElement as ListItem[];
    const [, blogItem] = itemListElement;
    expect(blogItem.item).toEqual({
      '@type': 'Article',
      headline: '寄稿記事',
      url: 'https://techblog.example.com/entry',
      author: { '@type': 'Person', '@id': 'https://b.0218.jp/about', name: 'hiro', url: 'https://b.0218.jp/about' },
    });
  });
});
