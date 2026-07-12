import { describe, expect, it } from 'vitest';
import { SITE_URL } from '@/constants';
import { tagFeedPath, tagFeedPermalink, tagPath, tagPermalink } from './navigation';

describe('tagPath', () => {
  it('ASCII の表示名からタグページのパスを作る', () => {
    expect(tagPath('typescript')).toBe('/tags/typescript');
  });

  it('スペースを含む表示名を URL エンコードしてパスを作る', () => {
    expect(tagPath('Web Components')).toBe('/tags/Web%20Components');
  });

  it('日本語の表示名を URL エンコードしてパスを作る', () => {
    expect(tagPath('日本語')).toBe('/tags/%E6%97%A5%E6%9C%AC%E8%AA%9E');
  });
});

describe('tagPermalink', () => {
  it('タグページの絶対 URL を作る', () => {
    expect(tagPermalink('C++')).toBe(`${SITE_URL}/tags/C%2B%2B`);
  });
});

describe('tagFeedPath', () => {
  it('タグ RSS のパスを作る', () => {
    expect(tagFeedPath('名探偵コナン')).toBe('/tags/%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3/feed.xml');
  });
});

describe('tagFeedPermalink', () => {
  it('タグ RSS の絶対 URL を作る', () => {
    expect(tagFeedPermalink('C++')).toBe(`${SITE_URL}/tags/C%2B%2B/feed.xml`);
  });
});
