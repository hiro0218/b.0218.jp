import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { SITE_URL } from '@/constants';
import { createSearchEngine, type SearchEngine } from './engine';
import { SearchDialog } from './SearchDialog';

// AnimationEvent は import より後に用意しない。React DOM が読み込み時にその有無で animationend の購読名を決めるが、jsdom には無いため
vi.hoisted(() => {
  class AnimationEventStub extends Event {
    animationName: string;
    constructor(type: string, init: EventInit & { animationName?: string } = {}) {
      super(type, init);
      this.animationName = init.animationName ?? '';
    }
  }
  Object.defineProperty(globalThis, 'AnimationEvent', { configurable: true, value: AnimationEventStub });
});

const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({
  useRouter: () => router,
}));

const loader = vi.hoisted(() => ({
  engine: null as SearchEngine | null,
  loadSearchEngine: vi.fn(),
}));
vi.mock('./engineLoader', () => ({
  getLoadedSearchEngine: () => loader.engine,
  loadSearchEngine: loader.loadSearchEngine,
}));

const RECENT_KEY = 'recent-searches';
const STATE_KEY = 'search-state';
const MINUTE = 60 * 1000;

const engine = createSearchEngine({
  searchIndex: { css: [0, 1], react: [1, 2], 'next.js': [3] },
  searchData: [
    { slug: 'css-basics', title: 'CSS の基礎', tags: ['CSS'] },
    { slug: 'react-css', title: 'React と CSS の設計', tags: ['React', 'CSS'] },
    { slug: 'hooks', title: 'フックの設計', tags: ['React'] },
    { slug: 'nextjs', title: 'Next.js 入門', tags: ['Next.js'] },
  ],
});

const showModal = vi.fn(function (this: HTMLDialogElement) {
  this.setAttribute('open', '');
});
const closeDialog = vi.fn(function (this: HTMLDialogElement) {
  this.removeAttribute('open');
});
const scrollTo = vi.fn();
const scrollIntoView = vi.fn();

beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: showModal });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value: closeDialog });
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', { configurable: true, value: scrollTo });
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: scrollIntoView });
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

