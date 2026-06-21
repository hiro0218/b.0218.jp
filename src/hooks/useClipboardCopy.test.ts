import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useClipboardCopy } from './useClipboardCopy';

const originalClipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

function mockClipboard(writeText: (text: string) => Promise<void>) {
  const clipboard = { writeText: vi.fn(writeText) };

  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: clipboard,
  });

  return clipboard;
}

describe('useClipboardCopy', () => {
  beforeEach(() => {
    Reflect.deleteProperty(navigator, 'clipboard');
  });

  afterEach(() => {
    if (originalClipboardDescriptor) {
      Object.defineProperty(navigator, 'clipboard', originalClipboardDescriptor);
    } else {
      Reflect.deleteProperty(navigator, 'clipboard');
    }
  });

  it('Clipboard API に text を書き込めた場合、copied を返す', async () => {
    const clipboard = mockClipboard(async () => undefined);
    const { result } = renderHook(() => useClipboardCopy());

    const copyResult = await result.current.copyText('https://example.com');

    expect(copyResult).toEqual({ status: 'copied' });
    expect(clipboard.writeText).toHaveBeenCalledWith('https://example.com');
  });

  it('navigator.clipboard プロパティが存在しない場合、unsupported を返す', async () => {
    const { result } = renderHook(() => useClipboardCopy());

    const copyResult = await result.current.copyText('https://example.com');

    expect(copyResult).toEqual({ status: 'unsupported' });
  });

  it('navigator.clipboard が undefined にセットされている場合、unsupported を返す', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
    const { result } = renderHook(() => useClipboardCopy());

    const copyResult = await result.current.copyText('https://example.com');

    expect(copyResult).toEqual({ status: 'unsupported' });
  });

  it('navigator.clipboard は存在するが writeText が関数でない場合、unsupported を返す', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {},
    });
    const { result } = renderHook(() => useClipboardCopy());

    const copyResult = await result.current.copyText('https://example.com');

    expect(copyResult).toEqual({ status: 'unsupported' });
  });

  it('Clipboard API が reject した場合、failed と Error を返す', async () => {
    const error = new Error('denied');
    mockClipboard(async () => {
      throw error;
    });
    const { result } = renderHook(() => useClipboardCopy());

    const copyResult = await result.current.copyText('https://example.com');

    expect(copyResult).toEqual({ status: 'failed', error });
  });

  it('Error 以外の値が throw された場合、Error にラップして返す', async () => {
    mockClipboard(async () => {
      throw 'permission denied';
    });
    const { result } = renderHook(() => useClipboardCopy());

    const copyResult = await result.current.copyText('https://example.com');

    expect(copyResult.status).toBe('failed');
    if (copyResult.status === 'failed') {
      expect(copyResult.error).toBeInstanceOf(Error);
      expect(copyResult.error.message).toBe('permission denied');
    }
  });
});
