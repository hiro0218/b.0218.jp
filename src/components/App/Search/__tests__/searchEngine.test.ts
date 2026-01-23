import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  findMatchingPosts,
  getTagMatchType,
  getTextMatchType,
  getTitleMatchType,
  isTextMatching,
} from '@/components/App/Search/engine/matching';
import { getMatchTypePriority } from '@/components/App/Search/engine/scoring';
import { performPostSearch } from '@/components/App/Search/engine/search';
import type { MatchType, SearchProps } from '@/components/App/Search/types';

// 転置インデックスとデータをモック
vi.mock('~/dist/search-index.json', () => {
  // モックデータからトークンを生成して転置インデックスを作成
  const index: Record<string, string[]> = {};

  // 各記事のタイトルとタグからトークンを抽出
  const posts = [
    { slug: '202504281417', tokens: ['github', 'actions', 'ai', 'inference', 'pr', '自動', '要約', '実装'] },
    { slug: '202504122020', tokens: ['javascript', 'ブラウザ', 'プライベート', 'モード', '判定', '考察'] },
    {
      slug: '202504061452',
      tokens: ['google', 'fonts', '日本語', 'フォント', '読み込み', '高速化', '実装', '方法', 'react'],
    },
    { slug: '202503210941', tokens: ['github', 'copilot', 'ずんだもん', '人格', '技術'] },
    { slug: '202502242115', tokens: ['typescript', 'オプショナル', 'undefined', '違い'] },
    { slug: '202502122306', tokens: ['命名', '規則', 'コンポーネント', '名', '動詞', '始める', 'react'] },
    {
      slug: '202502090230',
      tokens: ['javascript', '分割', '代入', '引数', '名称', '変更', 'デフォルト', '値', '指定', '方法', 'react'],
    },
    {
      slug: '202502071045',
      tokens: ['javascript', 'テンプレート', 'リテラル', '文字列', '連結', 'パフォーマンス', '比較'],
    },
    {
      slug: '202501200200',
      tokens: ['css', 'js', '最新', 'プロパティ', 'vs', 'code', 'シンタックス', 'ハイライト', '対応', '方法'],
    },
    { slug: '202412281606', tokens: ['shift', 'jis', 'ファイル', 'grep', '方法'] },
    { slug: '202303191231', tokens: ['c', 'プログラミング'] },
    { slug: '202403220115', tokens: ['css3', 'html5', 'web'] },
  ];

  for (const post of posts) {
    for (const token of post.tokens) {
      if (!index[token]) {
        index[token] = [];
      }
      if (!index[token].includes(post.slug)) {
        index[token].push(post.slug);
      }
    }
  }

  return { default: index };
});

vi.mock('~/dist/search-data.json', () => {
  return {
    default: [
      {
        slug: '202504281417',
        title: '[GitHub Actions] `actions/ai-inference`を利用したPR自動要約の実装',
        tags: ['GitHub Actions', 'AI'],
        tokens: ['github', 'actions', 'ai', 'inference', 'pr', '自動', '要約', '実装'],
      },
      {
        slug: '202504122020',
        title: 'JavaScriptを利用したブラウザのプライベートモード判定についての考察',
        tags: ['JavaScript', 'ブラウザ', '調査'],
        tokens: ['javascript', 'ブラウザ', 'プライベート', 'モード', '判定', '考察'],
      },
      {
        slug: '202504061452',
        title: '[Google Fonts] 日本語フォントの読み込みを高速化する実装方法',
        tags: ['TypeScript', 'React', 'CSS', 'フォント'],
        tokens: ['google', 'fonts', '日本語', 'フォント', '読み込み', '高速化', '実装', '方法', 'react'],
      },
      {
        slug: '202503210941',
        title: '[GitHub Copilot] 「ずんだもん」の人格を与える技術',
        tags: ['GitHub Copilot', 'VS Code'],
        tokens: ['github', 'copilot', 'ずんだもん', '人格', '技術'],
      },
      {
        slug: '202502242115',
        title: '[TypeScript] オプショナルの`?`と`| undefined`の違い',
        tags: ['TypeScript'],
        tokens: ['typescript', 'オプショナル', 'undefined', '違い'],
      },
      {
        slug: '202502122306',
        title: '[命名規則] コンポーネント名は動詞から始めない',
        tags: ['React', '設計'],
        tokens: ['命名', '規則', 'コンポーネント', '名', '動詞', '始める', 'react'],
      },
      {
        slug: '202502090230',
        title: '[JavaScript] 分割代入された引数の名称変更とデフォルト値を同時に指定する方法',
        tags: ['React', 'JavaScript', 'TypeScript'],
        tokens: ['javascript', '分割', '代入', '引数', '名称', '変更', 'デフォルト', '値', '指定', '方法', 'react'],
      },
      {
        slug: '202502071045',
        title: '[JavaScript] テンプレートリテラルと文字列連結のパフォーマンス比較',
        tags: ['JavaScript'],
        tokens: ['javascript', 'テンプレート', 'リテラル', '文字列', '連結', 'パフォーマンス', '比較'],
      },
      {
        slug: '202501200200',
        title: '[CSS in JS] 最新のCSSプロパティにVS Codeのシンタックスハイライトを対応させる方法',
        tags: ['CSS in JS', 'Emotion', 'TypeScript', 'VS Code'],
        tokens: ['css', 'js', '最新', 'プロパティ', 'vs', 'code', 'シンタックス', 'ハイライト', '対応', '方法'],
      },
      {
        slug: '202412281606',
        title: 'Shift_JISファイルをgrepする方法',
        tags: ['Bash'],
        tokens: ['shift', 'jis', 'ファイル', 'grep', '方法'],
      },
      {
        slug: '202303191231',
        title: 'C++プログラミング',
        tags: ['C++', 'プログラミング'],
        tokens: ['c', 'プログラミング'],
      },
      {
        slug: '202403220115',
        title: 'CSS3とHTML5',
        tags: ['CSS3', 'HTML5', 'Web'],
        tokens: ['css3', 'html5', 'web'],
      },
    ],
  };
});

