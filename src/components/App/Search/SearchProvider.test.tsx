import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const navigation = vi.hoisted(() => ({ pathname: '/' }));
vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
}));

const engineLoader = vi.hoisted(() => ({ loadSearchEngine: vi.fn() }));
vi.mock('./engineLoader', () => ({
  loadSearchEngine: engineLoader.loadSearchEngine,
}));

let shouldFailToLoad = false;
let dialogImportCount = 0;

type StubProps = {
  isClosing: boolean;
  popularPosts: unknown[];
  onRequestCloseAction: () => void;
  onClosedAction: () => void;
};

function StubSearchDialog({ isClosing, popularPosts, onRequestCloseAction, onClosedAction }: StubProps) {
  return (
    <div data-closing={String(isClosing)} data-popular-count={popularPosts.length} data-testid="search-dialog">
      <button onClick={onRequestCloseAction} type="button">
        閉じる要求
      </button>
      <button onClick={onClosedAction} type="button">
        閉じ終えた
      </button>
    </div>
  );
}

vi.mock('./SearchDialog', () => ({
  // biome-ignore lint/style/useNamingConvention: React component mock requires PascalCase
  SearchDialog: StubSearchDialog,
  // biome-ignore lint/suspicious/noThenProperty: import() の拒否を再現するため、意図して then を持たせる（失敗させない間は undefined）
  get then() {
    dialogImportCount += 1;
    if (!shouldFailToLoad) return undefined;

    return (_resolve: unknown, reject: (reason: Error) => void) => reject(new Error('chunk load failed'));
  },
}));

import { SearchProvider } from './SearchProvider';
import { SearchTrigger } from './SearchTrigger';

async function settleDialogImport() {
  await act(async () => {
    await vi.dynamicImportSettled();
  });
}

// rerender に同じ要素を渡さず、毎回新しい要素を作る。同じ要素だと React が描画を省き、usePathname が読み直されない
function renderProvider() {
  const createUi = () => (
    <SearchProvider popularPosts={[{ slug: 'popular-1', title: '人気の記事' }]}>
      <SearchTrigger />
      <input aria-label="別の入力欄" />
    </SearchProvider>
  );
  const { rerender } = render(createUi());

  return { rerender: () => rerender(createUi()) };
}

const getTrigger = () => screen.getByRole('button', { name: '記事検索' });
const getDialog = () => screen.getByTestId('search-dialog');
const queryDialog = () => screen.queryByTestId('search-dialog');

async function openDialog() {
  fireEvent.click(getTrigger());
  await settleDialogImport();
}

