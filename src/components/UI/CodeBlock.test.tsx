import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CodeBlock } from './CodeBlock';

const originalClipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

function mockClipboard(writeText: (text: string) => Promise<void>) {
  const clipboard = { writeText: vi.fn(writeText) };

  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: clipboard,
  });

  return clipboard;
}

function renderCodeBlock() {
  return render(
    <CodeBlock>
      <code>const answer = 42;</code>
    </CodeBlock>,
  );
}

function renderMultipleCodeBlocks() {
  return render(
    <>
      <CodeBlock>
        <code>const first = 1;</code>
      </CodeBlock>
      <CodeBlock>
        <code>const second = 2;</code>
      </CodeBlock>
    </>,
  );
}

describe('CodeBlock', () => {
  beforeEach(() => {
    Reflect.deleteProperty(navigator, 'clipboard');
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();

    if (originalClipboardDescriptor) {
      Object.defineProperty(navigator, 'clipboard', originalClipboardDescriptor);
    } else {
      Reflect.deleteProperty(navigator, 'clipboard');
    }
  });

  it('初期状態ではコピー可能な button を描画する', () => {
    renderCodeBlock();

    const button = screen.getByRole('button', { name: 'コードをコピー' });

    expect(button.getAttribute('data-state')).toBe('idle');
    expect(button.getAttribute('aria-disabled')).toBeNull();
  });

  it('Clipboard API に書き込めた場合、成功状態を表示する', async () => {
    const clipboard = mockClipboard(async () => undefined);
    renderCodeBlock();

    fireEvent.click(screen.getByRole('button', { name: 'コードをコピー' }));

    const button = await screen.findByRole('button', { name: 'コピーしました' });
    expect(clipboard.writeText).toHaveBeenCalledWith('const answer = 42;');
    expect(button.getAttribute('data-state')).toBe('copied');
    expect(screen.getByRole('status').textContent).toBe('コピーしました');
  });

  it('複数のコードブロックがある場合、クリックした button と同じブロックの内容をコピーする', async () => {
    const clipboard = mockClipboard(async () => undefined);
    renderMultipleCodeBlocks();

    const buttons = screen.getAllByRole('button', { name: 'コードをコピー' });
    fireEvent.click(buttons[1]);

    await screen.findByRole('button', { name: 'コピーしました' });
    expect(clipboard.writeText).toHaveBeenCalledWith('const second = 2;');
  });

  it('Clipboard API が reject した場合、失敗状態を表示する', async () => {
    mockClipboard(async () => {
      throw new Error('denied');
    });
    renderCodeBlock();

    fireEvent.click(screen.getByRole('button', { name: 'コードをコピー' }));

    const button = await screen.findByRole('button', { name: 'コピーに失敗しました' });
    expect(button.getAttribute('data-state')).toBe('failed');
    expect(screen.getByRole('status').textContent).toBe('コピーに失敗しました');
  });

  it('Clipboard API が使えない場合、unsupported 状態にして button を aria-disabled にする', async () => {
    renderCodeBlock();

    fireEvent.click(screen.getByRole('button', { name: 'コードをコピー' }));

    const button = await screen.findByRole('button', { name: 'このブラウザはコピーに未対応' });
    expect(button.getAttribute('data-state')).toBe('unsupported');
    expect(button.getAttribute('aria-disabled')).toBe('true');
  });

  it('コピー中の場合、button を aria-disabled にする', async () => {
    let resolveCopy: () => void = () => {};
    mockClipboard(
      () =>
        new Promise<void>((resolve) => {
          resolveCopy = resolve;
        }),
    );
    renderCodeBlock();

    fireEvent.click(screen.getByRole('button', { name: 'コードをコピー' }));

    const button = await screen.findByRole('button', { name: 'コピー中' });
    expect(button.getAttribute('data-state')).toBe('copying');
    expect(button.getAttribute('aria-disabled')).toBe('true');

    await act(async () => {
      resolveCopy();
    });
  });

  it('成功状態は一定時間後に idle へ戻る', async () => {
    vi.useFakeTimers();
    mockClipboard(async () => undefined);
    renderCodeBlock();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'コードをコピー' }));
      await Promise.resolve();
    });

    expect(screen.getByRole('button', { name: 'コピーしました' }).getAttribute('data-state')).toBe('copied');

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByRole('button', { name: 'コードをコピー' }).getAttribute('data-state')).toBe('idle');
  });
});
