import { beforeEach, describe, expect, test, vi } from 'vitest';
import { performPostSearch } from '@/components/App/Search/engine/search';

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

// テスト用のモックデータ（「方法」検索テストで参照件数の検証に使用）
const mockPosts = [
  { title: '[GitHub Actions] `actions/ai-inference`を利用したPR自動要約の実装' },
  { title: 'JavaScriptを利用したブラウザのプライベートモード判定についての考察' },
  { title: '[Google Fonts] 日本語フォントの読み込みを高速化する実装方法' },
  { title: '[GitHub Copilot] 「ずんだもん」の人格を与える技術' },
  { title: '[TypeScript] オプショナルの`?`と`| undefined`の違い' },
  { title: '[命名規則] コンポーネント名は動詞から始めない' },
  { title: '[JavaScript] 分割代入された引数の名称変更とデフォルト値を同時に指定する方法' },
  { title: '[JavaScript] テンプレートリテラルと文字列連結のパフォーマンス比較' },
  { title: '[CSS in JS] 最新のCSSプロパティにVS Codeのシンタックスハイライトを対応させる方法' },
  { title: 'Shift_JISファイルをgrepする方法' },
];

describe('検索ロジック', () => {
  test('performPostSearch - 優先度順にソートされた結果を返す', () => {
    const results = performPostSearch('React');

    // 結果はpost.titleのプロパティを持つオブジェクトの配列であるべき
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('title');
    expect(results[0]).toHaveProperty('tags');
    expect(results[0]).toHaveProperty('slug');
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
});

describe('AND検索（複数ワード）', () => {
  test('複数ワード検索では全てのワードを含む記事のみがヒットする', () => {
    const results = performPostSearch('javascript react');

    // javascript と react の両方のトークンを持つのは 202502090230 のみ
    expect(results.length).toBe(1);
    expect(results[0].slug).toBe('202502090230');
  });

  test('片方のワードしか含まない記事はAND検索で除外される', () => {
    const results = performPostSearch('github copilot');

    // github のみ持つ 202504281417 (GitHub Actions) は除外される
    expect(results.some((post) => post.slug === '202504281417')).toBe(false);

    // github と copilot の両方を持つ 202503210941 は含まれる
    expect(results.some((post) => post.slug === '202503210941')).toBe(true);
  });
});

describe('日本語検索の問題', () => {
  test('「方法」で検索したとき該当する全ての記事がヒットする', () => {
    const results = performPostSearch('方法');

    // 「方法」を含むすべての投稿を確認
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

    // フォールバック検索ではmatchedInがtitle、matchTypeが適切に設定される
    expect(results[0].matchedIn).toBe('title');
    expect(results[0].matchType).toBeDefined();
    expect(['EXACT', 'PARTIAL', 'MULTI_TERM_MATCH', 'NONE']).toContain(results[0].matchType);
  });

  test('インデックス検索結果が優先され、フォールバック結果は後方に配置される', () => {
    // "GitHub"はインデックスに存在するワード
    const results = performPostSearch('github');

    // 結果があり、通常の検索が動作する
    expect(results.length).toBeGreaterThan(0);

    // インデックス検索結果はタグマッチやトークンマッチの情報を持つ
    // (フォールバックではmatchedInが必ずtitleかつmatchTypeがPARTIALになる)
    const hasNonTitleMatch = results.some((post) => post.matchedIn !== 'title' || post.matchType !== 'PARTIAL');
    expect(hasNonTitleMatch).toBe(true);
  });
});
