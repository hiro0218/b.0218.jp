import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { createLazyLoader } from './lazyLoader';

type SampleItem = { id: string; name: string };

const isSampleItem = (value: unknown): value is SampleItem => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.id === 'string' && typeof obj.name === 'string';
};

describe('createLazyLoader', () => {
  let baseDir: string;

  beforeEach(() => {
    baseDir = mkdtempSync(path.join(os.tmpdir(), 'lazy-loader-'));
  });

  afterEach(() => {
    rmSync(baseDir, { recursive: true, force: true });
  });

  test('正常な JSON ファイルの場合、検証済みの値を返す', () => {
    writeFileSync(path.join(baseDir, 'a.json'), JSON.stringify({ id: 'a', name: 'Alpha' }));
    const loader = createLazyLoader({ baseDir, validate: isSampleItem, label: 'sample' });

    expect(loader.load('a.json')).toEqual({ id: 'a', name: 'Alpha' });
  });

  test('存在しないファイルの場合、null を返す', () => {
    const loader = createLazyLoader({ baseDir, validate: isSampleItem, label: 'sample' });

    expect(loader.load('missing.json')).toBeNull();
  });

  test('検証失敗の場合、label と filename を含むエラーで throw する', () => {
    writeFileSync(path.join(baseDir, 'bad.json'), JSON.stringify({ wrong: 'shape' }));
    const loader = createLazyLoader({ baseDir, validate: isSampleItem, label: 'sample' });

    expect(() => loader.load('bad.json')).toThrow('[source/sample] Invalid data in bad.json');
  });

  test('同じファイルを 2 回読んだ場合、同一参照を返す', () => {
    writeFileSync(path.join(baseDir, 'a.json'), JSON.stringify({ id: 'a', name: 'Alpha' }));
    const loader = createLazyLoader({ baseDir, validate: isSampleItem, label: 'sample' });

    const first = loader.load('a.json');
    const second = loader.load('a.json');

    expect(first).toBe(second);
  });

  test('不在ファイルもキャッシュされ、後から作成しても null のまま返る', () => {
    const loader = createLazyLoader({ baseDir, validate: isSampleItem, label: 'sample' });

    loader.load('missing.json');
    writeFileSync(path.join(baseDir, 'missing.json'), JSON.stringify({ id: 'm', name: 'M' }));

    expect(loader.load('missing.json')).toBeNull();
  });

  test('一度成功した検証はキャッシュヒット時に再実行されない', () => {
    writeFileSync(path.join(baseDir, 'a.json'), JSON.stringify({ id: 'a', name: 'Alpha' }));
    let validateCallCount = 0;
    const validate = (value: unknown): value is SampleItem => {
      validateCallCount++;
      return isSampleItem(value);
    };
    const loader = createLazyLoader({ baseDir, validate, label: 'sample' });

    loader.load('a.json');
    loader.load('a.json');
    loader.load('a.json');

    expect(validateCallCount).toBe(1);
  });

  test('ENOTDIR の場合、そのまま throw する', () => {
    // baseDir 直下に通常ファイル "sub" を作ると、その配下を読みに行ったときに ENOTDIR になる
    writeFileSync(path.join(baseDir, 'sub'), 'not a directory');
    const loader = createLazyLoader({ baseDir, validate: isSampleItem, label: 'sample' });

    expect(() => loader.load(path.join('sub', 'file.json'))).toThrow();
  });

  test('baseDir 外を指す相対パスの場合、path traversal として throw する', () => {
    const loader = createLazyLoader({ baseDir, validate: isSampleItem, label: 'sample' });

    expect(() => loader.load('../escape.json')).toThrow('[source/sample] Filename escapes baseDir');
  });

  test('絶対パスの filename の場合、path traversal として throw する', () => {
    const loader = createLazyLoader({ baseDir, validate: isSampleItem, label: 'sample' });

    expect(() => loader.load('/etc/passwd')).toThrow('[source/sample] Filename escapes baseDir');
  });
});