beforeEach(() => {
  loader.engine = engine;
  loader.loadSearchEngine.mockReset();
  loader.loadSearchEngine.mockResolvedValue(engine);
  router.push.mockClear();
  for (const mock of [showModal, closeDialog, scrollTo, scrollIntoView]) mock.mockClear();
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function renderDialog(props: Partial<ComponentProps<typeof SearchDialog>> = {}) {
  const onRequestCloseAction = vi.fn();
  const onClosedAction = vi.fn();
  render(
    <SearchDialog
      isClosing={false}
      onClosedAction={onClosedAction}
      onRequestCloseAction={onRequestCloseAction}
      popularPosts={[{ slug: 'popular-1', title: '人気の記事' }]}
      {...props}
    />,
  );

  return { onRequestCloseAction, onClosedAction };
}

const getDialog = () => document.querySelector('dialog') as HTMLDialogElement;
const getInput = () => screen.getByRole<HTMLInputElement>('combobox', { name: '検索キーワード' });
const getOptions = () => screen.getAllByRole('option');
const getOptionTexts = () => getOptions().map((option) => option.textContent);
const getSelectedId = () => getInput().getAttribute('aria-activedescendant');

function typeQuery(value: string) {
  fireEvent.change(getInput(), { target: { value } });
  act(() => {
    vi.advanceTimersByTime(300);
  });
}

function stubEngineLoading() {
  const deferred = Promise.withResolvers<SearchEngine>();
  loader.engine = null;
  loader.loadSearchEngine.mockReturnValue(deferred.promise);

  return async () => {
    loader.engine = engine;
    await act(async () => {
      deferred.resolve(engine);
      await deferred.promise;
    });
  };
}

test('描画した場合、モーダルとして開き、入力欄に焦点を置く', () => {
  renderDialog();

  expect(showModal).toHaveBeenCalledTimes(1);
  expect(getDialog().hasAttribute('open')).toBe(true);
  expect(document.activeElement).toBe(getInput());
});

test('dialog は見出しと説明で名前づけされる', () => {
  renderDialog();

  expect(screen.getByRole('dialog', { name: '記事検索' }).getAttribute('aria-describedby')).toBeTruthy();
});

test('未入力の場合、最近の検索と、よく読まれている記事を並べ、何も選ばない', () => {
  localStorage.setItem(RECENT_KEY, JSON.stringify(['Next.js']));
  renderDialog();

  const listbox = screen.getByRole('listbox', { name: '検索の候補' });

  expect(within(listbox).getByRole('group', { name: '最近の検索' })).toBeDefined();
  expect(within(listbox).getByRole('group', { name: 'よく読まれている記事' })).toBeDefined();
  expect(getOptionTexts()).toEqual(['Next.js', '人気の記事']);
  expect(getOptions().map((option) => option.getAttribute('aria-selected'))).toEqual(['false', 'false']);
  expect(getInput().hasAttribute('aria-activedescendant')).toBe(false);
});

test('保存された最近の検索が文字列の配列でない場合、候補に出さない', () => {
  localStorage.setItem(RECENT_KEY, JSON.stringify([1, 2]));
  renderDialog();

  expect(getOptionTexts()).toEqual(['人気の記事']);
});

test('保存された最近の検索が 5 件を超える場合、先頭の 5 件を出す', () => {
  localStorage.setItem(RECENT_KEY, JSON.stringify(['a', 'b', 'c', 'd', 'e', 'f']));
  renderDialog({ popularPosts: [] });

  expect(getOptionTexts()).toEqual(['a', 'b', 'c', 'd', 'e']);
});

test('入力して 300ms 待った場合、検索結果を出し、1 件目を選ぶ', () => {
  vi.useFakeTimers();
  renderDialog();

  fireEvent.change(getInput(), { target: { value: 'css' } });
  act(() => {
    vi.advanceTimersByTime(299);
  });
  expect(screen.getByRole('listbox', { name: '検索の候補' })).toBeDefined();

  act(() => {
    vi.advanceTimersByTime(1);
  });

  expect(screen.getByRole('listbox', { name: '検索結果' })).toBeDefined();
  expect(screen.queryByRole('group')).toBeNull();
  expect(getOptionTexts()).toEqual(['CSS の基礎', 'React と CSS の設計']);
  expect(getSelectedId()).toBe('search-result-css-basics');
});

test('入力を変えた場合、新しい結果が出るまで選択を外し、出たら 1 件目を選び直す', () => {
  vi.useFakeTimers();
  renderDialog();
  typeQuery('css');

  fireEvent.change(getInput(), { target: { value: 'react' } });
  expect(getInput().hasAttribute('aria-activedescendant')).toBe(false);

  act(() => {
    vi.advanceTimersByTime(300);
  });
  expect(getSelectedId()).toBe('search-result-react-css');
});

test('実行済みの語へ戻る入力の場合、予約済みの検索を発火させない', () => {
  vi.useFakeTimers();
  renderDialog();
  typeQuery('css');

  fireEvent.change(getInput(), { target: { value: 'react' } });
  fireEvent.change(getInput(), { target: { value: 'css ' } });
  act(() => {
    vi.advanceTimersByTime(300);
  });

  expect(getOptionTexts()).toEqual(['CSS の基礎', 'React と CSS の設計']);
});

test('空白だけにした場合、検索を取り消して候補へ戻す', () => {
  vi.useFakeTimers();
  renderDialog();
  typeQuery('css');

  typeQuery('   ');

  expect(screen.getByRole('listbox', { name: '検索の候補' })).toBeDefined();
  expect(sessionStorage.getItem(STATE_KEY)).toBeNull();
});

test('何も選んでいない状態で Enter を押した場合、待たずに入力欄の語で検索する', () => {
  vi.useFakeTimers();
  renderDialog();

  fireEvent.change(getInput(), { target: { value: 'css' } });
  fireEvent.keyDown(getInput(), { key: 'Enter' });

  expect(getOptionTexts()).toEqual(['CSS の基礎', 'React と CSS の設計']);
  expect(router.push).not.toHaveBeenCalled();
});

test('0 件の場合、一致する記事が無いことと Google 検索を結果の場所に出し、フッターは出さない', () => {
  vi.useFakeTimers();
  renderDialog();

  typeQuery('zz&qq');

  expect(screen.getByText('zz&qq').closest('p')?.textContent).toBe('「zz&qq」に一致する記事はありません');
  expect(screen.queryByRole('listbox')).toBeNull();
  expect(screen.queryByText('Enter')).toBeNull();
  const googleLink = screen.getByRole('link', { name: 'Google で「zz&qq」を検索（外部サイト）' });
  expect(googleLink.getAttribute('target')).toBe('_blank');
  const url = new URL(googleLink.getAttribute('href') ?? '');
  expect(url.origin + url.pathname).toBe('https://www.google.com/search');
  expect(url.searchParams.get('q')).toBe(`site:${new URL(SITE_URL).host} zz&qq`);
});

test('結果がある場合、フッターにキー操作の案内と Google 検索を出す', () => {
  vi.useFakeTimers();
  renderDialog();

  typeQuery('css');

  expect(screen.getByText('Enter')).toBeDefined();
  expect(screen.getByRole('link', { name: 'Google で「css」を検索（外部サイト）' })).toBeDefined();
});

test('0 件で一覧が無い場合、combobox は一覧を指さず、閉じた状態を示す', () => {
  vi.useFakeTimers();
  renderDialog();
  expect(getInput().getAttribute('aria-expanded')).toBe('true');
  expect(getInput().getAttribute('aria-controls')).toBe(screen.getByRole('listbox').id);

  typeQuery('zzqqxx');

  expect(getInput().getAttribute('aria-expanded')).toBe('false');
  expect(getInput().hasAttribute('aria-controls')).toBe(false);
});

test('タグだけに一致した行は一致したタグを出し、タイトルにも一致した行は出さない', () => {
  vi.useFakeTimers();
  renderDialog();

  typeQuery('react');

  const [withTitle, tagOnly] = getOptions();
  expect(within(withTitle).queryByText('タグに一致')).toBeNull();
  expect(within(tagOnly).getByText('タグに一致')).toBeDefined();
  expect(within(tagOnly).getByText('React')).toBeDefined();
});

test('検索結果の件数は画面に出さず、件数と検索語を読み上げの領域だけに出す', () => {
  vi.useFakeTimers();
  renderDialog();

  typeQuery('css');

  const status = screen.getByRole('status');
  expect(status.textContent).toBe('2件の検索結果が見つかりました。「css」の検索結果です。');
  expect(status.className).toContain('sr-only');
});

test('0 件の場合も、検索語つきで 0 件と読み上げる', () => {
  vi.useFakeTimers();
  renderDialog();

  typeQuery('zzqqxx');

  expect(screen.getByRole('status').textContent).toBe('0件の検索結果が見つかりました。「zzqqxx」の検索結果です。');
});

test('検索語が長い場合、20 文字までに省略して読み上げる', () => {
  vi.useFakeTimers();
  renderDialog();

  typeQuery('あ'.repeat(25));

  expect(screen.getByRole('status').textContent).toContain(`「${'あ'.repeat(20)}...」`);
});

test('未入力で候補を出している場合、候補の数を検索結果として読み上げない', () => {
  renderDialog();

  expect(screen.getByRole('status').textContent).toBe('');
});

test('エンジンの読み込み待ちの間は、結果も 0 件の案内も出さず、読み上げもしない。読み込みが済んだら結果を出す', async () => {
  vi.useFakeTimers();
  const finishLoading = stubEngineLoading();
  renderDialog();

  typeQuery('css');

  expect(screen.queryByRole('listbox')).toBeNull();
  expect(screen.queryByText('に一致する記事はありません', { exact: false })).toBeNull();
  expect(screen.getByRole('status').textContent).toBe('');
  expect(screen.getByRole('link', { name: 'Google で「css」を検索（外部サイト）' })).toBeDefined();

  await finishLoading();

  expect(getOptionTexts()).toEqual(['CSS の基礎', 'React と CSS の設計']);
  expect(getSelectedId()).toBe('search-result-css-basics');
});

test('エンジンの読み込み待ち中に入力を消した場合、古い検索結果を反映しない', async () => {
  vi.useFakeTimers();
  const finishLoading = stubEngineLoading();
  renderDialog();

  typeQuery('css');
  typeQuery('');
  await finishLoading();

  expect(screen.getByRole('listbox', { name: '検索の候補' })).toBeDefined();
  // 候補の表示だけで済ませない。古い結果が入ると、候補の 1 件目を自動で選んでしまうため
  expect(getInput().hasAttribute('aria-activedescendant')).toBe(false);
});

test('エンジンの読み込みに失敗した場合、ログを残して結果を待ったままにし、次の入力でやり直す', async () => {
  vi.useFakeTimers();
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  loader.engine = null;
  loader.loadSearchEngine.mockRejectedValueOnce(new Error('network error'));
  renderDialog();

  typeQuery('css');
  await act(async () => {});

  expect(consoleError).toHaveBeenCalledWith('Failed to load search engine:', expect.any(Error));
  expect(screen.queryByRole('listbox')).toBeNull();

  loader.engine = engine;
  typeQuery('next.js');

  expect(getOptionTexts()).toEqual(['Next.js 入門']);
});

test('消去ボタンは入力があるときだけ出し、押すと入力・検索・保存した語を消して、入力欄に焦点を戻す', () => {
  vi.useFakeTimers();
  renderDialog();
  expect(screen.queryByRole('button', { name: 'キーワードを消す' })).toBeNull();
  typeQuery('css');
  const clearButton = screen.getByRole('button', { name: 'キーワードを消す' });
  // 焦点を移さずに click しない。fireEvent.click は焦点を移さず、実際のクリックと食い違う。消えるボタンに焦点が残って失われないことを見るため
  clearButton.focus();

  fireEvent.click(clearButton);

  expect(getInput().value).toBe('');
  expect(screen.getByRole('listbox', { name: '検索の候補' })).toBeDefined();
  expect(sessionStorage.getItem(STATE_KEY)).toBeNull();
  expect(document.activeElement).toBe(getInput());
  expect(screen.queryByRole('button', { name: 'キーワードを消す' })).toBeNull();
});

test('↓ を押した場合、1 件目から順に選び、末尾の次は先頭へ戻る', () => {
  vi.useFakeTimers();
  renderDialog();
  typeQuery('css');
  fireEvent.keyDown(getInput(), { key: 'Home' });

  fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
  expect(getSelectedId()).toBe('search-result-react-css');

  fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
  expect(getSelectedId()).toBe('search-result-css-basics');
});

test('何も選んでいない状態で ↑ を押した場合、末尾を選び、先頭の前は末尾へ戻る', () => {
  renderDialog({
    popularPosts: [
      { slug: 'p1', title: '記事 1' },
      { slug: 'p2', title: '記事 2' },
    ],
  });

  fireEvent.keyDown(getInput(), { key: 'ArrowUp' });
  expect(getSelectedId()).toBe('search-result-p2');

  fireEvent.keyDown(getInput(), { key: 'Home' });
  fireEvent.keyDown(getInput(), { key: 'ArrowUp' });
  expect(getSelectedId()).toBe('search-result-p2');
});

test('Home・End で先頭・末尾の行を選ぶ', () => {
  renderDialog({
    popularPosts: [
      { slug: 'p1', title: '記事 1' },
      { slug: 'p2', title: '記事 2' },
    ],
  });

  fireEvent.keyDown(getInput(), { key: 'End' });
  expect(getSelectedId()).toBe('search-result-p2');

  fireEvent.keyDown(getInput(), { key: 'Home' });
  expect(getSelectedId()).toBe('search-result-p1');
});

test('最近の検索とよく読まれている記事の境目でも、↓ で次の行へ 1 つずつ移る', () => {
  localStorage.setItem(RECENT_KEY, JSON.stringify(['css']));
  renderDialog();

  fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
  expect(getSelectedId()).toBe('search-recent-0');

  fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
  expect(getSelectedId()).toBe('search-result-popular-1');
});

test('一覧の行へ焦点が移っていても、キーで選択を動かし、焦点を入力欄へ戻す', () => {
  vi.useFakeTimers();
  renderDialog();
  typeQuery('css');
  const [first] = getOptions();
  first.focus();

  fireEvent.keyDown(first, { key: 'ArrowDown' });

  expect(getSelectedId()).toBe('search-result-react-css');
  expect(document.activeElement).toBe(getInput());
});

test('選択中の記事で Enter を押した場合、引いた語を最近の検索へ残し、閉じる要求を出して記事へ移動する', () => {
  vi.useFakeTimers();
  const { onRequestCloseAction } = renderDialog();
  typeQuery('css');

  fireEvent.keyDown(getInput(), { key: 'Enter' });

  expect(router.push).toHaveBeenCalledWith('/css-basics.html');
  expect(onRequestCloseAction).toHaveBeenCalledTimes(1);
  expect(JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')).toEqual(['css']);
});

test('未入力でよく読まれている記事を Enter で開いた場合、語は残さず、閉じる要求を出して記事へ移動する', () => {
  const { onRequestCloseAction } = renderDialog();
  fireEvent.keyDown(getInput(), { key: 'ArrowDown' });

  fireEvent.keyDown(getInput(), { key: 'Enter' });

  expect(router.push).toHaveBeenCalledWith('/popular-1.html');
  expect(onRequestCloseAction).toHaveBeenCalledTimes(1);
  expect(localStorage.getItem(RECENT_KEY)).toBeNull();
});

test('記事のリンクを押した場合、引いた語を最近の検索へ残して閉じる要求を出す', () => {
  vi.useFakeTimers();
  const { onRequestCloseAction } = renderDialog();
  typeQuery('css');
  const [link] = getOptions();
  // 既定の動作を止めずに click しない。jsdom が未実装の画面遷移を起こすため
  link.addEventListener('click', (event) => event.preventDefault());

  fireEvent.click(link);

  expect(onRequestCloseAction).toHaveBeenCalledTimes(1);
  expect(JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')).toEqual(['css']);
});

test('選択中の最近の検索で Enter を押した場合、その語を入力欄に入れてすぐ検索し、記事へは移動しない', () => {
  localStorage.setItem(RECENT_KEY, JSON.stringify(['css']));
  renderDialog();
  fireEvent.keyDown(getInput(), { key: 'ArrowDown' });

  fireEvent.keyDown(getInput(), { key: 'Enter' });

  expect(getInput().value).toBe('css');
  expect(getOptionTexts()).toEqual(['CSS の基礎', 'React と CSS の設計']);
  expect(router.push).not.toHaveBeenCalled();
});

test('最近の検索をクリックした場合、その語で検索し直し、入力欄に焦点を戻す', () => {
  localStorage.setItem(RECENT_KEY, JSON.stringify(['next.js']));
  renderDialog();
  const chip = screen.getByRole('option', { name: 'next.js' });
  chip.focus();

  fireEvent.click(chip);

  expect(getInput().value).toBe('next.js');
  expect(getOptionTexts()).toEqual(['Next.js 入門']);
  expect(document.activeElement).toBe(getInput());
});

test('結果が 0 件の最近の検索をクリックした場合も、入力欄に焦点を戻す', () => {
  localStorage.setItem(RECENT_KEY, JSON.stringify(['zzqqxx']));
  renderDialog();
  const chip = screen.getByRole('option', { name: 'zzqqxx' });
  chip.focus();

  fireEvent.click(chip);

  expect(screen.getByText('zzqqxx').closest('p')?.textContent).toBe('「zzqqxx」に一致する記事はありません');
  expect(document.activeElement).toBe(getInput());
});

test('Esc を押した場合、閉じる要求を出す', () => {
  const { onRequestCloseAction } = renderDialog();

  fireEvent.keyDown(getInput(), { key: 'Escape' });

  expect(onRequestCloseAction).toHaveBeenCalledTimes(1);
});

test('IME の変換中のキーは、操作として扱わない', () => {
  vi.useFakeTimers();
  const { onRequestCloseAction } = renderDialog();
  typeQuery('css');

  fireEvent.keyDown(getInput(), { key: 'Enter', isComposing: true });
  fireEvent.keyDown(getInput(), { key: 'Enter', keyCode: 229 });
  fireEvent.keyDown(getInput(), { key: 'Escape', isComposing: true });
  fireEvent.keyDown(getInput(), { key: 'ArrowDown', isComposing: true });

  expect(router.push).not.toHaveBeenCalled();
  expect(onRequestCloseAction).not.toHaveBeenCalled();
  expect(getSelectedId()).toBe('search-result-css-basics');
});

test('マウスが行の上で動いた場合だけ行を選び、そのときはスクロールしない', () => {
  vi.useFakeTimers();
  renderDialog();
  typeQuery('css');
  const [, second] = getOptions();
  scrollIntoView.mockClear();

  fireEvent.mouseEnter(second);
  expect(getSelectedId()).toBe('search-result-css-basics');

  fireEvent.mouseMove(second);
  expect(getSelectedId()).toBe('search-result-react-css');
  expect(scrollIntoView).not.toHaveBeenCalled();
});

function stubRect(element: Element, top: number, bottom: number) {
  element.getBoundingClientRect = () => ({
    top,
    bottom,
    height: bottom - top,
    left: 0,
    right: 100,
    width: 100,
    x: 0,
    y: top,
    toJSON: () => ({}),
  });
}

test('選んだ行が一覧の下にはみ出す場合、一覧自体をスクロールして見せる', () => {
  vi.useFakeTimers();
  renderDialog();
  typeQuery('css');
  const list = screen.getByRole('listbox');
  list.scrollTop = 100;
  stubRect(list, 0, 200);
  stubRect(getOptions()[1], 220, 260);
  scrollTo.mockClear();

  fireEvent.keyDown(getInput(), { key: 'ArrowDown' });

  expect(scrollTo).toHaveBeenCalledWith({ top: 160, behavior: 'auto' });
});

test('一覧が自分ではスクロールしない低い画面でも、選んだ行を外側のスクロールで見える位置へ動かす', () => {
  vi.useFakeTimers();
  renderDialog();
  typeQuery('css');
  stubRect(screen.getByRole('listbox'), 0, 200);
  stubRect(getOptions()[1], 40, 80);
  scrollTo.mockClear();
  scrollIntoView.mockClear();

  fireEvent.keyDown(getInput(), { key: 'ArrowDown' });

  expect(scrollTo).not.toHaveBeenCalled();
  expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
});

test('最近の検索の語を ↓ で選んだ場合も、その語を見える位置へ動かす', () => {
  localStorage.setItem(RECENT_KEY, JSON.stringify(['css']));
  renderDialog();
  scrollIntoView.mockClear();

  fireEvent.keyDown(getInput(), { key: 'ArrowDown' });

  expect(scrollIntoView.mock.contexts).toHaveLength(1);
  expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByRole('option', { name: 'css' }));
});

test('選択が外れた場合、一覧を先頭へ戻す', () => {
  vi.useFakeTimers();
  renderDialog();
  typeQuery('css');
  scrollTo.mockClear();

  fireEvent.change(getInput(), { target: { value: 'react' } });

  expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
});

test('検索した語を、時刻つきで sessionStorage に保存する', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  renderDialog();

  typeQuery('css');

  expect(JSON.parse(sessionStorage.getItem(STATE_KEY) ?? 'null')).toEqual({ query: 'css', timestamp: Date.now() });
});

test('保存された語がある場合、開いたときに入力欄へ戻し、結果を計算し直して 1 件目を選ぶ', () => {
  sessionStorage.setItem(STATE_KEY, JSON.stringify({ query: 'css', timestamp: Date.now() }));
  renderDialog();

  expect(getInput().value).toBe('css');
  expect(getOptionTexts()).toEqual(['CSS の基礎', 'React と CSS の設計']);
  expect(getSelectedId()).toBe('search-result-css-basics');
});

test('保存された語がある場合、エンジンの読み込みが済むのを待って結果を出す', async () => {
  sessionStorage.setItem(STATE_KEY, JSON.stringify({ query: 'css', timestamp: Date.now() }));
  const finishLoading = stubEngineLoading();
  renderDialog();

  expect(getInput().value).toBe('css');
  expect(screen.queryByRole('listbox')).toBeNull();

  await finishLoading();

  expect(getOptionTexts()).toEqual(['CSS の基礎', 'React と CSS の設計']);
});

test('復元した語は、開き直すたびに保存し直して期限を延ばす', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  sessionStorage.setItem(STATE_KEY, JSON.stringify({ query: 'css', timestamp: Date.now() - 20 * MINUTE }));

  renderDialog();

  expect(JSON.parse(sessionStorage.getItem(STATE_KEY) ?? 'null')).toEqual({ query: 'css', timestamp: Date.now() });
});

test.each([
  ['30 分を超えた', { query: 'css', timestamp: Date.now() - 31 * MINUTE }],
  ['語が空の', { query: '', timestamp: Date.now() }],
  ['語が文字列でない', { query: 1, timestamp: Date.now() }],
  ['時刻が無い', { query: 'css' }],
])('%s保存値の場合、復元せず、保存した値を捨てる', (_label, saved) => {
  sessionStorage.setItem(STATE_KEY, JSON.stringify(saved));
  renderDialog();

  expect(getInput().value).toBe('');
  expect(screen.getByRole('listbox', { name: '検索の候補' })).toBeDefined();
  expect(sessionStorage.getItem(STATE_KEY)).toBeNull();
});

test('記事を開いた場合、引いた語を最近の検索の先頭へ足して localStorage に保存する', () => {
  vi.useFakeTimers();
  localStorage.setItem(RECENT_KEY, JSON.stringify(['Next.js']));
  renderDialog();
  typeQuery('css');

  fireEvent.keyDown(getInput(), { key: 'Enter' });

  expect(JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')).toEqual(['css', 'Next.js']);
});

test('大文字小文字・全角半角だけが違う語は、重複させず先頭へ移す', () => {
  vi.useFakeTimers();
  localStorage.setItem(RECENT_KEY, JSON.stringify(['Next.js', 'ＣＳＳ']));
  renderDialog();
  typeQuery('css');

  fireEvent.keyDown(getInput(), { key: 'Enter' });

  expect(JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')).toEqual(['css', 'Next.js']);
});

test('最近の検索が上限（5 件）を超える場合、古い語から落とす', () => {
  vi.useFakeTimers();
  localStorage.setItem(RECENT_KEY, JSON.stringify(['a', 'b', 'c', 'd', 'e']));
  renderDialog();
  typeQuery('css');

  fireEvent.keyDown(getInput(), { key: 'Enter' });

  expect(JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')).toEqual(['css', 'a', 'b', 'c', 'd']);
});

test('開いた後に別のタブが語を保存していた場合、その語を失わずに足す', () => {
  vi.useFakeTimers();
  renderDialog();
  localStorage.setItem(RECENT_KEY, JSON.stringify(['別のタブの語']));
  typeQuery('css');

  fireEvent.keyDown(getInput(), { key: 'Enter' });

  expect(JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')).toEqual(['css', '別のタブの語']);
});

test('Esc などの cancel が届いた場合、dialog 既定の閉じ方を止めて、閉じる要求を出す', () => {
  const { onRequestCloseAction, onClosedAction } = renderDialog();
  const cancel = new Event('cancel', { cancelable: true });

  fireEvent(getDialog(), cancel);

  expect(cancel.defaultPrevented).toBe(true);
  expect(onRequestCloseAction).toHaveBeenCalledTimes(1);
  expect(onClosedAction).not.toHaveBeenCalled();
});

test('背景（dialog 自身）を押した場合は閉じる要求を出し、中を押した場合は出さない', () => {
  const { onRequestCloseAction } = renderDialog();

  fireEvent.click(getInput());
  expect(onRequestCloseAction).not.toHaveBeenCalled();

  fireEvent.click(getDialog());
  expect(onRequestCloseAction).toHaveBeenCalledTimes(1);
});

test('閉じるボタンを押した場合、閉じる要求を出す', () => {
  const { onRequestCloseAction } = renderDialog();

  fireEvent.click(screen.getByRole('button', { name: '検索を閉じる' }));

  expect(onRequestCloseAction).toHaveBeenCalledTimes(1);
});

test('cancel を止められず dialog が先に閉じた場合、閉じる途中を挟まず、閉じ終えたことを知らせる', () => {
  const { onRequestCloseAction, onClosedAction } = renderDialog();

  fireEvent(getDialog(), new Event('close'));

  expect(onClosedAction).toHaveBeenCalledTimes(1);
  expect(onRequestCloseAction).not.toHaveBeenCalled();
});

test('閉じる途中の場合、閉じるアニメーションの印を付ける', () => {
  renderDialog({ isClosing: true });

  expect(getDialog().getAttribute('data-closing')).toBe('true');
});

test.each(['zoomOut', 'fadeOut'])(
  '閉じるアニメーション（%s）が終わった場合、dialog を閉じて閉じ終えたことを知らせる',
  (animationName) => {
    const { onClosedAction } = renderDialog({ isClosing: true });

    fireEvent.animationEnd(getDialog(), { animationName });

    expect(closeDialog).toHaveBeenCalledTimes(1);
    expect(onClosedAction).toHaveBeenCalledTimes(1);
  },
);

test('開くアニメーションや、中の要素のアニメーションが終わっても、閉じない', () => {
  const { onClosedAction } = renderDialog({ isClosing: true });

  fireEvent.animationEnd(getDialog(), { animationName: 'zoomIn' });
  fireEvent.animationEnd(getInput(), { animationName: 'zoomOut' });

  expect(closeDialog).not.toHaveBeenCalled();
  expect(onClosedAction).not.toHaveBeenCalled();
});
