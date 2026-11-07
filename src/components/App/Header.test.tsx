import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, type Mock, test, vi } from 'vitest';

// jsdom には window.matchMedia が無く、実物の HeaderNavigation は mount 時に落ちるため、これだけ置き換える
vi.mock('./Header/Navigation', () => ({
  // biome-ignore lint/style/useNamingConvention: React component mock requires PascalCase
  HeaderNavigation: () => null,
}));

let searchDialog: { isOpen: boolean; isClosing: boolean; close: Mock };
let shouldFailToLoad = false;
let failedImportAttempts = 0;

vi.mock('./SearchDialogContext', () => ({
  useSearchDialog: () => searchDialog,
}));

function StubSearchDialog({ isClosing }: { isClosing?: boolean }) {
  return <div data-closing={String(isClosing)} data-testid="search-dialog" />;
}

// import() の拒否(chunk の取得失敗)は、拒否する then をモジュールに持たせて再現する。
// importSearchDialog は Header.tsx 内で閉じて差し替えられず、factory も 1 回しか評価されないため、then の中でフラグを見る。
// then は import() 1 回につき 1 回読まれるので、失敗時に読まれた回数が、読み込みを試みた回数になる
vi.mock('@/components/App/Search/SearchDialog', () => ({
  // biome-ignore lint/style/useNamingConvention: React component mock requires PascalCase
  SearchDialog: StubSearchDialog,
  // biome-ignore lint/suspicious/noThenProperty: import() の拒否を再現するため、意図して then を持たせる(失敗させない間は undefined)
  get then() {
    if (!shouldFailToLoad) return undefined;

    failedImportAttempts += 1;
    return (_resolve: unknown, reject: (reason: Error) => void) => reject(new Error('chunk load failed'));
  },
}));

import { Header } from '@/components/App/Header';

// 検索ダイアログは開いた時点で動的に読み込まれる。import の完了を待ってから確かめる
async function settleDialogImport() {
  await act(async () => {
    await vi.dynamicImportSettled();
  });
}

// 返す関数は、Provider が描画のたびに新しい object を返すのと同じく、更新のたびに新しい object を渡して描画し直す
function renderHeader({ failToLoad = false } = {}) {
  searchDialog = { isOpen: false, isClosing: false, close: vi.fn() };
  shouldFailToLoad = failToLoad;
  failedImportAttempts = 0;
  const { rerender } = render(<Header />);

  return (changes: Partial<typeof searchDialog>) => {
    searchDialog = { ...searchDialog, ...changes };
    rerender(<Header />);
  };
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test('閉じている場合、検索ダイアログを描画しない', async () => {
  renderHeader();
  await settleDialogImport();

  expect(screen.queryByTestId('search-dialog')).toBeNull();
});

test('開いた場合、読み込みが終わってから検索ダイアログを描画する', async () => {
  const update = renderHeader();

  update({ isOpen: true });
  await settleDialogImport();

  expect(screen.getByTestId('search-dialog')).toBeDefined();
});

test('閉じる途中の間は描画を保ち、閉じ終えたら外す', async () => {
  const update = renderHeader();
  update({ isOpen: true });
  await settleDialogImport();

  update({ isOpen: false, isClosing: true });
  expect(screen.getByTestId('search-dialog').getAttribute('data-closing')).toBe('true');

  update({ isClosing: false });
  expect(screen.queryByTestId('search-dialog')).toBeNull();
});

test('読み込みに失敗した場合、ログを残してダイアログを閉じ、何も描画しない', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const update = renderHeader({ failToLoad: true });

  update({ isOpen: true });
  await settleDialogImport();

  expect(consoleError).toHaveBeenCalledWith('Failed to load SearchDialog:', expect.any(Error));
  expect(searchDialog.close).toHaveBeenCalled();
  expect(screen.queryByTestId('search-dialog')).toBeNull();
});

test('読み込みに失敗して閉じる途中の間は、読み込み直さない', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const update = renderHeader({ failToLoad: true });

  update({ isOpen: true });
  await settleDialogImport();
  expect(failedImportAttempts).toBe(1);

  // 失敗時の close() が Provider を描画し直した状態
  update({ isClosing: true });
  await settleDialogImport();

  expect(failedImportAttempts).toBe(1);
});
