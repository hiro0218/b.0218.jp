import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { isCopyResultState, useClipboardCopy } from './useClipboardCopy';

const originalClipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

function mockClipboard(writeText: (text: string) => Promise<void>) {
  const clipboard = { writeText: vi.fn(writeText) };

  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: clipboard,
  });

  return clipboard;
}

function renderCopyHook() {
  return renderHook(() => useClipboardCopy('ページのURLをコピー'));
}

async function copyOnce(result: { current: ReturnType<typeof useClipboardCopy> }, text = 'https://example.com') {
  let returned: Awaited<ReturnType<typeof result.current.copy>> | undefined;
  await act(async () => {
    returned = await result.current.copy(text);
  });
  return returned;
}

describe('useClipboardCopy', () => {
  beforeEach(() => {
    Reflect.deleteProperty(navigator, 'clipboard');
  });

  afterEach(() => {
    vi.useRealTimers();

    if (originalClipboardDescriptor) {
      Object.defineProperty(navigator, 'clipboard', originalClipboardDescriptor);
    } else {
      Reflect.deleteProperty(navigator, 'clipboard');
    }
  });

  it('Clipboard API が使える場合、idle の状態と、呼び出し側が渡した操作名を返す', () => {
    mockClipboard(async () => undefined);

    const { result } = renderCopyHook();

    expect(result.current.state).toBe('idle');
    expect(result.current.label).toBe('ページのURLをコピー');
  });

  it('Clipboard API に text を書き込めた場合、copied と成功の文言を返し、成功の状態と文言にする', async () => {
    const clipboard = mockClipboard(async () => undefined);
    const { result } = renderCopyHook();

    const copyResult = await copyOnce(result);

    expect(copyResult).toEqual({ status: 'copied', label: 'コピーしました' });
    expect(clipboard.writeText).toHaveBeenCalledWith('https://example.com');
    expect(result.current.state).toBe('copied');
    expect(result.current.label).toBe('コピーしました');
  });

  it.each([
    ['navigator.clipboard プロパティが存在しない', () => {}],
    [
      'navigator.clipboard が undefined にセットされている',
      () => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }),
    ],
    [
      'navigator.clipboard は存在するが writeText が関数でない',
      () => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {} }),
    ],
  ])('%s場合、押す前から unsupported の状態にし、copy は何もせず null を返す', async (_name, arrange) => {
    arrange();
    const { result } = renderCopyHook();

    const copyResult = await copyOnce(result);

    expect(copyResult).toBeNull();
    expect(result.current.state).toBe('unsupported');
    expect(result.current.label).toBe('このブラウザはコピーに未対応');
  });

  it('描画のあとで Clipboard API が使えなくなった場合、unsupported と未対応の文言を返し、idle へ戻す予約をしない', async () => {
    vi.useFakeTimers();
    mockClipboard(async () => undefined);
    const { result } = renderCopyHook();
    Reflect.deleteProperty(navigator, 'clipboard');

    const copyResult = await copyOnce(result);

    expect(copyResult).toEqual({ status: 'unsupported', label: 'このブラウザはコピーに未対応' });
    expect(result.current.state).toBe('unsupported');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('Clipboard API が reject した場合、failed・Error・失敗の文言を返し、失敗の状態と文言にする', async () => {
    const error = new Error('denied');
    mockClipboard(async () => {
      throw error;
    });
    const { result } = renderCopyHook();

    const copyResult = await copyOnce(result);

    expect(copyResult).toEqual({ status: 'failed', error, label: 'コピーに失敗しました' });
    expect(result.current.state).toBe('failed');
    expect(result.current.label).toBe('コピーに失敗しました');
  });

  it('Error 以外の値が throw された場合、Error にラップして返す', async () => {
    mockClipboard(async () => {
      throw 'permission denied';
    });
    const { result } = renderCopyHook();

    const copyResult = await copyOnce(result);

    expect(copyResult?.status).toBe('failed');
    if (copyResult?.status === 'failed') {
      expect(copyResult.error).toBeInstanceOf(Error);
      expect(copyResult.error.message).toBe('permission denied');
    }
  });

  it('書き込み中の場合、copying の状態にし、もう一度 copy を呼んでも何もせず null を返す', async () => {
    const write = Promise.withResolvers<void>();
    const clipboard = mockClipboard(() => write.promise);
    const { result } = renderCopyHook();

    let firstCopy: Promise<unknown> = Promise.resolve();
    act(() => {
      firstCopy = result.current.copy('first');
    });
    const secondResult = await copyOnce(result, 'second');

    expect(result.current.state).toBe('copying');
    expect(result.current.label).toBe('コピー中');
    expect(secondResult).toBeNull();
    expect(clipboard.writeText).toHaveBeenCalledTimes(1);

    await act(async () => {
      write.resolve();
      await firstCopy;
    });

    expect(result.current.state).toBe('copied');
  });

  it.each([
    ['成功', async () => undefined],
    [
      '失敗',
      async () => {
        throw new Error('denied');
      },
    ],
  ])('%sの状態は 2 秒後に idle へ戻り、操作名も元に戻る', async (_name, writeText) => {
    vi.useFakeTimers();
    mockClipboard(writeText);
    const { result } = renderCopyHook();

    await copyOnce(result);
    act(() => {
      vi.advanceTimersByTime(1999);
    });
    expect(result.current.state).not.toBe('idle');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current.state).toBe('idle');
    expect(result.current.label).toBe('ページのURLをコピー');
  });

  it('結果を表示している間に次のコピーを始めた場合、書き込み中に前の結果の idle 戻しが割り込まない', async () => {
    vi.useFakeTimers();
    const secondWrite = Promise.withResolvers<void>();
    let writeCount = 0;
    mockClipboard(() => {
      writeCount += 1;
      if (writeCount === 1) return Promise.resolve();
      return secondWrite.promise;
    });
    const { result } = renderCopyHook();

    await copyOnce(result);
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    let secondCopy: Promise<unknown> = Promise.resolve();
    act(() => {
      secondCopy = result.current.copy('second');
    });
    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(result.current.state).toBe('copying');

    await act(async () => {
      secondWrite.resolve();
      await secondCopy;
    });
  });

  it('結果を表示している間にもう一度コピーした場合、idle へ戻るまでの 2 秒を数え直す', async () => {
    vi.useFakeTimers();
    mockClipboard(async () => undefined);
    const { result } = renderCopyHook();

    await copyOnce(result);
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    await copyOnce(result);
    act(() => {
      vi.advanceTimersByTime(1999);
    });
    expect(result.current.state).toBe('copied');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current.state).toBe('idle');
  });
});

it.each([
  ['idle', false],
  ['copying', false],
  ['copied', true],
  ['failed', true],
  ['unsupported', true],
] as const)('%s の場合、結果を見せている状態かの判定は %s を返す', (state, expected) => {
  expect(isCopyResultState(state)).toBe(expected);
});
