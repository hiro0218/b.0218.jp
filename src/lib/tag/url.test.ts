import { describe, expect, it } from 'vitest';
import { tagFromUrlPath, tagUrlPath } from './url';

describe('tagUrlPath', () => {
  it('ASCII の表示名はそのまま返す', () => {
    expect(tagUrlPath('typescript')).toBe('typescript');
  });

  it('スペースを含む名前を URL エンコードする', () => {
    expect(tagUrlPath('Web Components')).toBe('Web%20Components');
  });

  it('日本語の名前を URL エンコードする', () => {
    expect(tagUrlPath('日本語')).toBe('%E6%97%A5%E6%9C%AC%E8%AA%9E');
  });
});

describe('tagFromUrlPath', () => {
  it('エンコード済みのセグメントを表示名に戻す', () => {
    expect(tagFromUrlPath('Web%20Components')).toBe('Web Components');
  });

  it('tagUrlPath の逆変換になる', () => {
    const name = 'Vue.js & Nuxt';
    expect(tagFromUrlPath(tagUrlPath(name))).toBe(name);
  });

  it('不正な % エスケープを含む入力は元の文字列をそのまま返す', () => {
    expect(tagFromUrlPath('100%')).toBe('100%');
    expect(tagFromUrlPath('%E3%')).toBe('%E3%');
  });
});
