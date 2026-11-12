import { expect, test } from 'vitest';
import { createSearchEngine, tokenizeQuery } from './engine';

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

const searchIndex: Record<string, number[]> = {};
for (const [postId, post] of posts.entries()) {
  for (const token of post.tokens) {
    searchIndex[token] ??= [];
    if (!searchIndex[token].includes(postId)) searchIndex[token].push(postId);
  }
}

const searchData = [
  {
    slug: '202504281417',
    title: '[GitHub Actions] `actions/ai-inference`を利用したPR自動要約の実装',
    tags: ['GitHub Actions', 'AI'],
  },
  {
    slug: '202504122020',
    title: 'JavaScriptを利用したブラウザのプライベートモード判定についての考察',
    tags: ['JavaScript', 'ブラウザ', '調査'],
  },
  {
    slug: '202504061452',
    title: '[Google Fonts] 日本語フォントの読み込みを高速化する実装方法',
    tags: ['TypeScript', 'React', 'CSS', 'フォント'],
  },
  {
    slug: '202503210941',
    title: '[GitHub Copilot] 「ずんだもん」の人格を与える技術',
    tags: ['GitHub Copilot', 'VS Code'],
  },
  {
    slug: '202502242115',
    title: '[TypeScript] オプショナルの`?`と`| undefined`の違い',
    tags: ['TypeScript'],
  },
  {
    slug: '202502122306',
    title: '[命名規則] コンポーネント名は動詞から始めない',
    tags: ['React', '設計'],
  },
  {
    slug: '202502090230',
    title: '[JavaScript] 分割代入された引数の名称変更とデフォルト値を同時に指定する方法',
    tags: ['React', 'JavaScript', 'TypeScript'],
  },
  {
    slug: '202502071045',
    title: '[JavaScript] テンプレートリテラルと文字列連結のパフォーマンス比較',
    tags: ['JavaScript'],
  },
  {
    slug: '202501200200',
    title: '[CSS in JS] 最新のCSSプロパティにVS Codeのシンタックスハイライトを対応させる方法',
    tags: ['CSS in JS', 'Emotion', 'TypeScript', 'VS Code'],
  },
  {
    slug: '202412281606',
    title: 'Shift_JISファイルをgrepする方法',
    tags: ['Bash'],
  },
  {
    slug: '202303191231',
    title: 'C++プログラミング',
    tags: ['C++', 'プログラミング'],
  },
  {
    slug: '202403220115',
    title: 'CSS3とHTML5',
    tags: ['CSS3', 'HTML5', 'Web'],
  },
];

const engine = createSearchEngine({ searchIndex, searchData });

test('検索した場合、slug と title（と一致したタグ）だけを持つ結果を返す', () => {
  const results = engine.search('React');

  expect(results.length).toBeGreaterThan(0);
  for (const result of results) {
    expect(Object.keys(result).filter((key) => !['slug', 'title', 'matchedTag'].includes(key))).toEqual([]);
    expect(result.slug).toBeTypeOf('string');
    expect(result.title).toBeTypeOf('string');
  }
});

test('検索候補が100件を超えても、スコアの高い上位100件に制限する', () => {
  const manyPosts = Array.from({ length: 150 }, (_, index) => ({
    slug: `post-${index}`,
    title: `React note ${index}`,
    tags: index === 149 ? ['React'] : [],
  }));
  const manyEngine = createSearchEngine({
    searchIndex: { react: manyPosts.map((_, index) => index) },
    searchData: manyPosts,
  });

  const results = manyEngine.search('react');

  expect(results).toHaveLength(100);
  expect(results[0].slug).toBe('post-149');
});

test('空や空白だけの語の場合、空の配列を返す', () => {
  expect(engine.search('')).toEqual([]);
  expect(engine.search('   ')).toEqual([]);
  expect(engine.search('\t\n')).toEqual([]);
});

test('1 文字や記号を含む語でも検索できる', () => {
  expect(engine.search('c').some((post) => post.slug === '202303191231')).toBe(true);
  expect(engine.search('css3').some((post) => post.slug === '202403220115')).toBe(true);
});

test('Object prototype 上の名前を検索しても、例外を投げず一致なしを返す', () => {
  expect(engine.search('constructor')).toEqual([]);
  expect(engine.search('__proto__')).toEqual([]);
});

test('索引語の一部にあたる語（reac）でも、その索引語を持つ記事を検索できる', () => {
  const slugs = engine.search('reac').map((post) => post.slug);

  expect(slugs.sort()).toEqual(['202502090230', '202502122306', '202504061452']);
});

