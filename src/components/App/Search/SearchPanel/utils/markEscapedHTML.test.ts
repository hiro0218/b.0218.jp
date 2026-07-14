import { expect, test } from 'vitest';
import { createMarkedTitles } from './markEscapedHTML';

test('全角スペース区切りキーワードの場合、各語をハイライトする', () => {
  const [segments] = createMarkedTitles([{ title: 'React と TypeScript の入門' }], 'React　TypeScript');

  const markedTexts = segments.filter((segment) => segment.marked).map((segment) => segment.text);

  expect(markedTexts).toEqual(['React', 'TypeScript']);
});

test('半角スペース区切りキーワードの場合、各語をハイライトする', () => {
  const [segments] = createMarkedTitles([{ title: 'React と TypeScript の入門' }], 'React TypeScript');

  const markedTexts = segments.filter((segment) => segment.marked).map((segment) => segment.text);

  expect(markedTexts).toEqual(['React', 'TypeScript']);
});

test('キーワードが空の場合、全体を非マークの 1 セグメントで返す', () => {
  const [segments] = createMarkedTitles([{ title: 'React と TypeScript の入門' }], '');

  expect(segments).toEqual([{ text: 'React と TypeScript の入門', marked: false, start: 0 }]);
});
