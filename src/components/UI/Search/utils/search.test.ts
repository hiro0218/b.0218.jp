import { describe, expect, test } from 'vitest';
import type { SearchProps } from '../types';
import {
  executeSearch,
  getMatchTypePriority,
  getTagMatchType,
  getTextMatchType,
  getTitleMatchType,
  isMultiTermMatching,
  isTextMatching,
  type MatchType,
  removeSpaces,
  searchPosts,
  splitIntoWords,
  toLower,
} from './search';

// テスト用のモックデータ
const mockPosts: SearchProps[] = [
  {
    title: '[GitHub Actions] `actions/ai-inference`を利用したPR自動要約の実装',
    tags: ['GitHub Actions', 'AI'],
    slug: '202504281417',
  },
  {
    title: 'JavaScriptを利用したブラウザのプライベートモード判定についての考察',
    tags: ['JavaScript', 'ブラウザ', '調査'],
    slug: '202504122020',
  },
  {
    title: '[Google Fonts] 日本語フォントの読み込みを高速化する実装方法',
    tags: ['TypeScript', 'React', 'CSS', 'フォント'],
    slug: '202504061452',
  },
  {
    title: '[GitHub Copilot] 「ずんだもん」の人格を与える技術',
    tags: ['GitHub Copilot', 'VS Code'],
    slug: '202503210941',
  },
  {
    title: '[TypeScript] オプショナルの`?`と`| undefined`の違い',
    tags: ['TypeScript'],
    slug: '202502242115',
  },
  {
    title: '[命名規則] コンポーネント名は動詞から始めない',
    tags: ['React', '設計'],
    slug: '202502122306',
  },
  {
    title: '[JavaScript] 分割代入された引数の名称変更とデフォルト値を同時に指定する方法',
    tags: ['React', 'JavaScript', 'TypeScript'],
    slug: '202502090230',
  },
  {
    title: '[JavaScript] テンプレートリテラルと文字列連結のパフォーマンス比較',
    tags: ['JavaScript'],
    slug: '202502071045',
  },
  {
    title: '[CSS in JS] 最新のCSSプロパティにVS Codeのシンタックスハイライトを対応させる方法',
    tags: ['CSS in JS', 'Emotion', 'TypeScript', 'VS Code'],
    slug: '202501200200',
  },
  {
    title: 'Shift_JISファイルをgrepする方法',
    tags: ['Bash'],
    slug: '202412281606',
  },
];

describe('基本ユーティリティ関数', () => {
  test('toLower - 文字列を小文字に変換する', () => {
    expect(toLower('React')).toBe('react');
    expect(toLower('JAVASCRIPT')).toBe('javascript');
    expect(toLower('TypeScript')).toBe('typescript');
    expect(toLower('')).toBe('');
  });

  test('removeSpaces - 文字列からスペースを除去する', () => {
    expect(removeSpaces('React 入門')).toBe('React入門');
    expect(removeSpaces('Type Script')).toBe('TypeScript');
    expect(removeSpaces('Next  js')).toBe('Nextjs');
    expect(removeSpaces('')).toBe('');
  });

  test('splitIntoWords - 文字列を単語に分割する', () => {
    expect(splitIntoWords('React 入門')).toEqual(['react', '入門']);
    expect(splitIntoWords('JavaScript TypeScript')).toEqual(['javascript', 'typescript']);
    expect(splitIntoWords('  Next  js  ')).toEqual(['next', 'js']);
    expect(splitIntoWords('')).toEqual([]);
  });

  test('getMatchTypePriority - マッチタイプの優先度をスコアに変換する', () => {
    expect(getMatchTypePriority('EXACT')).toBe(100);
    expect(getMatchTypePriority('PARTIAL')).toBe(80);
    expect(getMatchTypePriority('EXACT_NO_SPACE')).toBe(60);
    expect(getMatchTypePriority('MULTI_TERM_MATCH')).toBe(50);
    expect(getMatchTypePriority('PARTIAL_NO_SPACE')).toBe(40);
    expect(getMatchTypePriority('NONE')).toBe(0);
    expect(getMatchTypePriority('UNKNOWN' as MatchType)).toBe(0);
  });
});

