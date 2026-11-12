import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { PageScroll } from './PageScroll';

vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
  callback(0);
  return 0;
});

function scrollTo(y: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: y });
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

function isShown() {
  // hidden を除いて探さない。隠している間は visibility: hidden で読み上げの対象から外れ、見つからなくなるため
  const button = screen.getByRole('button', { hidden: true, name: 'ページトップへ' });
  const root = button.closest('[data-is-shown]');
  // 属性が無いときに false を返さない。属性名を変えたとき、「出さない」の検査が空振りで通るため
  if (!root) throw new Error('data-is-shown を持つ要素が見つからない');

  return root.getAttribute('data-is-shown') === 'true';
}

afterEach(() => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
  vi.restoreAllMocks();
});

test('先頭の場合は出さない', () => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
  render(<PageScroll />);

  expect(isShown()).toBe(false);
});

test('読み進めている（下へスクロールしている）間は出さず、上へ戻した場合に出す', () => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
  render(<PageScroll />);

  scrollTo(600);
  expect(isShown()).toBe(false);

  scrollTo(500);
  expect(isShown()).toBe(true);

  scrollTo(700);
  expect(isShown()).toBe(false);
});

test('上へ戻しても、先頭から 120px 以内の場合は出さない', () => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
  render(<PageScroll />);
  scrollTo(300);

  scrollTo(100);

  expect(isShown()).toBe(false);
});

test('動きを減らす設定の場合、ボタンを押すと先頭へ即座に移動する', () => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: true } as MediaQueryList);
  const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  render(<PageScroll />);

  fireEvent.click(screen.getByRole('button', { hidden: true, name: 'ページトップへ' }));

  expect(scrollToSpy).toHaveBeenCalledOnce();
  expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
});

test('動きを減らす設定でない場合、ボタンを押すと先頭へなめらかに移動する', () => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList);
  const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  render(<PageScroll />);

  fireEvent.click(screen.getByRole('button', { hidden: true, name: 'ページトップへ' }));

  expect(scrollToSpy).toHaveBeenCalledOnce();
  expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
});
