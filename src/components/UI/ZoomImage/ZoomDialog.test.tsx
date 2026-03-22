import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

/* ------------------------------------------------------------------ */
/*  Mock dependencies                                                 */
/* ------------------------------------------------------------------ */

vi.mock('@/ui/styled', () => ({
  css: () => 'mocked-css-class',
}));

vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (children: ReactNode) => children,
  };
});

vi.mock('@react-aria/dialog', () => ({
  useDialog: (props: Record<string, unknown>) => ({
    dialogProps: { role: 'dialog', 'aria-label': props['aria-label'] },
  }),
}));

vi.mock('@react-aria/focus', () => ({
  // biome-ignore lint/style/useNamingConvention: React component mock requires PascalCase
  FocusScope: ({ children }: { children: ReactNode }) => children,
}));

/* ------------------------------------------------------------------ */
/*  Import component after mocks                                      */
/* ------------------------------------------------------------------ */

import { ZoomDialog } from './ZoomDialog';

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('ZoomDialog', () => {
  afterEach(() => {
    cleanup();
  });

  /* ================================================================ */
  /*  Rendering                                                       */
  /* ================================================================ */
  describe('レンダリング', () => {
    it('dialog 要素をレンダリングする', () => {
      const dialogRef = createRef<HTMLDialogElement>();

      render(
        <ZoomDialog
          closeLabel="閉じる"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={dialogRef}
          isOpen={false}
          label="テストダイアログ"
          onCancel={vi.fn()}
          onClose={vi.fn()}
          src="/test.jpg"
        />,
      );

      const dialog = screen.getByRole('dialog', { hidden: true });
      expect(dialog).toBeDefined();
    });

    it('dialog に正しい aria-label が設定される', () => {
      render(
        <ZoomDialog
          closeLabel="閉じる"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
          isOpen={false}
          label="画像のズーム表示"
          onCancel={vi.fn()}
          onClose={vi.fn()}
          src="/test.jpg"
        />,
      );

      const dialog = screen.getByRole('dialog', { hidden: true });
      expect(dialog.getAttribute('aria-label')).toBe('画像のズーム表示');
    });

    it('img 要素に src が設定される', () => {
      render(
        <ZoomDialog
          alt="テスト画像"
          closeLabel="閉じる"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
          isOpen={false}
          label="テスト"
          onCancel={vi.fn()}
          onClose={vi.fn()}
          src="/original.jpg"
        />,
      );

      const img = screen.getByAltText('テスト画像') as HTMLImageElement;
      expect(img.src).toContain('/original.jpg');
    });

    it('close ボタンに aria-label が設定される', () => {
      render(
        <ZoomDialog
          closeLabel="閉じる"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
          isOpen={false}
          label="テスト"
          onCancel={vi.fn()}
          onClose={vi.fn()}
          src="/test.jpg"
        />,
      );

      const button = screen.getByRole('button', { hidden: true });
      expect(button.getAttribute('aria-label')).toBe('閉じる');
    });
  });

  /* ================================================================ */
  /*  zoomImg prop                                                    */
  /* ================================================================ */
  describe('zoomImg prop', () => {
    it('zoomImg.src が指定された場合、img の src に zoomImg.src が使用される', () => {
      render(
        <ZoomDialog
          alt="テスト画像"
          closeLabel="閉じる"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
          isOpen={false}
          label="テスト"
          onCancel={vi.fn()}
          onClose={vi.fn()}
          src="/thumb.jpg"
          zoomImg={{ src: '/full.jpg' }}
        />,
      );

      const img = screen.getByAltText('テスト画像') as HTMLImageElement;
      expect(img.src).toContain('/full.jpg');
    });

    it('zoomImg.srcSet が指定された場合、img の srcset が設定される', () => {
      render(
        <ZoomDialog
          alt="テスト画像"
          closeLabel="閉じる"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
          isOpen={false}
          label="テスト"
          onCancel={vi.fn()}
          onClose={vi.fn()}
          src="/thumb.jpg"
          zoomImg={{ src: '/full.jpg', srcSet: '/full-2x.jpg 2x' }}
        />,
      );

      const img = screen.getByAltText('テスト画像') as HTMLImageElement;
      expect(img.srcset).toBe('/full-2x.jpg 2x');
    });
  });

  /* ================================================================ */
  /*  Event handlers                                                  */
  /* ================================================================ */
  describe('イベントハンドラー', () => {
    it('dialog の背景クリックで onClose が呼ばれる', () => {
      const onClose = vi.fn();

      render(
        <ZoomDialog
          alt="テスト画像"
          closeLabel="閉じる"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
          isOpen={false}
          label="テスト"
          onCancel={vi.fn()}
          onClose={onClose}
          src="/test.jpg"
        />,
      );

      const dialog = screen.getByRole('dialog', { hidden: true });

      // e.target === e.currentTarget の場合のみ onClose が呼ばれる
      fireEvent.click(dialog);

      expect(onClose).toHaveBeenCalledOnce();
    });

    it('img 要素内のクリックでは dialog の onClick が onClose を呼ばない（バブリング時 target !== currentTarget）', () => {
      const onClose = vi.fn();

      render(
        <ZoomDialog
          alt="テスト画像"
          closeLabel="閉じる"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
          isOpen={false}
          label="テスト"
          onCancel={vi.fn()}
          onClose={onClose}
          src="/test.jpg"
        />,
      );

      const img = screen.getByAltText('テスト画像');

      // img クリックのバブリングで dialog の onClick に到達する場合
      // e.target(img) !== e.currentTarget(dialog) なので dialog の onClick は発火しない
      // ただし img 自身の onClick で onClose が呼ばれる
      fireEvent.click(img);

      // img の onClick で1回呼ばれる
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  /* ================================================================ */
  /*  Keyboard navigation (button wrapping img)                       */
  /* ================================================================ */
  describe('キーボード操作（button 経由）', () => {
    it('画像ボタンをクリックすると onClose が呼ばれる', () => {
      const onClose = vi.fn();

      render(
        <ZoomDialog
          alt="テスト画像"
          closeLabel="閉じる"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
          isOpen={false}
          label="テスト"
          onCancel={vi.fn()}
          onClose={onClose}
          src="/test.jpg"
        />,
      );

      const button = screen.getByRole('button', { hidden: true });
      fireEvent.click(button);

      expect(onClose).toHaveBeenCalledOnce();
    });

    it('Escape キーでは onClose が呼ばれない', () => {
      const onClose = vi.fn();

      render(
        <ZoomDialog
          alt="テスト画像"
          closeLabel="閉じる"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
          isOpen={false}
          label="テスト"
          onCancel={vi.fn()}
          onClose={onClose}
          src="/test.jpg"
        />,
      );

      const button = screen.getByRole('button', { hidden: true });
      fireEvent.keyDown(button, { key: 'Escape' });

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  /* ================================================================ */
  /*  Keyboard navigation (handleDialogKeyDown)                       */
  /* ================================================================ */
  describe('キーボード操作（handleDialogKeyDown）', () => {
    it('dialog 要素自体への Enter キーで onClose が呼ばれる', () => {
      const onClose = vi.fn();

      render(
        <ZoomDialog
          alt="テスト画像"
          closeLabel="閉じる"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
          isOpen={false}
          label="テスト"
          onCancel={vi.fn()}
          onClose={onClose}
          src="/test.jpg"
        />,
      );

      const dialog = screen.getByRole('dialog', { hidden: true });
      const prevented = !fireEvent.keyDown(dialog, { key: 'Enter' });

      expect(onClose).toHaveBeenCalledOnce();
      expect(prevented).toBe(true);
    });

    it('dialog 要素自体への Space キーで onClose が呼ばれる', () => {
      const onClose = vi.fn();

      render(
        <ZoomDialog
          alt="テスト画像"
          closeLabel="閉じる"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
          isOpen={false}
          label="テスト"
          onCancel={vi.fn()}
          onClose={onClose}
          src="/test.jpg"
        />,
      );

      const dialog = screen.getByRole('dialog', { hidden: true });
      const prevented = !fireEvent.keyDown(dialog, { key: ' ' });

      expect(onClose).toHaveBeenCalledOnce();
      expect(prevented).toBe(true);
    });

    it('Tab キーでは dialog の onClose が呼ばれない', () => {
      const onClose = vi.fn();

      render(
        <ZoomDialog
          alt="テスト画像"
          closeLabel="閉じる"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
          isOpen={false}
          label="テスト"
          onCancel={vi.fn()}
          onClose={onClose}
          src="/test.jpg"
        />,
      );

      const dialog = screen.getByRole('dialog', { hidden: true });
      fireEvent.keyDown(dialog, { key: 'Tab' });

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  /* ================================================================ */
  /*  onCancel prop                                                   */
  /* ================================================================ */
  describe('onCancel', () => {
    it('dialog の cancel イベント時に onCancel が呼ばれる', () => {
      const onCancel = vi.fn();

      render(
        <ZoomDialog
          closeLabel="閉じる"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
          isOpen={false}
          label="テスト"
          onCancel={onCancel}
          onClose={vi.fn()}
          src="/test.jpg"
        />,
      );

      const dialog = screen.getByRole('dialog', { hidden: true });
      const cancelEvent = new Event('cancel', { bubbles: true, cancelable: true });
      dialog.dispatchEvent(cancelEvent);

      expect(onCancel).toHaveBeenCalledOnce();
    });
  });
});
