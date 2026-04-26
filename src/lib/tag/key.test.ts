import { describe, expect, it } from 'vitest';
import { tagKey, tagsEqual } from './key';

describe('tagKey', () => {
  it('表示名を小文字化して返す', () => {
    expect(tagKey('TypeScript')).toBe('typescript');
  });

  it('既に小文字の名前はそのまま返す', () => {
    expect(tagKey('react')).toBe('react');
  });

  it('空文字列は空文字列を返す', () => {
    expect(tagKey('')).toBe('');
  });

  it('日本語の名前は変化しない', () => {
    expect(tagKey('日本語')).toBe('日本語');
  });
});

describe('tagsEqual', () => {
  it('表記が異なっても正規化キーが一致すれば true を返す', () => {
    expect(tagsEqual('TypeScript', 'typescript')).toBe(true);
  });

  it('正規化キーが異なる場合 false を返す', () => {
    expect(tagsEqual('react', 'vue')).toBe(false);
  });

  it('空文字列同士は true を返す', () => {
    expect(tagsEqual('', '')).toBe(true);
  });
});
