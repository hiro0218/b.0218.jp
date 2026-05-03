import { describe, expect, it } from 'vitest';
import { SITE_URL } from '@/constants';
import { tagPath, tagPermalink } from './navigation';

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
