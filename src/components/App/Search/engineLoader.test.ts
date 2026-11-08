import { beforeEach, expect, test, vi } from 'vitest';

let shouldFailToLoad = false;
let failedLoadAttempts = 0;

vi.mock('~/dist/search.json', () => ({
  default: {
    searchIndex: { react: [0] },
    searchData: [{ slug: 'react-note', title: 'React のメモ', tags: [] }],
  },
  // biome-ignore lint/suspicious/noThenProperty: lint に従って then を外さない。外すと import() が拒否されず、読み込みの失敗を再現できないため
  get then() {
    if (!shouldFailToLoad) return undefined;

    failedLoadAttempts += 1;
    return (_resolve: unknown, reject: (reason: Error) => void) => reject(new Error('chunk load failed'));
  },
}));

// engineLoader を最上部で import しない。Promise とエンジンをモジュールの変数に持つので、1 回だけ import すると、前のテストの結果が残る
async function importLoader() {
  vi.resetModules();
  return import('./engineLoader');
}

beforeEach(() => {
  shouldFailToLoad = false;
  failedLoadAttempts = 0;
});

test('読み込む前は、読み込み済みのエンジンを返さない', async () => {
  const { getLoadedSearchEngine } = await importLoader();

  expect(getLoadedSearchEngine()).toBeNull();
});

test('読み込んだ場合、検索できるエンジンを返し、同じエンジンを読み込み済みとして返す', async () => {
  const { getLoadedSearchEngine, loadSearchEngine } = await importLoader();

  const engine = await loadSearchEngine();

  expect(engine.search('react').map((result) => result.slug)).toEqual(['react-note']);
  expect(getLoadedSearchEngine()).toBe(engine);
});

test('何度呼んでも、読み込みは 1 回で、同じ Promise を返す', async () => {
  const { loadSearchEngine } = await importLoader();

  const first = loadSearchEngine();
  const second = loadSearchEngine();

  expect(second).toBe(first);
  expect(await first).toBe(await second);
});

test('読み込みに失敗した場合、拒否して読み込み済みにせず、次の呼び出しでやり直す', async () => {
  const { getLoadedSearchEngine, loadSearchEngine } = await importLoader();
  shouldFailToLoad = true;

  await expect(loadSearchEngine()).rejects.toThrow('chunk load failed');
  expect(getLoadedSearchEngine()).toBeNull();
  expect(failedLoadAttempts).toBe(1);

  shouldFailToLoad = false;
  const engine = await loadSearchEngine();

  expect(getLoadedSearchEngine()).toBe(engine);
});
