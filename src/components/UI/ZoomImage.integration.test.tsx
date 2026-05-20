import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ZoomImage } from './ZoomImage';

describe('ZoomImage integration', () => {
  const originalStartViewTransition = document.startViewTransition;
  const originalShowModal = HTMLDialogElement.prototype.showModal;
  const originalClose = HTMLDialogElement.prototype.close;

  beforeEach(() => {
    document.startViewTransition = undefined;
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value() {
        this.setAttribute('open', '');
      },
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      value() {
        this.removeAttribute('open');
      },
    });
  });

  afterEach(() => {
    document.startViewTransition = originalStartViewTransition;
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value: originalShowModal,
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      value: originalClose,
    });
    cleanup();
  });

  it('画像 load 後に zoom trigger 化し、dialog を open / close できる', async () => {
    render(<ZoomImage alt="統合テスト画像" src="/test.jpg" />);

    const image = screen.getByAltText('統合テスト画像');
    Object.defineProperties(image, {
      naturalHeight: { configurable: true, value: 480 },
      naturalWidth: { configurable: true, value: 640 },
    });

    fireEvent.load(image);

    const trigger = await screen.findByRole('button', { name: '統合テスト画像' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: '統合テスト画像' });
    expect(dialog.hasAttribute('open')).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(within(dialog).getByRole('button', { name: '閉じる' }));

    expect(dialog.hasAttribute('open')).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
