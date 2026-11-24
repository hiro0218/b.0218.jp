import { describe, expect, it } from 'vitest';
import { isValidFrontmatter, parseFrontmatter, tryToIso } from './raw';

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

  it('date が空文字または空白のみの場合 false を返す', () => {
    expect(isValidFrontmatter({ title: 'x', date: '' })).toBe(false);
    expect(isValidFrontmatter({ title: 'x', date: '   ' })).toBe(false);
  });

  it('date が parse 不能な文字列の場合 false を返す', () => {
    expect(isValidFrontmatter({ title: 'x', date: 'not-a-date' })).toBe(false);
  });

  it('updated が parse 不能な文字列でも記事は通過させる（orchestrator が coerce する）', () => {
    expect(isValidFrontmatter({ title: 'x', date: '2025-01-01', updated: 'not-a-date' })).toBe(true);
  });

  it('null は false を返す', () => {
    expect(isValidFrontmatter(null)).toBe(false);
  });

  it('オプショナルフィールドが quirky な値でも true を返す（オーケストレータが coerce する）', () => {
    expect(isValidFrontmatter({ title: 'x', date: '2025-01-01', tags: 'react', note: 123, noindex: 1 })).toBe(true);
  });

  it('オプショナルフィールドが省略されていれば true を返す', () => {
    expect(isValidFrontmatter({ title: 'x', date: '2025-01-01' })).toBe(true);
  });
});

describe('tryToIso', () => {
  it('Date 型の値を ISO 文字列に変換する', () => {
    expect(tryToIso(new Date('2025-01-02T03:04:05Z'))).toBe('2025-01-02T03:04:05.000Z');
  });

  it('parse 可能な文字列を ISO 文字列に変換する', () => {
    expect(tryToIso('2025-01-02')).toBe('2025-01-02T00:00:00.000Z');
  });

  it('parse 不能な文字列は undefined を返す', () => {
    expect(tryToIso('not-a-date')).toBeUndefined();
  });

  it('Invalid Date は undefined を返す', () => {
    expect(tryToIso(new Date('invalid'))).toBeUndefined();
  });

  it('undefined / null / number / 空文字は undefined を返す', () => {
    expect(tryToIso(undefined)).toBeUndefined();
    expect(tryToIso(null)).toBeUndefined();
    expect(tryToIso(123)).toBeUndefined();
    expect(tryToIso('')).toBeUndefined();
    expect(tryToIso('   ')).toBeUndefined();
  });
});