beforeEach(() => {
  navigation.pathname = '/';
  shouldFailToLoad = false;
  dialogImportCount = 0;
  engineLoader.loadSearchEngine.mockReset();
  engineLoader.loadSearchEngine.mockResolvedValue({});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test('ボタンを押した場合、読み込みが終わってから、閉じる途中でない検索ダイアログに候補の記事を渡して描画する', async () => {
  renderProvider();

  fireEvent.click(getTrigger());
  expect(queryDialog()).toBeNull();

  await settleDialogImport();

  expect(getDialog().getAttribute('data-closing')).toBe('false');
  expect(getDialog().getAttribute('data-popular-count')).toBe('1');
});

test('開くときに、検索データの読み込みも並行して始める', async () => {
  renderProvider();

  await openDialog();

  expect(engineLoader.loadSearchEngine).toHaveBeenCalled();
});

test('ボタンの aria-keyshortcuts が示す / キーでも開く', async () => {
  renderProvider();
  expect(getTrigger().getAttribute('aria-keyshortcuts')).toBe('/');

  const wasNotPrevented = fireEvent.keyDown(document.body, { key: '/' });
  await settleDialogImport();

  expect(wasNotPrevented).toBe(false);
  expect(getDialog()).toBeDefined();
});

test('入力欄・IME の変換中・ほかのキーの場合、/ キーで開かない', async () => {
  renderProvider();
  const input = screen.getByLabelText('別の入力欄');

  const typedInInput = fireEvent.keyDown(input, { key: '/' });
  const composing = fireEvent.keyDown(document.body, { key: '/', isComposing: true });
  const processKey = fireEvent.keyDown(document.body, { key: '/', keyCode: 229 });
  const otherKey = fireEvent.keyDown(document.body, { key: 'a' });
  await settleDialogImport();

  expect([typedInInput, composing, processKey, otherKey]).toEqual([true, true, true, true]);
  expect(queryDialog()).toBeNull();
});

test('開いている間は、/ キーを受け付けない', async () => {
  renderProvider();
  await openDialog();

  const wasNotPrevented = fireEvent.keyDown(document.body, { key: '/' });

  expect(wasNotPrevented).toBe(true);
});

test('閉じる要求を受けた場合、閉じる途中の間は描画を保ち、閉じ終えたら外す', async () => {
  renderProvider();
  await openDialog();

  fireEvent.click(screen.getByRole('button', { name: '閉じる要求' }));
  expect(getDialog().getAttribute('data-closing')).toBe('true');

  fireEvent.click(screen.getByRole('button', { name: '閉じ終えた' }));
  expect(queryDialog()).toBeNull();
});

test('閉じる途中に閉じる要求が重なっても、閉じる途中のまま描画を保つ', async () => {
  renderProvider();
  await openDialog();

  fireEvent.click(screen.getByRole('button', { name: '閉じる要求' }));
  fireEvent.click(screen.getByRole('button', { name: '閉じる要求' }));

  expect(getDialog().getAttribute('data-closing')).toBe('true');
});

test('閉じ終えたあとは、もう一度開ける', async () => {
  renderProvider();
  await openDialog();
  fireEvent.click(screen.getByRole('button', { name: '閉じる要求' }));
  fireEvent.click(screen.getByRole('button', { name: '閉じ終えた' }));

  await openDialog();

  expect(getDialog().getAttribute('data-closing')).toBe('false');
});

test('開いている間に画面遷移した場合、閉じる途中にする', async () => {
  const { rerender } = renderProvider();
  await openDialog();

  navigation.pathname = '/next';
  rerender();

  expect(getDialog().getAttribute('data-closing')).toBe('true');
});

test('画面遷移がなければ、再描画しても閉じない', async () => {
  const { rerender } = renderProvider();
  await openDialog();

  rerender();

  expect(getDialog().getAttribute('data-closing')).toBe('false');
});

test('閉じている間に画面遷移した場合、次に開くときへ影響せず、/ キーでも開ける', async () => {
  const { rerender } = renderProvider();
  navigation.pathname = '/next';
  rerender();
  expect(queryDialog()).toBeNull();

  fireEvent.keyDown(document.body, { key: '/' });
  await settleDialogImport();

  expect(getDialog().getAttribute('data-closing')).toBe('false');
});

test('読み込みに失敗した場合、ログを残して閉じたままにし、ボタンと / キーから開き直せる', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  renderProvider();
  shouldFailToLoad = true;

  await openDialog();

  expect(consoleError).toHaveBeenCalledWith('Failed to load SearchDialog:', expect.any(Error));
  expect(queryDialog()).toBeNull();

  shouldFailToLoad = false;
  fireEvent.keyDown(document.body, { key: '/' });
  await settleDialogImport();

  expect(getDialog()).toBeDefined();
});

test('ボタンに hover した場合、ダイアログと検索データを先に読み始める', async () => {
  renderProvider();
  expect(dialogImportCount).toBe(0);

  fireEvent.mouseEnter(getTrigger());
  await settleDialogImport();

  expect(dialogImportCount).toBeGreaterThan(0);
  expect(engineLoader.loadSearchEngine).toHaveBeenCalled();
  expect(queryDialog()).toBeNull();
});

test('ボタンに焦点が当たった場合も、先に読み始める', async () => {
  renderProvider();

  fireEvent.focus(getTrigger());
  await settleDialogImport();

  expect(engineLoader.loadSearchEngine).toHaveBeenCalled();
});

test('先読みに失敗した場合、エラーを出さない（開く操作が読み込み直して報告する）', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  engineLoader.loadSearchEngine.mockRejectedValue(new Error('network error'));
  shouldFailToLoad = true;
  renderProvider();

  fireEvent.mouseEnter(getTrigger());
  await settleDialogImport();

  expect(consoleError).not.toHaveBeenCalled();
});

test('SearchProvider の外にボタンを置いた場合、エラーにする', () => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);

  expect(() => render(<SearchTrigger />)).toThrow('useSearchOpener must be used within SearchProvider');
});
