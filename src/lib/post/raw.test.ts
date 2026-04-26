import { describe, expect, it } from 'vitest';
import { isValidFrontmatter, parseFrontmatter } from './raw';

describe('parseFrontmatter', () => {
  it('YAML frontmatter とマークダウン本文を分離する', () => {
    const source = `---\ntitle: Hello\ndate: '2025-01-01'\n---\n\nbody text\n`;
    const result = parseFrontmatter(source);
    expect(result.markdown.trim()).toBe('body text');
    expect((result.frontmatter as { title: string }).title).toBe('Hello');
  });

  it('frontmatter なしの入力は空オブジェクトと本文を返す', () => {
    const result = parseFrontmatter('just body');
    expect(result.frontmatter).toEqual({});
    expect(result.markdown).toBe('just body');
  });
});

describe('isValidFrontmatter', () => {
  it('必須フィールドがすべて揃っている場合 true を返す', () => {
    expect(isValidFrontmatter({ title: 'x', date: '2025-01-01' })).toBe(true);
  });

  it('Date 型の date を受け付ける', () => {
    expect(isValidFrontmatter({ title: 'x', date: new Date() })).toBe(true);
  });

  it('title が空白のみの場合 false を返す', () => {
    expect(isValidFrontmatter({ title: '   ', date: '2025-01-01' })).toBe(false);
  });

  it('title が欠けている場合 false を返す', () => {
    expect(isValidFrontmatter({ date: '2025-01-01' })).toBe(false);
  });

  it('date が欠けている場合 false を返す', () => {
    expect(isValidFrontmatter({ title: 'x' })).toBe(false);
  });

  it('null は false を返す', () => {
    expect(isValidFrontmatter(null)).toBe(false);
  });

  it('note が文字列以外の場合 false を返す', () => {
    expect(isValidFrontmatter({ title: 'x', date: '2025-01-01', note: 123 })).toBe(false);
  });

  it('tags が配列以外の場合 false を返す', () => {
    expect(isValidFrontmatter({ title: 'x', date: '2025-01-01', tags: 'react' })).toBe(false);
  });

  it('noindex が boolean 以外の場合 false を返す', () => {
    expect(isValidFrontmatter({ title: 'x', date: '2025-01-01', noindex: 'true' })).toBe(false);
  });

  it('オプショナルフィールドが省略されていれば true を返す', () => {
    expect(isValidFrontmatter({ title: 'x', date: '2025-01-01' })).toBe(true);
  });
});
