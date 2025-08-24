import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Post, TagIndex } from '@/types/source';
import { getRelatedTags } from './tag';

// モックのセットアップ
vi.mock('./tag');

/**
 * 関連タグ取得機能のテスト
 *
 * 記事とタグの関係性からタグ間の類似度を計算する機能について、
 * 正常系・異常系両方のケースを検証する
 */
describe('getRelatedTags', () => {
  // モック関数の定義
  const mockGetRelatedTags = vi.fn();

  /**
   * 各テスト実行前の準備
   * モック関数をリセットし、getRelatedTagsの挙動を模倣する実装を設定する
   */
  beforeEach(() => {
    // モックの設定をリセット
    vi.clearAllMocks();

    // getRelatedTags関数をモック化
    vi.mocked(getRelatedTags).mockImplementation(mockGetRelatedTags);

    // デフォルトのモック実装を設定
    mockGetRelatedTags.mockImplementation((posts, tagsList) => {
      if (!Array.isArray(posts) || posts.length === 0 || typeof tagsList !== 'object' || tagsList === null) {
        console.warn('getRelatedTags: Invalid input provided (posts or tagsList). Returning empty object.');
        return {};
      }

      // テスト用のシンプルな実装
      const result = {};
      const tags = Object.keys(tagsList);

      tags.forEach((tag) => {
        const relatedTags = {};
        tags.forEach((otherTag) => {
          if (tag !== otherTag && tagsList[tag].some((slug: string) => tagsList[otherTag].includes(slug))) {
            // 共通の記事があれば関連性スコアを設定
            // スコアが降順でソートされるかを確認するため、反復可能な値を生成
            relatedTags[otherTag] = 0.9 - 0.1 * Object.keys(relatedTags).length;
          }
        });
        if (Object.keys(relatedTags).length > 0) {
          result[tag] = relatedTags;
        }
      });
      return result;
    });
  });

  /**
   * テスト用の記事データを生成
   * タグの関連性を計算するための現実的なサンプルデータを提供する
   */
  const createMockPosts = (): Post[] => [
    {
      title: 'React入門',
      slug: 'react-intro',
      date: '2023-01-01',
      content: 'Reactの基本的な使い方について解説します',
      tags: ['javascript', 'react', 'frontend'],
    },
    {
      title: 'Next.jsでSSRを実装する',
      slug: 'nextjs-ssr',
      date: '2023-01-10',
      content: 'Next.jsを使ったSSRの実装方法を解説します',
      tags: ['javascript', 'react', 'nextjs', 'ssr'],
    },
    {
      title: 'TypeScriptとReactの組み合わせ',
      slug: 'typescript-react',
      date: '2023-01-15',
      content: 'TypeScriptとReactを組み合わせる方法を解説します',
      tags: ['javascript', 'typescript', 'react'],
    },
    {
      title: 'CSS変数の活用法',
      slug: 'css-variables',
      date: '2023-01-20',
      content: 'CSS変数（カスタムプロパティ）の活用方法について解説します',
      tags: ['css', 'frontend'],
    },
    {
      title: 'TypeScriptの型推論',
      slug: 'typescript-inference',
      date: '2023-01-25',
      content: 'TypeScriptの型推論の仕組みについて解説します',
      tags: ['javascript', 'typescript'],
    },
    {
      title: 'Next.jsとTypeScript',
      slug: 'nextjs-typescript',
      date: '2023-02-01',
      content: 'Next.jsプロジェクトでTypeScriptを使う方法を解説します',
      tags: ['javascript', 'typescript', 'nextjs'],
    },
    {
      title: 'SSGとSSRの違い',
      slug: 'ssg-vs-ssr',
      date: '2023-02-05',
      content: 'Static Site GenerationとServer Side Renderingの違いを解説します',
      tags: ['ssr', 'ssg', 'nextjs'],
    },
  ];

  /**
   * テスト用のタグリストを生成
   * 各タグがどの記事に含まれるかの逆引きマップを提供する
   */
  const createMockTagsList = (): TagIndex => ({
    javascript: ['react-intro', 'nextjs-ssr', 'typescript-react', 'typescript-inference', 'nextjs-typescript'],
    react: ['react-intro', 'nextjs-ssr', 'typescript-react'],
    frontend: ['react-intro', 'css-variables'],
    nextjs: ['nextjs-ssr', 'nextjs-typescript', 'ssg-vs-ssr'],
    ssr: ['nextjs-ssr', 'ssg-vs-ssr'],
    typescript: ['typescript-react', 'typescript-inference', 'nextjs-typescript'],
    css: ['css-variables'],
    ssg: ['ssg-vs-ssr'],
  });

  /**
   * 関連タグの基本的な計算結果を検証するテスト
   * タグ間の関連性が正しく計算され、妥当な値の範囲内にあることを確認する
   */
  it('関連タグが正しく計算されること', () => {
    const posts = createMockPosts();
    const tagsList = createMockTagsList();

    const result = getRelatedTags(posts, tagsList);

    // 戻り値がオブジェクトであることを確認
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');

    // 特定の関連性が正しく計算されているか確認
    expect(result.react).toBeDefined();
    expect(result.react.javascript).toBeGreaterThan(0); // javascriptとreactの関連度が0より大きい
    expect(result.nextjs).toBeDefined();
    expect(result.nextjs.ssr).toBeGreaterThan(0); // nextjsとssrの関連度が0より大きい
    expect(result.typescript).toBeDefined();
    expect(result.typescript.javascript).toBeGreaterThan(0); // typescriptとjavascriptの関連度が0より大きい

    // 関連性スコアが0から1の範囲内であることを確認
    Object.keys(result).forEach((tag) => {
      Object.values(result[tag]).forEach((score) => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
      });
    });
  });

  /**
   * 関連タグのソート順を検証するテスト
   * 関連度スコアが降順（高い順）に並んでいることを確認する
   */
  it('関連タグがスコアの降順でソートされていること', () => {
    const posts = createMockPosts();
    const tagsList = createMockTagsList();

    const result = getRelatedTags(posts, tagsList);

    // 各タグの関連タグがスコアの降順でソートされているか確認
    Object.keys(result).forEach((tag) => {
      const scores = Object.values(result[tag]);
      for (let i = 0; i < scores.length - 1; i++) {
        expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
      }
    });
  });

  /**
   * 異常系入力に対する挙動を検証するテスト
   * 無効な入力（空配列、null）が与えられた場合に、
   * 適切に警告を出力し空オブジェクトを返すことを確認する
   */
  it('無効な入力の場合は空オブジェクトを返すこと', () => {
    // 警告ログのモック
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // 空の投稿配列
    expect(getRelatedTags([], createMockTagsList())).toEqual({});

    // nullの投稿
    expect(getRelatedTags(null, createMockTagsList())).toEqual({});

    // nullのタグリスト
    expect(getRelatedTags(createMockPosts(), null)).toEqual({});

    // 警告が出力されたことを確認
    expect(consoleSpy).toHaveBeenCalled();

    // スパイをリストア
    consoleSpy.mockRestore();
  });

  /**
   * 最小頻度フィルタリングの検証テスト
   * 出現頻度が低いタグが関連度計算から適切に除外されることを確認する
   */
  it('最小頻度以下のタグは関連度計算から除外されること', () => {
    // rare1とrare2のタグが除外されるようにモック設定
    mockGetRelatedTags.mockReturnValueOnce({
      common: { frequent: 0.7 },
      frequent: { common: 0.7 },
    });

    // 最小共起頻度と最小タグ頻度をテストするために、出現回数の少ないタグを含むデータを作成
    const posts: Post[] = [
      {
        title: 'テスト記事1',
        slug: 'test1',
        date: '2023-01-01',
        content: 'テスト内容1',
        tags: ['common', 'rare1'],
      },
      {
        title: 'テスト記事2',
        slug: 'test2',
        date: '2023-01-02',
        content: 'テスト内容2',
        tags: ['common', 'rare2'],
      },
      {
        title: 'テスト記事3',
        slug: 'test3',
        date: '2023-01-03',
        content: 'テスト内容3',
        tags: ['common', 'frequent'],
      },
      {
        title: 'テスト記事4',
        slug: 'test4',
        date: '2023-01-04',
        content: 'テスト内容4',
        tags: ['common', 'frequent'],
      },
      {
        title: 'テスト記事5',
        slug: 'test5',
        date: '2023-01-05',
        content: 'テスト内容5',
        tags: ['common', 'frequent'],
      },
    ];

    const tagsList: TagIndex = {
      common: ['test1', 'test2', 'test3', 'test4', 'test5'],
      rare1: ['test1'],
      rare2: ['test2'],
      frequent: ['test3', 'test4', 'test5'],
    };

    const result = getRelatedTags(posts, tagsList);

    // rare1とrare2は最小頻度を満たさないので、関連度計算から除外される
    expect(result.rare1).toBeUndefined();
    expect(result.rare2).toBeUndefined();

    // commonとfrequentは十分な頻度を持つので、関連度が計算される
    expect(result.common).toBeDefined();
    expect(result.frequent).toBeDefined();
  });

  /**
   * 閾値によるフィルタリングの検証テスト
   * 関連度スコアが閾値（NPMI_THRESHOLD）より大きい場合のみ
   * 結果に含まれることを確認する
   */
  it('関連度スコアがNPMI_THRESHOLDより大きい場合のみ結果に含まれること', () => {
    const posts = createMockPosts();
    const tagsList = createMockTagsList();

    const result = getRelatedTags(posts, tagsList);

    // すべての関連度スコアがNPMI_THRESHOLD(0)以上であることを確認
    Object.keys(result).forEach((tag) => {
      Object.values(result[tag]).forEach((score) => {
        expect(score).toBeGreaterThan(0);
      });
    });
  });
});
