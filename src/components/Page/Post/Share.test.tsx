import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PostShare } from './Share';

const PERMALINK = 'https://example.com/post.html';
const SUCCESS_TOAST = '記事のURLをコピーしました！🎉シェアをお願いします！🙏';

const originalClipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

function mockClipboard(writeText: (text: string) => Promise<void>) {
  const clipboard = { writeText: vi.fn(writeText) };

  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: clipboard,
  });

  return clipboard;
}

function renderShare() {
  return render(<PostShare title="記事のタイトル" url={PERMALINK} />);
}

describe('PostShare', () => {
  beforeEach(() => {
    Reflect.deleteProperty(navigator, 'clipboard');
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    Reflect.deleteProperty(navigator, 'share');

    if (originalClipboardDescriptor) {
      Object.defineProperty(navigator, 'clipboard', originalClipboardDescriptor);
    } else {
      Reflect.deleteProperty(navigator, 'clipboard');
    }
  });

  it('コピーに成功した場合、URL を書き込み、ボタンの名前を成功にして、トーストを出す', async () => {
    const clipboard = mockClipboard(async () => undefined);
    renderShare();

    fireEvent.click(screen.getByRole('button', { name: 'ページのURLをコピー' }));

    await screen.findByRole('button', { name: 'コピーしました' });
    expect(clipboard.writeText).toHaveBeenCalledWith(PERMALINK);
    expect(screen.getByRole('status').textContent).toBe(SUCCESS_TOAST);
  });

  it('コピーに失敗した場合、ボタンの名前を失敗にして、失敗のトーストを出し、原因を console.error に出す', async () => {
    const error = new Error('denied');
    mockClipboard(async () => {
      throw error;
    });
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderShare();

    fireEvent.click(screen.getByRole('button', { name: 'ページのURLをコピー' }));

    await screen.findByRole('button', { name: 'コピーに失敗しました' });
    expect(screen.getByRole('status').textContent).toBe('コピーに失敗しました');
    expect(consoleError).toHaveBeenCalledWith('[PostShare] Failed to copy text:', error);
  });

  it('Clipboard API が使えない場合、コピーのボタンを無効にする', () => {
    renderShare();

    const button = screen.getByRole('button', { name: 'このブラウザはコピーに未対応' });

    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it('コピーの結果は 2 秒後に、ボタンの名前もトーストも元に戻る', async () => {
    vi.useFakeTimers();
    mockClipboard(async () => undefined);
    renderShare();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'ページのURLをコピー' }));
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(screen.getByRole('button', { name: 'コピーしました' })).toBeDefined();
    expect(screen.getByRole('status').textContent).toBe(SUCCESS_TOAST);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    expect(screen.getByRole('button', { name: 'ページのURLをコピー' })).toBeDefined();
    expect(screen.getByRole('status').textContent).toBe('');
  });

  it('Web Share API が使える場合、共有ボタンでタイトルと URL を渡す', () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { configurable: true, value: share });
    renderShare();

    fireEvent.click(screen.getByRole('button', { name: 'その他：共有' }));

    expect(share).toHaveBeenCalledWith({ title: '記事のタイトル', url: PERMALINK, text: '記事のタイトル' });
  });

  it('Web Share API が使えない場合、共有ボタンを無効にする', () => {
    renderShare();

    expect((screen.getByRole('button', { name: '共有に未対応' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('Google のニュースのボタンは、publisher.js が置き換える目印の要素として描画する', () => {
    const { container } = renderShare();

    expect(container.querySelector('[google-add-preferred-source-btn]')?.getAttribute('data-lang')).toBe('ja');
  });
});