describe('一致判定ロジック', () => {
  test('getTextMatchType - 完全一致の判定', () => {
    expect(getTextMatchType('React', 'React')).toBe('EXACT');
    expect(getTextMatchType('react', 'REACT')).toBe('EXACT');
    expect(getTextMatchType('React', 'React ')).not.toBe('EXACT');
  });

  test('getTextMatchType - 部分一致の判定', () => {
    expect(getTextMatchType('React入門', 'React')).toBe('PARTIAL');
    expect(getTextMatchType('JavaScript入門', 'Script')).toBe('PARTIAL');
    expect(getTextMatchType('React', 'Angular')).toBe('NONE');
  });

  test('getTextMatchType - スペース除去後の完全一致判定', () => {
    expect(getTextMatchType('React入門', 'React 入門')).toBe('EXACT_NO_SPACE');
    expect(getTextMatchType('TypeScript', 'Type Script')).toBe('EXACT_NO_SPACE');
  });

  test('getTextMatchType - スペース除去後の部分一致判定', () => {
    expect(getTextMatchType('ReactとTypeScript', 'Re act')).toBe('PARTIAL_NO_SPACE');
    expect(getTextMatchType('JavaScript入門', 'Java Script')).toBe('PARTIAL_NO_SPACE');
  });

  test('getTextMatchType - 空文字列や不一致の場合', () => {
    expect(getTextMatchType('', 'React')).toBe('NONE');
    expect(getTextMatchType('React', '')).toBe('NONE');
    expect(getTextMatchType('', '')).toBe('NONE');
    expect(getTextMatchType('Vue', 'Angular')).toBe('NONE');
  });

  test('isTextMatching - テキストが検索クエリに一致するか判定する', () => {
    expect(isTextMatching('React入門', 'React')).toBe(true);
    expect(isTextMatching('React', 'React')).toBe(true);
    expect(isTextMatching('React入門', 'React 入門')).toBe(true);
    expect(isTextMatching('React', 'Vue')).toBe(false);
  });
});

describe('タグとタイトルの検索', () => {
  test('getTagMatchType - タグに基づいて検索を実行し、一致タイプを返す', () => {
    const post = mockPosts[0];

    expect(getTagMatchType(post, 'GitHub Actions')).toBe('EXACT');
    expect(getTagMatchType(post, 'GitHub')).toBe('PARTIAL');
    expect(getTagMatchType(post, 'JavaScript')).toBe('NONE');

    // タグが空の場合
    expect(getTagMatchType({ ...post, tags: [] }, 'GitHub Actions')).toBe('NONE');
    expect(getTagMatchType({ ...post, tags: undefined }, 'GitHub Actions')).toBe('NONE');
  });

  test('getTitleMatchType - タイトルに基づいて検索を実行し、一致タイプを返す', () => {
    expect(getTitleMatchType(mockPosts[0], 'GitHub Actions')).toBe('PARTIAL');
    expect(getTitleMatchType(mockPosts[1], 'JavaScript')).toBe('PARTIAL');
    expect(getTitleMatchType(mockPosts[2], 'Google Fonts')).toBe('PARTIAL');
    expect(getTitleMatchType(mockPosts[0], 'Vue')).toBe('NONE');
  });

  test('isMultiTermMatching - 複数の検索語をAND条件で検索し、一致するかを判定する', () => {
    expect(isMultiTermMatching(mockPosts[0], ['GitHub Actions', 'PR'])).toBe(true);
    expect(isMultiTermMatching(mockPosts[1], ['JavaScript', 'ブラウザ'])).toBe(true);
    expect(isMultiTermMatching(mockPosts[0], ['GitHub Actions', 'JavaScript'])).toBe(false);
  });
});

