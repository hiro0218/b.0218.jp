import { expect, test, vi } from 'vitest';
import type { Post, TagIndex } from '@/types/source';
import { getRelatedTags } from './tag';

function createPosts(...tagSets: Array<Array<string>>): Array<Post> {
  return tagSets.map((tags, index) => ({
    title: `記事${index}`,
    slug: `post-${index}`,
    date: '2024-01-01T00:00:00.000Z',
    content: '',
    tags,
  }));
}

function createTagIndex(posts: Array<Post>): TagIndex {
  const tagIndex: TagIndex = {};

  for (const { slug, tags } of posts) {
    for (const tag of tags) {
      (tagIndex[tag] ??= []).push(slug);
    }
  }

  return tagIndex;
}

test('タグ対が共起する場合、NPMI の降順に並べた関連タグを返す', () => {
  // タグ名と記事の順を変えない。並べ替えが無いと a の関連タグが b, c の順に並ぶ組で、変えると並べ替えの検証にならないため
  const posts = createPosts(['a', 'b', 'c'], ['a', 'b', 'c'], ['a', 'c'], ['b'], ['c']);

  const result = getRelatedTags(posts, createTagIndex(posts));

  expect(Object.entries(result.a)).toEqual([
    ['c', 0.4368],
    ['b', 0.115],
  ]);
});

// calculateTagRelationsNPMI が外側のループのたびに tag1 の関連度を空で作り直すため、辞書順で小さいタグが tagsList で先に並ぶと、大きいタグ側の逆向きの関連度が消える
test.fails('タグ対が共起する場合、双方向の関連タグを返す', () => {
  const posts = createPosts(['a', 'b', 'c'], ['a', 'b', 'c'], ['a', 'c'], ['b'], ['c']);

  const result = getRelatedTags(posts, createTagIndex(posts));

  expect(result.b).toEqual({ a: 0.115 });
  expect(result.c).toEqual({ a: 0.4368 });
});

test('出現が 3 記事未満のタグの場合、共起が 2 回あっても関連タグに含めない', () => {
  const posts = createPosts(['common', 'rare'], ['common', 'rare'], ['common'], ['other']);

  const result = getRelatedTags(posts, createTagIndex(posts));

  expect(result).toEqual({});
});

test('共起が 1 回だけのタグ対の場合、各タグが 3 記事に出現しても関連タグに含めない', () => {
  // 母数を 10 件より減らさない。9 件以下だと共起 1 回でも NPMI が 0 以下になり、共起回数の足切りで落ちたのか区別できないため
  const posts = createPosts(['a', 'b'], ['a'], ['a'], ['b'], ['b'], [], [], [], [], []);

  const result = getRelatedTags(posts, createTagIndex(posts));

  expect(result).toEqual({});
});

test('NPMI が 0 以下のタグ対の場合、関連タグに含めない', () => {
  const posts = createPosts(['a', 'b'], ['a', 'b'], ['a'], ['b']);

  const result = getRelatedTags(posts, createTagIndex(posts));

  expect(result).toEqual({});
});

test('記事が空・記事が null・タグ一覧が null の場合、警告を出して空オブジェクトを返す', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const posts = createPosts(['a'], ['a'], ['a']);
  const tagIndex = createTagIndex(posts);

  expect(getRelatedTags([], tagIndex)).toEqual({});
  expect(getRelatedTags(null, tagIndex)).toEqual({});
  expect(getRelatedTags(posts, null)).toEqual({});
  expect(warn).toHaveBeenCalledTimes(3);

  warn.mockRestore();
});
