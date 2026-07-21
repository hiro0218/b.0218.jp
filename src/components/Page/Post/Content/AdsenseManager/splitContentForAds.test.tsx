import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { splitContentForAds } from './splitContentForAds';

function buildHeadingContent(headingCount: number): ReactNode[] {
  // biome-ignore-start lint/suspicious/noArrayIndexKey: テスト用の固定回数生成データで、生成後に順序が変わることはない
  return Array.from({ length: headingCount }, (_, i) => [
    <h2 key={`h${i + 1}`}>見出し{i + 1}</h2>,
    <p key={`p${i + 1}`}>本文{i + 1}</p>,
  ]).flat();
  // biome-ignore-end lint/suspicious/noArrayIndexKey: テスト用の固定回数生成データで、生成後に順序が変わることはない
}

describe('splitContentForAds', () => {
  it('コンテンツが null の場合、空配列を返す', () => {
    expect(splitContentForAds(null)).toEqual([]);
  });

  it('見出しが0個の場合、分割せず1セクションを返す', () => {
    const content = [<p key="p1">本文</p>];
    expect(splitContentForAds(content)).toHaveLength(1);
  });

  it('見出しが1個の場合、分割せず1セクションを返す(末尾広告のみになる)', () => {
    expect(splitContentForAds(buildHeadingContent(1))).toHaveLength(1);
  });

  it('見出しが2個の場合、2番目の見出しの直前で1回分割する', () => {
    const sections = splitContentForAds(buildHeadingContent(2));
    expect(sections).toHaveLength(2);
    expect(sections[0]).toHaveLength(2);
    expect(sections[1]).toHaveLength(2);
  });

  it('見出しが4個の場合、本文中広告1本分(2セクション)に収める', () => {
    expect(splitContentForAds(buildHeadingContent(4))).toHaveLength(2);
  });

  it('見出しが5個以上の場合、本文中広告2本分(3セクション)に増やす', () => {
    expect(splitContentForAds(buildHeadingContent(5))).toHaveLength(3);
  });
});