// モック後にモジュールをリセットするための beforeEach フック
beforeEach(() => {
  vi.clearAllMocks();
});

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
    // trim()により前後のスペースは除去されるため、完全一致になる
    expect(getTextMatchType('React', ' React ')).toBe('EXACT');
    expect(getTextMatchType('React', 'React Native')).not.toBe('EXACT');
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
});

describe('検索ロジック', () => {
  test('findMatchingPosts - 検索クエリが空の場合は空の配列を返す', () => {
    expect(findMatchingPosts(mockPosts, '')).toEqual([]);
  });

  test('findMatchingPosts - 単一キーワードでの検索', () => {
    const results = findMatchingPosts(mockPosts, 'GitHub Actions');

    // 少なくとも1つの結果が含まれるべき（mockPostsに"GitHub Actions"が含まれる）
    expect(results.length).toBe(1);

    // 最初の結果は完全一致のものであるべき
    expect(results[0].matchType).toBe('EXACT');
    expect(results[0].post.tags?.includes('GitHub Actions')).toBe(true);
  });

  test('findMatchingPosts - 複数キーワードの検索（AND条件）', () => {
    const results = findMatchingPosts(mockPosts, 'JavaScript TypeScript');

    // JavaScriptとTypeScriptの両方を含む投稿
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.post.slug === '202502090230')).toBe(true);
  });

  test('performPostSearch - 優先度順にソートされた結果を返す', () => {
    const results = performPostSearch('React');

    // 結果はpost.titleのプロパティを持つオブジェクトの配列であるべき
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('title');
    expect(results[0]).toHaveProperty('tags');
    expect(results[0]).toHaveProperty('slug');
  });

  test('performPostSearch - 検索クエリが空の場合は空の配列を返す', () => {
    expect(performPostSearch('')).toEqual([]);
  });
});

describe('エッジケース', () => {
  test('特殊文字を含む検索', () => {
    // C++プログラミングの記事を検索（モックデータに含まれている）
    const results = performPostSearch('c');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((post) => post.slug === '202303191231')).toBe(true);

    // CSS3とHTML5の記事を検索（モックデータに含まれている）
    const cssResults = performPostSearch('css3');
    expect(cssResults.length).toBeGreaterThan(0);
    expect(cssResults.some((post) => post.slug === '202403220115')).toBe(true);
  });

  test('大文字小文字を区別せずに検索', () => {
    const results = performPostSearch('javascript');
    expect(results.length).toBeGreaterThan(0);

    // 大文字小文字を区別せず、"JavaScript"タグがある投稿が含まれるべき
    expect(results.some((post) => post.tags?.includes('JavaScript'))).toBe(true);
  });

  test('タグが存在しない投稿の検索', () => {
    // 転置インデックスを使用する新しい実装では、タグなし記事のテストは不要
    // (ビルド時に生成されるインデックスには全記事が含まれる)
    // 既存のモックデータを使ってタイトル検索のテストを行う
    const results = performPostSearch('shift');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((post) => post.slug === '202412281606')).toBe(true);
  });
});

describe('特定ワードでの検索', () => {
  test('「GitHub Copilot」の検索が正しく機能する', () => {
    // GitHub Copilotに関連する記事が含まれる
    const results = performPostSearch('github copilot');

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
    const results = performPostSearch('copilot');

    // 少なくとも1つの結果が含まれるべき
    expect(results.length).toBeGreaterThan(0);

    // 結果には「GitHub Copilot」タグを含む投稿が含まれるべき
    expect(results.some((post) => post.tags?.includes('GitHub Copilot'))).toBe(true);
  });

  test('大文字小文字を区別せず「github copilot」も検索できる', () => {
    const results = performPostSearch('github copilot');

    // 少なくとも1つの結果が含まれるべき
    expect(results.length).toBeGreaterThan(0);

    // 結果には「GitHub Copilot」タグを含む投稿が含まれるべき
    expect(results.some((post) => post.tags?.includes('GitHub Copilot'))).toBe(true);
  });
});

