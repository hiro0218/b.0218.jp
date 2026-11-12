import { act, fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

import { HeaderNavigation } from './Navigation';

window.matchMedia = vi.fn().mockReturnValue({
  matches: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
} as unknown as MediaQueryList);

test('展開中にナビの中で Esc を押した場合、閉じてトリガーへフォーカスを戻す', () => {
  render(<HeaderNavigation />);
  const toggle = screen.getByRole('button', { name: 'ナビゲーションを開く' });
  fireEvent.click(toggle);
  const link = screen.getByRole('link', { name: 'tags' });
  link.focus();

  fireEvent.keyDown(link, { key: 'Escape' });

  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(document.activeElement).toBe(toggle);
});

test('展開中に別の dialog（検索など）の中で Esc を押した場合、ナビは閉じない', () => {
  render(
    <>
      <HeaderNavigation />
      <dialog open>
        <button type="button">検索を閉じる</button>
      </dialog>
    </>,
  );
  const toggle = screen.getByRole('button', { name: 'ナビゲーションを開く' });
  fireEvent.click(toggle);

  fireEvent.keyDown(screen.getByRole('button', { name: '検索を閉じる' }), { key: 'Escape' });

  expect(toggle.getAttribute('aria-expanded')).toBe('true');
});

test('展開中にナビの項目を押した場合、閉じる', () => {
  render(<HeaderNavigation />);
  const toggle = screen.getByRole('button', { name: 'ナビゲーションを開く' });
  fireEvent.click(toggle);

  // 遷移を止める。jsdom は遷移を実装しておらず、押すと警告を出すため
  const link = screen.getByRole('link', { name: 'tags' });
  link.addEventListener('click', (event) => event.preventDefault());
  fireEvent.click(link);

  expect(toggle.getAttribute('aria-expanded')).toBe('false');
});

test('展開中にナビの外を操作した場合、閉じる', () => {
  render(
    <>
      <HeaderNavigation />
      <button type="button">ナビの外</button>
    </>,
  );
  const toggle = screen.getByRole('button', { name: 'ナビゲーションを開く' });
  fireEvent.click(toggle);

  // 領域の外の操作は pointerdown とその後の click の組で判定される（useDisclosure.test.tsx と同じ）
  const outside = screen.getByRole('button', { name: 'ナビの外' });
  fireEvent.pointerDown(outside);
  fireEvent.click(outside);

  expect(toggle.getAttribute('aria-expanded')).toBe('false');
});

test('展開中にデスクトップ幅になった場合、閉じる', () => {
  const changeListeners: Array<(event: MediaQueryListEvent) => void> = [];
  vi.mocked(window.matchMedia).mockReturnValueOnce({
    matches: false,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => changeListeners.push(listener),
    removeEventListener: vi.fn(),
  } as unknown as MediaQueryList);
  render(<HeaderNavigation />);
  const toggle = screen.getByRole('button', { name: 'ナビゲーションを開く' });
  fireEvent.click(toggle);

  act(() => changeListeners[0]({ matches: true } as MediaQueryListEvent));

  expect(toggle.getAttribute('aria-expanded')).toBe('false');
});

test('クリックでフォーカスが移らない場合も、開いた直後に Esc を押すと閉じ、トリガーにフォーカスがある', () => {
  render(<HeaderNavigation />);
  const toggle = screen.getByRole('button', { name: 'ナビゲーションを開く' });
  fireEvent.click(toggle);

  fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });

  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(document.activeElement).toBe(toggle);
});
