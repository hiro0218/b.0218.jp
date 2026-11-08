import { fireEvent, render, screen } from '@testing-library/react';
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

test('クリックでフォーカスが移らない場合も、開いた直後に Esc を押すと閉じ、トリガーにフォーカスがある', () => {
  render(<HeaderNavigation />);
  const toggle = screen.getByRole('button', { name: 'ナビゲーションを開く' });
  fireEvent.click(toggle);

  fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });

  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(document.activeElement).toBe(toggle);
});