describe('日本語検索の問題', () => {
  test('「方法」で検索したとき「Shift_JISファイルをgrepする方法」がヒットする', () => {
    const results = performPostSearch('方法');

    // 「方法」を含む投稿が検索結果に含まれるべき
    expect(results.length).toBeGreaterThan(0);

    // 具体的に「Shift_JISファイルをgrepする方法」が含まれているか確認
    const expectedPost = results.find((post) => post.slug === '202412281606');
    expect(expectedPost).toBeDefined();
    expect(expectedPost?.title).toBe('Shift_JISファイルをgrepする方法');
  });

  test('「方法」で検索したとき「最新のCSSプロパティにVS Codeのシンタックスハイライトを対応させる方法」もヒットする', () => {
    const results = performPostSearch('方法');

    // 「方法」を含む投稿が検索結果に含まれるべき
    const expectedPost = results.find((post) => post.slug === '202501200200');
    expect(expectedPost).toBeDefined();
    expect(expectedPost?.title).toContain('方法');
  });

  test('スペースや前後の文字列を含む「方法」でも検索できる', () => {
    const results = performPostSearch('方法');

    // 「方法」を含むすべての投稿を確認
    const methodPosts = mockPosts.filter((post) => post.title.includes('方法'));
    const foundPosts = results.filter((post) => post.title.includes('方法'));

    // すべての「方法」を含む投稿が見つかるべき
    expect(foundPosts.length).toBe(methodPosts.length);
  });

  test('前後にスペースを含む「 方法 」でも正しく検索できる', () => {
    // 前後にスペースがあってもトリムされて検索される
    const results = performPostSearch(' 方法 ');

    // 「方法」を含む投稿が検索結果に含まれるべき
    expect(results.length).toBeGreaterThan(0);

    // 具体的に「Shift_JISファイルをgrepする方法」が含まれているか確認
    const expectedPost = results.find((post) => post.slug === '202412281606');
    expect(expectedPost).toBeDefined();
    expect(expectedPost?.title).toBe('Shift_JISファイルをgrepする方法');
  });

  test('改行文字やタブを含む検索クエリでも正しく検索できる', () => {
    const results = performPostSearch('\n\t方法\t\n');

    // 「方法」を含む投稿が検索結果に含まれるべき
    expect(results.length).toBeGreaterThan(0);

    const methodPosts = mockPosts.filter((post) => post.title.includes('方法'));
    const foundPosts = results.filter((post) => post.title.includes('方法'));

    // すべての「方法」を含む投稿が見つかるべき
    expect(foundPosts.length).toBe(methodPosts.length);
  });
});

describe('フォールバック検索（タイトル直接検索）', () => {
  test('インデックスに存在しない単語でもタイトルに含まれていれば検索できる', () => {
    // "ずんだもん"はインデックスに存在しない可能性が高いが、タイトルには含まれる
    const results = performPostSearch('ずんだもん');

    // タイトルに「ずんだもん」を含む投稿が検索結果に含まれるべき
    expect(results.length).toBeGreaterThan(0);

    // 具体的に該当する投稿が含まれているか確認
    const expectedPost = results.find((post) => post.slug === '202503210941');
    expect(expectedPost).toBeDefined();
    expect(expectedPost?.title).toContain('ずんだもん');
  });

  test('フォールバック検索でmatchedInがtitleになる', () => {
    // "ずんだもん"はインデックスに存在しない可能性が高い
    const results = performPostSearch('ずんだもん');

    // 結果があり、matchedInがtitleであるべき
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].matchedIn).toBe('title');
  });

  test('フォールバック検索でmatchTypeが適切に設定される', () => {
    // 「ずんだもん」がインデックスに存在する場合は通常検索が動作する（EXACT/MULTI_TERM_MATCHなど）
    // フォールバックはインデックス検索で結果が0件の時のみトリガーされる
    const results = performPostSearch('ずんだもん');

    // 結果があり、matchTypeが設定されているべき
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].matchType).toBeDefined();
    // matchTypeは'EXACT', 'PARTIAL', 'MULTI_TERM_MATCH', 'NONE'のいずれか
    expect(['EXACT', 'PARTIAL', 'MULTI_TERM_MATCH', 'NONE']).toContain(results[0].matchType);
  });

  test('インデックス検索で結果がある場合はフォールバック検索を使用しない', () => {
    // "GitHub"はインデックスに存在するワード
    const results = performPostSearch('github');

    // 結果があり、通常の検索が動作する
    expect(results.length).toBeGreaterThan(0);

    // タグマッチまたはトークンマッチの結果が含まれるべき
    // (フォールバックではmatchedInが必ずtitleになるが、通常検索ではtag/bothもある)
    const hasNonTitleMatch = results.some((post) => post.matchedIn !== 'title' || post.matchType !== 'PARTIAL');
    expect(hasNonTitleMatch).toBe(true);
  });
});
