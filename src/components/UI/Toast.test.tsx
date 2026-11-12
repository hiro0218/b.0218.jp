import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { Toast, useToast } from './Toast';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

it('showToast を呼ぶと表示し、2 秒後に自動で隠す', () => {
  const { result } = renderHook(() => useToast('コピーしました'));
  expect(result.current.isVisible).toBe(false);

  act(() => result.current.showToast());
  expect(result.current.isVisible).toBe(true);
  expect(result.current.message).toBe('コピーしました');

  act(() => {
    vi.advanceTimersByTime(1999);
  });
  expect(result.current.isVisible).toBe(true);

  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(result.current.isVisible).toBe(false);
});

it('showToast にメッセージを渡した場合はそのメッセージを、省略した場合は初期のメッセージを表示する', () => {
  const { result } = renderHook(() => useToast('初期のメッセージ'));

  act(() => result.current.showToast('別のメッセージ'));
  expect(result.current.message).toBe('別のメッセージ');

  act(() => result.current.showToast());
  expect(result.current.message).toBe('初期のメッセージ');
});

it('表示中にもう一度 showToast を呼んだ場合、隠すまでの 2 秒を数え直す', () => {
  const { result } = renderHook(() => useToast('コピーしました'));

  act(() => result.current.showToast());
  act(() => {
    vi.advanceTimersByTime(1500);
  });
  act(() => result.current.showToast());
  act(() => {
    vi.advanceTimersByTime(1999);
  });
  expect(result.current.isVisible).toBe(true);

  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(result.current.isVisible).toBe(false);
});

it('hideToast を呼んだ場合、すぐに隠す', () => {
  const { result } = renderHook(() => useToast('コピーしました'));
  act(() => result.current.showToast());

  act(() => result.current.hideToast());

  expect(result.current.isVisible).toBe(false);
});

it('Toast は、表示中だけメッセージを描画し、押すと onHideToast を呼ぶ', () => {
  const onHideToast = vi.fn();
  const { rerender } = render(<Toast isVisible={false} message="コピーしました" onHideToast={onHideToast} />);
  expect(screen.getByRole('status').textContent).toBe('');

  rerender(<Toast isVisible={true} message="コピーしました" onHideToast={onHideToast} />);
  expect(screen.getByRole('status').textContent).toBe('コピーしました');

  fireEvent.click(screen.getByRole('status'));
  expect(onHideToast).toHaveBeenCalledTimes(1);
});
