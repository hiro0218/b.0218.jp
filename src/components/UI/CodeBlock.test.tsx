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
    cleanup();

    if (originalClipboardDescriptor) {
      Object.defineProperty(navigator, 'clipboard', originalClipboardDescriptor);
    } else {
      Reflect.deleteProperty(navigator, 'clipboard');
    }
  });

  it('初期状態ではコピー可能な button を描画する', () => {
    mockClipboard(async () => undefined);
    renderCodeBlock();

    const button = screen.getByRole('button', { name: 'コードをコピー' });

    expect(button.getAttribute('aria-disabled')).toBeNull();
  });

  it('pre を描画する場合、横にスクロールするコードをキーボードで動かせるよう tabindex=0 を付ける', () => {
    const { container } = renderCodeBlock();

    expect(container.querySelector('pre')?.getAttribute('tabindex')).toBe('0');
  });

  it('Clipboard API に書き込めた場合、成功状態を表示する', async () => {
    const clipboard = mockClipboard(async () => undefined);
    renderCodeBlock();

    fireEvent.click(screen.getByRole('button', { name: 'コードをコピー' }));

    await screen.findByRole('button', { name: 'コピーしました' });
    expect(clipboard.writeText).toHaveBeenCalledWith('const answer = 42;');
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

    await screen.findByRole('button', { name: 'コピーに失敗しました' });
    expect(screen.getByRole('status').textContent).toBe('コピーに失敗しました');
  });

  it('Clipboard API が使えない場合、押す前から未対応の表示にして button を aria-disabled にする', () => {
    renderCodeBlock();

    const button = screen.getByRole('button', { name: 'このブラウザはコピーに未対応' });
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(screen.getByRole('status').textContent).toBe('このブラウザはコピーに未対応');
  });

  it('コードが空の場合、押しても書き込まず、状態を変えない', () => {
    const clipboard = mockClipboard(async () => undefined);
    render(<CodeBlock>{''}</CodeBlock>);

    fireEvent.click(screen.getByRole('button', { name: 'コードをコピー' }));

    expect(clipboard.writeText).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'コードをコピー' }).getAttribute('aria-disabled')).toBeNull();
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
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(screen.getByRole('status').textContent).toBe('');

    await act(async () => {
      resolveCopy();
    });
  });
});