describe('検索ロジック', () => {
  test('searchPosts - 検索クエリが空の場合は空の配列を返す', () => {
    expect(searchPosts(mockPosts, '')).toEqual([]);
  });

  test('searchPosts - 単一キーワードでの検索', () => {
    const results = searchPosts(mockPosts, 'GitHub Actions');

    // 少なくとも1つの結果が含まれるべき（mockPostsに"GitHub Actions"が含まれる）
    expect(results.length).toBe(1);

    // 最初の結果は完全一致のものであるべき
    expect(results[0].matchType).toBe('EXACT');
    expect(results[0].post.tags?.includes('GitHub Actions')).toBe(true);
  });

  test('searchPosts - 複数キーワードの検索（AND条件）', () => {
    const results = searchPosts(mockPosts, 'JavaScript TypeScript');

    // JavaScriptとTypeScriptの両方を含む投稿
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.post.slug === '202502090230')).toBe(true);
  });

  test('executeSearch - 優先度順にソートされた結果を返す', () => {
    const results = executeSearch(mockPosts, 'React');

    // 結果はpost.titleのプロパティを持つオブジェクトの配列であるべき
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('title');
    expect(results[0]).toHaveProperty('tags');
    expect(results[0]).toHaveProperty('slug');
  });

  test('executeSearch - 検索クエリが空の場合は空の配列を返す', () => {
    expect(executeSearch(mockPosts, '')).toEqual([]);
  });
});

describe('エッジケース', () => {
  test('特殊文字を含む検索', () => {
    // 特殊文字を含むmockPostを追加
    const postsWithSpecialChars = [
      ...mockPosts,
      {
        title: 'C++プログラミング',
        tags: ['C++', 'プログラミング'],
        slug: '202303191231',
      },
      {
        title: 'CSS3とHTML5',
        tags: ['CSS3', 'HTML5', 'Web'],
        slug: '202403220115',
      },
    ];

    const results = executeSearch(postsWithSpecialChars, 'C++');
    expect(results.length).toBe(1);
    expect(results[0].slug).toBe('202303191231');

    const cssResults = executeSearch(postsWithSpecialChars, 'CSS3');
    expect(cssResults.length).toBe(1);
    expect(cssResults[0].slug).toBe('202403220115');
  });

  test('大文字小文字を区別せずに検索', () => {
    const results = executeSearch(mockPosts, 'javascript');
    expect(results.length).toBeGreaterThan(0);

    // 大文字小文字を区別せず、"JavaScript"タグがある投稿が含まれるべき
    expect(results.some((post) => post.tags?.includes('JavaScript'))).toBe(true);
  });

  test('タグが存在しない投稿の検索', () => {
    const postsWithNoTags = [
      ...mockPosts,
      {
        title: 'タグなし記事',
        tags: [], // 空の配列を追加して型を一致させる
        slug: 'no-tags',
      },
    ];

    // タグがなくてもタイトルで検索できる
    const results = executeSearch(postsWithNoTags, 'タグなし');
    expect(results.length).toBe(1);
    expect(results[0].slug).toBe('no-tags');
  });
});

describe('特定ワードでの検索', () => {
  test('「GitHub Copilot」の検索が正しく機能する', () => {
    // GitHub Copilotに関連する記事が含まれる
    const results = executeSearch(mockPosts, 'GitHub Copilot');

    // 少なくとも1つの結果が含まれるべき
    expect(results.length).toBeGreaterThan(0);

    // 結果には「GitHub Copilot」タグを含む投稿が含まれるべき
    expect(results.some((post) => post.tags?.includes('GitHub Copilot'))).toBe(true);

    // 特定の投稿が含まれているか確認
    const expectedPost = results.find((post) => post.slug === '202503210941');
    expect(expectedPost).toBeDefined();
    expect(expectedPost?.title).toContain('ずんだもん');
  });

  test('「GitHub Copilot」の部分一致検索（「Copilot」）も機能する', () => {
    const results = executeSearch(mockPosts, 'Copilot');

    // 少なくとも1つの結果が含まれるべき
    expect(results.length).toBeGreaterThan(0);

    // 結果には「GitHub Copilot」タグを含む投稿が含まれるべき
    expect(results.some((post) => post.tags?.includes('GitHub Copilot'))).toBe(true);
  });

  test('大文字小文字を区別せず「github copilot」も検索できる', () => {
    const results = executeSearch(mockPosts, 'github copilot');

    // 少なくとも1つの結果が含まれるべき
    expect(results.length).toBeGreaterThan(0);

    // 結果には「GitHub Copilot」タグを含む投稿が含まれるべき
    expect(results.some((post) => post.tags?.includes('GitHub Copilot'))).toBe(true);
  });
});
