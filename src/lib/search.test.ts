import { describe, expect, it } from 'vitest';
import { normalizeSearchToken } from './search';

describe('normalizeSearchToken', () => {
  it('検索トークンを小文字化し、前後の空白を除去する', () => {
    expect(normalizeSearchToken(' React ')).toBe('react');
    expect(normalizeSearchToken(' GitHub Copilot ')).toBe('github copilot');
  });

  it('日本語トークンは空白除去のみ行う', () => {
    expect(normalizeSearchToken(' 方法 ')).toBe('方法');
  });
});