test('複数の語で検索した場合、すべての語を含む記事だけが一致する', () => {
  expect(engine.search('javascript react').map((post) => post.slug)).toEqual(['202502090230']);
});

test('片方の語しか含まない記事は、AND 検索で除外する', () => {
  const slugs = engine.search('github copilot').map((post) => post.slug);

  expect(slugs).not.toContain('202504281417');
  expect(slugs).toContain('202503210941');
});

test('「方法」で検索した場合、タイトルに「方法」を含むすべての記事が一致する', () => {
  const titlesWithMethod = searchData.filter((post) => post.title.includes('方法')).map((post) => post.title);
  const found = engine.search('方法').map((post) => post.title);

  expect(found.filter((title) => title.includes('方法'))).toHaveLength(titlesWithMethod.length);
});

test('インデックスの語と一致しなくても、タイトルに含まれていれば検索できる', () => {
  const results = engine.search('プライベートモード');

  expect(results.map((post) => post.slug)).toEqual(['202504122020']);
});

test('インデックス検索の結果が先に並び、タイトル直接検索の結果は後ろに並ぶ', () => {
  const fallbackEngine = createSearchEngine({
    searchIndex: { alpha: [0] },
    searchData: [
      { slug: 'indexed', title: 'ほかの題名', tags: [] },
      { slug: 'title-only', title: 'alpha で始まる題名', tags: [] },
    ],
  });

  expect(fallbackEngine.search('alpha').map((post) => post.slug)).toEqual(['indexed', 'title-only']);
});

test('全角英数や大文字の語でも、正規化して同じ結果を返す', () => {
  expect(engine.search('ＲＥＡＣＴ')).toEqual(engine.search('react'));
});

test('同じ語で何度検索しても同じ結果を返し、別のエンジンと状態を共有しない', () => {
  const other = createSearchEngine({ searchIndex: {}, searchData: [] });

  expect(engine.search('react')).toEqual(engine.search('react'));
  expect(other.search('react')).toEqual([]);
  expect(engine.search('react').length).toBeGreaterThan(0);
});

test('タイトルに含まれずタグだけに一致した記事は、一致したタグを持つ', () => {
  const result = engine.search('react').find((post) => post.slug === '202502122306');

  expect(result?.matchedTag).toBe('React');
});

test('タイトルにも一致した記事は、一致したタグを持たない', () => {
  const result = engine.search('typescript').find((post) => post.slug === '202502242115');

  expect(result).toBeDefined();
  expect(result?.matchedTag).toBeUndefined();
});

test('タグが複数一致する場合、記事のタグの並びで最初に一致したタグを持つ', () => {
  const tagEngine = createSearchEngine({
    searchIndex: { react: [0] },
    searchData: [{ slug: 'hooks', title: 'フックの設計', tags: ['Vue', 'React', 'React Hooks'] }],
  });

  expect(tagEngine.search('react')[0].matchedTag).toBe('React');
});

test('検索語がタグを含む場合も、一致したタグとして扱う', () => {
  const tagEngine = createSearchEngine({
    searchIndex: { reactive: [0] },
    searchData: [{ slug: 'design', title: '設計の話', tags: ['Vue', 'React'] }],
  });

  expect(tagEngine.search('reactive')[0].matchedTag).toBe('React');
});

test('全角や大文字の検索語でも、タグへの一致を正規化して判定し、記事のタグの表記で返す', () => {
  const tagEngine = createSearchEngine({
    searchIndex: { css: [0] },
    searchData: [{ slug: 'style', title: 'スタイルの設計', tags: ['Css'] }],
  });

  expect(tagEngine.search('ＣＳＳ')[0].matchedTag).toBe('Css');
});

test('タイトル直接検索で見つかった記事は、一致したタグを持たない', () => {
  const tagEngine = createSearchEngine({
    searchIndex: {},
    searchData: [{ slug: 'title-only', title: 'react の話', tags: ['React'] }],
  });

  expect(tagEngine.search('react')).toEqual([{ slug: 'title-only', title: 'react の話' }]);
});

test('tokenizeQuery は、正規化して空白で分け、重複を除く', () => {
  expect(tokenizeQuery('  React　Hooks react ')).toEqual(['react', 'hooks']);
  expect(tokenizeQuery('ＮＥＸＴ.ｊｓ')).toEqual(['next.js']);
  expect(tokenizeQuery('   ')).toEqual([]);
});
