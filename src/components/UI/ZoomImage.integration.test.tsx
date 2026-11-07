import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// chunk の取得失敗は、モジュール名前空間を thenable にして import() の拒否として再現する。
// 失敗させない間は then を関数にしない(通常の名前空間として解決される)。
let failDialogLoad = false;

// async factory の戻り値に呼び出し可能な then があると、Promise の then とみなされて TS1058 になる。
// factory は非 async のままにし、then は型に出さない。import() は実行時の getter だけを見る。
vi.mock('./ZoomImage/Dialog', (importOriginal) =>
  importOriginal<typeof import('./ZoomImage/Dialog')>().then((actual) => {
    const namespace = { ...actual };
    Object.defineProperty(namespace, 'then', {
      configurable: true,
      enumerable: true,
      get() {
        if (!failDialogLoad) return undefined;

        return (_resolve: unknown, reject: (reason: Error) => void) => {
          reject(new Error('chunk load failed'));
        };
      },
    });
    return namespace;
  }),
);

import { ZoomImage } from './ZoomImage';

describe('ZoomImage integration', () => {
  const originalStartViewTransition = document.startViewTransition;
  const originalShowModal = HTMLDialogElement.prototype.showModal;
  const originalClose = HTMLDialogElement.prototype.close;

  beforeEach(() => {
    failDialogLoad = false;
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

  // 画像の load 後に、ズームのトリガーが現れるまでを再現する
  async function renderZoomable() {
    render(<ZoomImage alt="統合テスト画像" src="/test.jpg" />);

    const image = screen.getByAltText('統合テスト画像');
    Object.defineProperties(image, {
      naturalHeight: { configurable: true, value: 480 },
      naturalWidth: { configurable: true, value: 640 },
    });

    fireEvent.load(image);

    const trigger = await screen.findByRole('button', { name: '統合テスト画像' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    return trigger;
  }

  it('dialog の読み込み前に押した場合も、描画後に dialog を open / close できる', async () => {
    const trigger = await renderZoomable();

    fireEvent.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: '統合テスト画像' });
    expect(dialog.hasAttribute('open')).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(within(dialog).getByRole('button', { name: '閉じる' }));

    expect(dialog.hasAttribute('open')).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('ポインタが乗って dialog が描画された後に押した場合、直ちに dialog を open する', async () => {
    const trigger = await renderZoomable();

    fireEvent.pointerEnter(trigger);

    // 閉じた dialog は accessibility tree に含まれないため hidden: true を指定する(非表示の要素は name が空になる)
    const dialog = await screen.findByRole('dialog', { hidden: true });
    expect(dialog.hasAttribute('open')).toBe(false);

    fireEvent.click(trigger);

    expect(dialog.hasAttribute('open')).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('dialog の取得に失敗した場合、開かず失敗を記録する', async () => {
    failDialogLoad = true;
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const trigger = await renderZoomable();

    fireEvent.click(trigger);
    await act(async () => {
      await vi.dynamicImportSettled();
    });

    expect(consoleError).toHaveBeenCalledWith('Failed to load ZoomImage dialog:', expect.any(Error));
    expect(screen.queryByRole('dialog', { hidden: true })).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
