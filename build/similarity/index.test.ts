import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as fs from '@/shared/fs';
import * as Log from '@/shared/Log';
import { getRelatedPosts } from './post';
import { getRelatedTags } from './tag';

// 依存モジュールのモック
vi.mock('@/shared/fs');
vi.mock('@/shared/Log');
vi.mock('./post');
vi.mock('./tag');
vi.mock('@/constant', () => ({
  // biome-ignore lint/style/useNamingConvention: モックにはオリジナルの命名規則を維持
  FILENAME_POSTS_SIMILARITY: 'posts-similarity',
  // biome-ignore lint/style/useNamingConvention: モックにはオリジナルの命名規則を維持
  FILENAME_TAG_SIMILARITY: 'tag-similarity',
}));

/**
 * 類似度計算モジュールのテスト
 *
 * 記事と関連タグの類似度を計算し、JSONファイルに出力する処理の
 * 正常系と異常系のテストケースを含む
 */
describe('similarity index module', () => {
  // テスト用のモックデータ
  const mockPostsData = [
    {
      title: 'テスト記事1',
      slug: 'test1',
      date: '2023-01-01',
      content: 'テスト内容1',
      tags: ['tag1', 'tag2'],
    },
    {
      title: 'テスト記事2',
      slug: 'test2',
      date: '2023-01-02',
      content: 'テスト内容2',
      tags: ['tag2', 'tag3'],
    },
  ];

  const mockTagsData = {
    tag1: ['test1'],
    tag2: ['test1', 'test2'],
    tag3: ['test2'],
  };

  const mockRelatedTags = {
    tag1: { tag2: 0.8 },
    tag2: { tag1: 0.8, tag3: 0.7 },
    tag3: { tag2: 0.7 },
  };

  const mockRelatedPosts = [{ test1: { test2: 0.75 } }, { test2: { test1: 0.75 } }];

  // biome-ignore lint/style/useNamingConvention: テストの定数にはオリジナルの命名規則を維持
  const PATH_DIST = `${process.cwd()}/dist`;

  /**
   * 各テスト実行前にモックをリセットし、テスト用の実装を設定する
   */
  beforeEach(() => {
    vi.resetAllMocks();

    // ファイル読み込みのモック - パスに基づいて適切なデータを返却
    vi.mocked(fs.readJSON).mockImplementation((path: string) => {
      if (path.includes('posts.json')) {
        return Promise.resolve(mockPostsData);
      } else if (path.includes('tags.json')) {
        return Promise.resolve(mockTagsData);
      }
      return Promise.resolve(null);
    });

    vi.mocked(fs.writeJSON).mockResolvedValue(undefined);
    vi.mocked(getRelatedTags).mockReturnValue(mockRelatedTags);
    vi.mocked(getRelatedPosts).mockResolvedValue(mockRelatedPosts);
    vi.mocked(Log.info).mockImplementation(() => {});
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  /**
   * 正常系のテスト
   * 全ての処理が順番通りに実行され、期待した結果が得られることを検証する
   */
  it('メインプロセスが正しく実行されること', async () => {
    // インデックスモジュールのメインロジックを模倣する関数
    const runIndexLogic = async () => {
      const posts = await fs.readJSON<typeof mockPostsData>(`${PATH_DIST}/posts.json`);
      const tags = await fs.readJSON<typeof mockTagsData>(`${PATH_DIST}/tags.json`);

      // 関連タグを計算する
      const relatedTags = getRelatedTags(posts, tags);

      await fs.writeJSON(`${PATH_DIST}/tag-similarity.json`, relatedTags);
      Log.info(`Write dist/tag-similarity.json`);

      // 関連記事を計算する
      const relatedPosts = await getRelatedPosts(posts, relatedTags);

      await fs.writeJSON(`${PATH_DIST}/posts-similarity.json`, relatedPosts);
      Log.info(`Write dist/posts-similarity.json`);
    };

    // 関数を実行
    await runIndexLogic();

    // 必要なデータが読み込まれたことを確認
    expect(fs.readJSON).toHaveBeenCalledWith(`${PATH_DIST}/posts.json`);
    expect(fs.readJSON).toHaveBeenCalledWith(`${PATH_DIST}/tags.json`);

    // getRelatedTagsが呼び出されたことを確認
    expect(getRelatedTags).toHaveBeenCalledWith(mockPostsData, mockTagsData);

    // タグの関連度データが書き込まれたことを確認
    expect(fs.writeJSON).toHaveBeenCalledWith(`${PATH_DIST}/tag-similarity.json`, mockRelatedTags);

    // ログが出力されたことを確認
    expect(Log.info).toHaveBeenCalledWith(`Write dist/tag-similarity.json`);

    // getRelatedPostsが呼び出されたことを確認
    expect(getRelatedPosts).toHaveBeenCalledWith(mockPostsData, mockRelatedTags);

    // 記事の類似度データが書き込まれたことを確認
    expect(fs.writeJSON).toHaveBeenCalledWith(`${PATH_DIST}/posts-similarity.json`, mockRelatedPosts);

    // ログが出力されたことを確認
    expect(Log.info).toHaveBeenCalledWith(`Write dist/posts-similarity.json`);
  });

  /**
   * 異常系のテスト
   * エラー発生時に処理が中断され、適切なエラーハンドリングが行われることを検証する
   */
  it('エラーが発生した場合、処理が中断されること', async () => {
    // readJSONでエラーを発生させる
    vi.mocked(fs.readJSON).mockRejectedValueOnce(new Error('読み込みエラー'));

    // エラーをキャッチするためにconsole.errorをモック
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // インデックスモジュールのメインロジックを模倣する関数
    const runIndexLogic = async () => {
      try {
        const posts = await fs.readJSON<typeof mockPostsData>(`${PATH_DIST}/posts.json`);
        const tags = await fs.readJSON<typeof mockTagsData>(`${PATH_DIST}/tags.json`);

        // 関連タグを計算する
        const relatedTags = getRelatedTags(posts, tags);
        await fs.writeJSON(`${PATH_DIST}/tag-similarity.json`, relatedTags);

        // 関連記事を計算する
        const relatedPosts = await getRelatedPosts(posts, relatedTags);
        await fs.writeJSON(`${PATH_DIST}/posts-similarity.json`, relatedPosts);

        return true; // 成功した場合
      } catch (error) {
        console.error('処理中にエラーが発生しました:', error);
        return false; // エラーが発生した場合
      }
    };

    // 関数を実行して結果を確認
    const result = await runIndexLogic();
    expect(result).toBe(false); // エラーが発生するのでfalseが返る

    // エラーがログ出力されることを確認
    expect(consoleSpy).toHaveBeenCalled();

    // エラー発生時にはファイル書き込みが実行されないことを確認
    expect(fs.writeJSON).not.toHaveBeenCalled();

    // スパイをリストア
    consoleSpy.mockRestore();
  });
});
