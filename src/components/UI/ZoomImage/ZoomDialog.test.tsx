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
          a11yLabel="テストダイアログ"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={dialogRef}
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
          a11yLabel="画像のズーム表示"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
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
          a11yLabel="テスト"
          alt="テスト画像"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
          onCancel={vi.fn()}
          onClose={vi.fn()}
          src="/original.jpg"
        />,
      );

      const img = screen.getByAltText('テスト画像') as HTMLImageElement;
      expect(img.src).toContain('/original.jpg');
    });
  });

  /* ================================================================ */
  /*  zoomImg prop                                                    */
  /* ================================================================ */
  describe('zoomImg prop', () => {
    it('zoomImg.src が指定された場合、img の src に zoomImg.src が使用される', () => {
      render(
        <ZoomDialog
          a11yLabel="テスト"
          alt="テスト画像"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
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
          a11yLabel="テスト"
          alt="テスト画像"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
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
          a11yLabel="テスト"
          alt="テスト画像"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
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
          a11yLabel="テスト"
          alt="テスト画像"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
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
  /*  Keyboard navigation (handleImageKeyDown)                        */
  /* ================================================================ */
  describe('キーボード操作（handleImageKeyDown）', () => {
    it('Enter キーで onClose が呼ばれ、preventDefault も実行される', () => {
      const onClose = vi.fn();

      render(
        <ZoomDialog
          a11yLabel="テスト"
          alt="テスト画像"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
          onCancel={vi.fn()}
          onClose={onClose}
          src="/test.jpg"
        />,
      );

      const img = screen.getByAltText('テスト画像');
      const prevented = !fireEvent.keyDown(img, { key: 'Enter' });

      expect(onClose).toHaveBeenCalledOnce();
      expect(prevented).toBe(true);
    });

    it('Space キーで onClose が呼ばれ、preventDefault も実行される', () => {
      const onClose = vi.fn();

      render(
        <ZoomDialog
          a11yLabel="テスト"
          alt="テスト画像"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
          onCancel={vi.fn()}
          onClose={onClose}
          src="/test.jpg"
        />,
      );

      const img = screen.getByAltText('テスト画像');
      const prevented = !fireEvent.keyDown(img, { key: ' ' });

      expect(onClose).toHaveBeenCalledOnce();
      expect(prevented).toBe(true);
    });

    it('Escape キーでは onClose が呼ばれない', () => {
      const onClose = vi.fn();

      render(
        <ZoomDialog
          a11yLabel="テスト"
          alt="テスト画像"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
          onCancel={vi.fn()}
          onClose={onClose}
          src="/test.jpg"
        />,
      );

      const img = screen.getByAltText('テスト画像');
      fireEvent.keyDown(img, { key: 'Escape' });

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
          a11yLabel="テスト"
          dialogImgRef={createRef<HTMLImageElement>()}
          dialogRef={createRef<HTMLDialogElement>()}
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
