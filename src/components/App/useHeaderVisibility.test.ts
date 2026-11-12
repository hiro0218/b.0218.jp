import { act, renderHook } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { HEADER_HEIGHT_PX } from '@/ui/styled/constant';
import { useHeaderVisibility, useIsScrolledPast } from './useHeaderVisibility';

vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
  callback(0);
  return 0;
});

function setScrollY(y: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: y });
}

function scrollTo(y: number) {
  setScrollY(y);
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

afterEach(() => {
  setScrollY(0);
});

test('下へスクロールして閾値を超えた場合はヘッダーを隠し、上へ戻した場合は表示する', () => {
  setScrollY(0);
  const { result } = renderHook(() => useHeaderVisibility());

  expect(result.current).toBe(true);

  scrollTo(200);
  expect(result.current).toBe(false);

  scrollTo(150);
  expect(result.current).toBe(true);
});

test('ヘッダーの高さちょうどまで下へスクロールした場合は、ヘッダーを隠さない', () => {
  setScrollY(0);
  const { result } = renderHook(() => useHeaderVisibility());

  scrollTo(HEADER_HEIGHT_PX);

  expect(result.current).toBe(true);
});

test('ヘッダーの高さを 1px 超えて下へスクロールした場合は、ヘッダーを隠す', () => {
  setScrollY(0);
  const { result } = renderHook(() => useHeaderVisibility());

  scrollTo(HEADER_HEIGHT_PX + 1);

  expect(result.current).toBe(false);
});

test('5px 未満の変化の場合は、表示を切り替えない', () => {
  setScrollY(200);
  const { result } = renderHook(() => useHeaderVisibility());
  expect(result.current).toBe(false);

  scrollTo(197);

  expect(result.current).toBe(false);
});

test('最初から閾値を超えた位置にいる場合は、隠した状態で始める', () => {
  setScrollY(500);

  const { result } = renderHook(() => useHeaderVisibility());

  expect(result.current).toBe(false);
});

test('複数の呼び出し元の場合も、判定は同じになる', () => {
  setScrollY(0);
  const first = renderHook(() => useHeaderVisibility());
  const second = renderHook(() => useHeaderVisibility());

  scrollTo(300);

  expect(first.result.current).toBe(false);
  expect(second.result.current).toBe(false);
});

test('後から現れた呼び出し元の場合も、前回のスクロール位置は先の呼び出し元と共有する', () => {
  setScrollY(0);
  const first = renderHook(() => useHeaderVisibility());
  scrollTo(200);
  // 5px 未満の変化は無視されるので、前回の位置は 200 のまま
  scrollTo(197);
  const second = renderHook(() => useHeaderVisibility());

  // 前回の位置（200）から 7px 戻った。後から現れた側が 197 を基準にすると、4px の変化として無視される
  scrollTo(193);

  expect(first.result.current).toBe(true);
  expect(second.result.current).toBe(true);
});

test('スクロール位置が threshold を超えた場合は true、先頭に戻った場合は false を返す', () => {
  setScrollY(0);
  const { result } = renderHook(() => useIsScrolledPast(120));
  expect(result.current).toBe(false);

  scrollTo(121);
  expect(result.current).toBe(true);

  scrollTo(120);
  expect(result.current).toBe(false);
});
