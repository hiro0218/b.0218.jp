import { expect, test, vi } from 'vitest';
import type { Post, TagSimilarityScores } from '@/types/source';
import { getRelatedPosts } from './post';

// 記事を 16 件以上にしない。post.ts の MIN_POSTS_FOR_WORKER_TOKENIZATION 以上だと worker threads で形態素解析し、実行環境の CPU 数で経路が変わるため
function createPost(slug: string, tags: Array<string>, content: string): Post {
  return { title: '', slug, date: '2024-01-01T00:00:00.000Z', content, tags };
}

test('タグを共有する記事の場合、自分自身を除いて関連記事として返す', async () => {
  const posts = [
    createPost('baseball', ['sports'], '野球 選手 試合 勝利'),
    createPost('soccer', ['sports'], 'サッカー 選手 試合 勝利'),
    createPost('tennis', ['sports'], 'テニス 選手 試合 勝利'),
  ];

  const result = await getRelatedPosts(posts, {});

  expect(result).toEqual({
    baseball: { soccer: expect.any(Number), tennis: expect.any(Number) },
    soccer: { baseball: expect.any(Number), tennis: expect.any(Number) },
    tennis: { baseball: expect.any(Number), soccer: expect.any(Number) },
  });
});

test('タグを共有しない記事の場合、本文が同じでも関連記事に含めない', async () => {
  const posts = [
    createPost('baseball', ['sports'], '野球 選手 試合 勝利'),
    createPost('soccer', ['sports'], 'サッカー 選手 試合 勝利'),
    createPost('tennis', ['sports'], 'テニス 選手 試合 勝利'),
    createPost('baseball-copy', ['food'], '野球 選手 試合 勝利'),
  ];

  const result = await getRelatedPosts(posts, {});

  expect(Object.keys(result.baseball).sort()).toEqual(['soccer', 'tennis']);
  expect(result['baseball-copy']).toBeUndefined();
});

test('本文が近い記事と遠い記事がある場合、近い記事を先に並べて返す', async () => {
  const posts = [
    createPost('target', ['health'], '病院 予防 接種 食事 健康'),
    // close を far より先に置かない。並べ替えが無くても入力順で通ってしまうため
    createPost('far', ['health'], '食事 旅行 電車 温泉 宿泊'),
    createPost('close', ['health'], '病院 予防 接種 食事 運動'),
  ];
  const sortedTags: TagSimilarityScores = { health: { diet: 0.5 }, diet: { health: 0.5 } };

  const result = await getRelatedPosts(posts, sortedTags);

  expect(Object.keys(result.target)).toEqual(['close', 'far']);
  expect(result.target.close).toBeGreaterThan(result.target.far);
});

test('共通タグの数が異なる記事がある場合、共通タグが多い記事を先に並べて返す', async () => {
  const content = 'コンポーネント 設計 状態 管理';
  const posts = [
    createPost('target', ['react', 'typescript'], content),
    createPost('one-shared', ['react', 'css'], content),
    createPost('two-shared', ['react', 'typescript'], content),
  ];
  const sortedTags: TagSimilarityScores = {
    react: { typescript: 0.7, css: 0.4 },
    typescript: { react: 0.7 },
    css: { react: 0.4 },
  };

  const result = await getRelatedPosts(posts, sortedTags);

  expect(Object.keys(result.target)).toEqual(['two-shared', 'one-shared']);
  expect(result.target['two-shared']).toBeGreaterThan(result.target['one-shared']);
});

test('候補が 7 件ある場合、関連記事を上位 6 件に絞って返す', async () => {
  const posts = Array.from({ length: 8 }, (_, index) => createPost(`post-${index}`, ['sports'], '野球 選手 試合 勝利'));

  const result = await getRelatedPosts(posts, {});

  expect(Object.keys(result)).toHaveLength(8);
  for (const related of Object.values(result)) {
    expect(Object.keys(related)).toHaveLength(6);
  }
});

test('記事が空・記事が null・タグ類似度が null の場合、警告を出して空オブジェクトを返す', async () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const posts = [createPost('baseball', ['sports'], '野球 選手 試合 勝利')];

  expect(await getRelatedPosts([], {})).toEqual({});
  expect(await getRelatedPosts(null, {})).toEqual({});
  expect(await getRelatedPosts(posts, null)).toEqual({});
  expect(warn).toHaveBeenCalledTimes(3);

  warn.mockRestore();
});
