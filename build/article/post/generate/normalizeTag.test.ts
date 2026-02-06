import { describe, expect, it } from 'vitest';
import type { Post } from '@/types/source';
import { buildTagNormalizationMap, normalizeTags } from './normalizeTag';

describe('buildTagNormalizationMap', () => {
  it('最も出現回数が多い表記を正規化結果とすること', () => {
    const posts: Partial<Post>[] = [
      { tags: ['TypeScript', 'react'] },
      { tags: ['typescript', 'React'] },
      { tags: ['TypeScript', 'React'] },
    ];

    const map = buildTagNormalizationMap(posts);

    expect(map.get('typescript')).toBe('TypeScript');
    expect(map.get('react')).toBe('React');
  });

  it('tags が未定義の記事をスキップすること', () => {
    const posts: Partial<Post>[] = [{ title: 'no tags' }, { tags: ['css'] }];

    const map = buildTagNormalizationMap(posts);

    expect(map.size).toBe(1);
    expect(map.get('css')).toBe('css');
  });

  it('空配列の場合、空の Map を返すこと', () => {
    const map = buildTagNormalizationMap([]);

    expect(map.size).toBe(0);
  });
});

describe('normalizeTags', () => {
  it('正規化マップに基づいてタグを変換すること', () => {
    const normMap = new Map([
      ['typescript', 'TypeScript'],
      ['react', 'React'],
    ]);

    const result = normalizeTags(['typescript', 'REACT', 'unknown'], normMap);

    expect(result).toEqual(['TypeScript', 'React', 'unknown']);
  });

  it('マップに存在しないタグはそのまま返すこと', () => {
    const normMap = new Map<string, string>();

    const result = normalizeTags(['Vue', 'Svelte'], normMap);

    expect(result).toEqual(['Vue', 'Svelte']);
  });
});
