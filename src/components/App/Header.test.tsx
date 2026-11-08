import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest';

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

// jsdom には window.matchMedia が無く、実物の HeaderNavigation は mount 時に落ちるため、これだけ置き換える
vi.mock('./Header/Navigation', () => ({
  // biome-ignore lint/style/useNamingConvention: React component mock requires PascalCase
  HeaderNavigation: () => null,
}));

const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => router,
}));

vi.mock('~/dist/search.json', () => ({
  default: {
    searchIndex: { css: [0] },
    searchData: [{ slug: 'css-basics', title: 'CSS の基礎', tags: ['CSS'] }],
  },
}));

import { Header } from '@/components/App/Header';
import { SearchProvider } from '@/components/App/Search/SearchProvider';

beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.setAttribute('open', '');
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.removeAttribute('open');
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', { configurable: true, value: vi.fn() });
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() });
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

// 検索ダイアログは、最初のテストの中で初めて読み込ませない。全体の並列実行では、初回の読み込みが findBy の既定の待ち時間（1 秒）を超え、最初のテストが落ちるため
beforeAll(async () => {
  await import('@/components/App/Search/SearchDialog');
});

beforeEach(() => {
  router.push.mockClear();
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(cleanup);

function renderHeader() {
  render(
    <SearchProvider popularPosts={[]}>
      <Header />
    </SearchProvider>,
  );
}

test('ヘッダーの検索ボタンを押した場合、検索ダイアログを開いて、入力欄に焦点を置く', async () => {
  renderHeader();

  fireEvent.click(screen.getByRole('button', { name: '記事検索' }));

  const input = await screen.findByRole('combobox', { name: '検索キーワード' });
  expect(document.activeElement).toBe(input);
});

test('検索結果の記事を Enter で開いた場合、記事へ移動し、閉じるアニメーションの終わりでダイアログを外す', async () => {
  renderHeader();
  fireEvent.click(screen.getByRole('button', { name: '記事検索' }));
  const input = await screen.findByRole('combobox', { name: '検索キーワード' });

  fireEvent.change(input, { target: { value: 'css' } });
  await screen.findByRole('option', { name: 'CSS の基礎' });
  fireEvent.keyDown(input, { key: 'Enter' });

  expect(router.push).toHaveBeenCalledWith('/css-basics.html');
  const dialog = screen.getByRole('dialog', { name: '記事検索' });
  expect(dialog.getAttribute('data-closing')).toBe('true');

  fireEvent.animationEnd(dialog, { animationName: 'zoomOut' });

  expect(screen.queryByRole('dialog')).toBeNull();
});
