import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * ZoomImage component tests
 *
 * rendering modes, accessibility, dialog behavior.
 */

/* ------------------------------------------------------------------ */
/*  Mock dependencies                                                 */
/* ------------------------------------------------------------------ */

// useIsMounted - always return true for test environment
vi.mock('@/hooks/useIsMounted', () => ({
  default: () => true,
}));

// Panda CSS styled - return identity functions
vi.mock('@/ui/styled', () => ({
  css: () => 'mocked-css-class',
  cx: (...args: string[]) => args.filter(Boolean).join(' '),
}));

// createPortal - render children directly instead of portaling
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (children: ReactNode) => children,
  };
});

// react-aria hooks
vi.mock('@react-aria/dialog', () => ({
  useDialog: (props: Record<string, unknown>) => ({
    dialogProps: { role: 'dialog', 'aria-label': props['aria-label'] },
  }),
}));

vi.mock('@react-aria/focus', () => ({
  // biome-ignore lint/style/useNamingConvention: React component mock requires PascalCase
  FocusScope: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('@radix-ui/react-icons', () => ({
  // biome-ignore lint/style/useNamingConvention: React component mock requires PascalCase
  ZoomInIcon: (props: Record<string, unknown>) => <span data-testid="zoom-icon" {...props} />,
}));

/* ------------------------------------------------------------------ */
/*  Mock useImageZoom with controllable return values                  */
/* ------------------------------------------------------------------ */

const mockOpen = vi.fn();
const mockClose = vi.fn();
const mockHandleImageLoad = vi.fn();

const defaultHookReturn = {
  imgRef: { current: null },
  dialogRef: { current: null },
  dialogImgRef: { current: null },
  canZoom: false,
  isOpen: false,
  open: mockOpen,
  close: mockClose,
  handleImageLoad: mockHandleImageLoad,
};

let hookReturnOverrides: Partial<typeof defaultHookReturn> = {};

vi.mock('./hooks/useImageZoom', () => ({
  useImageZoom: () => ({
    ...defaultHookReturn,
    ...hookReturnOverrides,
  }),
}));

/* ------------------------------------------------------------------ */
/*  Import component after mocks                                      */
/* ------------------------------------------------------------------ */

import ZoomImage from './ZoomImage';

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('ZoomImage', () => {
  beforeEach(() => {
    hookReturnOverrides = {};
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  /* ================================================================ */
  /*  Rendering: canZoom = false (plain img)                          */
  /* ================================================================ */
  describe('canZoom が false の場合（通常の img 要素）', () => {
    it('img 要素をレンダリングする', () => {
      render(<ZoomImage alt="test image" src="/test.jpg" />);

      const img = screen.getByAltText('test image');
      expect(img).toBeDefined();
      expect(img.tagName).toBe('IMG');
    });

    it('追加の props が img 要素に渡される', () => {
      render(<ZoomImage alt="test image" height={200} src="/test.jpg" width={300} />);

      const img = screen.getByAltText('test image') as HTMLImageElement;
      expect(img.width).toBe(300);
      expect(img.height).toBe(200);
    });

    it('button 要素をレンダリングしない', () => {
      render(<ZoomImage alt="test image" src="/test.jpg" />);

      const button = screen.queryByRole('button');
      expect(button).toBeNull();
    });

    it('文字列形式の style が CSSProperties に変換されて適用される', () => {
      render(<ZoomImage alt="test image" src="/test.jpg" style="width: 100px; height: 200px" />);

      const img = screen.getByAltText('test image') as HTMLImageElement;
      expect(img.style.width).toBe('100px');
      expect(img.style.height).toBe('200px');
    });
  });

  /* ================================================================ */
  /*  Rendering: canZoom = true (button + dialog)                     */
  /* ================================================================ */
  describe('canZoom が true の場合（ズーム可能）', () => {
    beforeEach(() => {
      hookReturnOverrides = { canZoom: true };
    });

    it('button 要素をレンダリングする', () => {
      render(<ZoomImage alt="test image" src="/test.jpg" />);

      const button = screen.getByRole('button');
      expect(button).toBeDefined();
    });

    it('button 内に img 要素をレンダリングする', () => {
      render(<ZoomImage alt="test image" src="/test.jpg" />);

      const button = screen.getByRole('button');
      const img = button.querySelector('img');
      expect(img).not.toBeNull();
      expect(img?.getAttribute('alt')).toBe('test image');
    });

    it('dialog 要素をレンダリングする', () => {
      render(<ZoomImage alt="test image" src="/test.jpg" />);

      // 閉じた dialog は accessibility tree に含まれないため hidden: true を指定
      const dialog = screen.getByRole('dialog', { hidden: true });
      expect(dialog).toBeDefined();
    });

    it('ズームアイコンを表示する', () => {
      render(<ZoomImage alt="test image" src="/test.jpg" />);

      const zoomIcon = screen.getByTestId('zoom-icon');
      expect(zoomIcon).toBeDefined();
    });
  });

  /* ================================================================ */
  /*  Accessibility                                                   */
  /* ================================================================ */
  describe('accessibility', () => {
    it('canZoom が true で alt 未指定の場合、button にデフォルトの aria-label が設定される', () => {
      hookReturnOverrides = { canZoom: true };

      render(<ZoomImage src="/test.jpg" />);

      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-label')).toBe('画像をズーム');
    });

    it('alt テキストが button と dialog の aria-label に使用される', () => {
      hookReturnOverrides = { canZoom: true };

      render(<ZoomImage alt="風景写真" src="/test.jpg" />);

      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-label')).toBe('風景写真');

      const dialog = screen.getByRole('dialog', { hidden: true });
      expect(dialog.getAttribute('aria-label')).toBe('風景写真');
    });

    it('a11yOptions でカスタム aria-label を設定できる', () => {
      hookReturnOverrides = { canZoom: true };

      render(
        <ZoomImage
          a11yOptions={{
            a11yNameButtonZoom: 'カスタムズーム',
            a11yNameDialog: 'カスタムダイアログ',
          }}
          alt="photo"
          src="/test.jpg"
        />,
      );

      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-label')).toBe('カスタムズーム');

      const dialog = screen.getByRole('dialog', { hidden: true });
      expect(dialog.getAttribute('aria-label')).toBe('カスタムダイアログ');
    });

    it('dialog 内の img に tabIndex=0 が設定されキーボード操作可能', () => {
      hookReturnOverrides = { canZoom: true };

      render(<ZoomImage alt="test" src="/test.jpg" />);

      const images = screen.getAllByAltText('test');
      const dialogImg = images[1]; // 2番目が dialog 内の img
      expect(dialogImg.getAttribute('tabindex')).toBe('0');
    });

    it('canZoom が true の場合、button に aria-expanded 属性が設定される', () => {
      hookReturnOverrides = { canZoom: true, isOpen: false };

      render(<ZoomImage alt="test" src="/test.jpg" />);

      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });
  });

  /* ================================================================ */
  /*  zoomImg prop                                                    */
  /* ================================================================ */
  describe('zoomImg prop', () => {
    beforeEach(() => {
      hookReturnOverrides = { canZoom: true };
    });

    it('zoomImg が指定された場合、dialog 内の img が zoomImg.src を使用する', () => {
      render(<ZoomImage alt="test" src="/thumb.jpg" zoomImg={{ src: '/full.jpg' }} />);

      const images = screen.getAllByAltText('test');
      const dialogImg = images[1] as HTMLImageElement;
      expect(dialogImg.src).toContain('/full.jpg');
    });

    it('zoomImg.srcSet が指定された場合、dialog 内の img に srcSet が設定される', () => {
      render(<ZoomImage alt="test" src="/thumb.jpg" zoomImg={{ src: '/full.jpg', srcSet: '/full-2x.jpg 2x' }} />);

      const images = screen.getAllByAltText('test');
      const dialogImg = images[1] as HTMLImageElement;
      expect(dialogImg.srcset).toBe('/full-2x.jpg 2x');
    });

    it('zoomImg が未指定の場合、dialog 内の img は元の src を使用する', () => {
      render(<ZoomImage alt="test" src="/original.jpg" />);

      const images = screen.getAllByAltText('test');
      const dialogImg = images[1] as HTMLImageElement;
      expect(dialogImg.src).toContain('/original.jpg');
    });
  });

  /* ================================================================ */
  /*  Style processing                                                */
  /* ================================================================ */

  /* ================================================================ */
  /*  Dialog cancel handling                                          */
  /* ================================================================ */
  describe('handleDialogCancel', () => {
    it('dialog の cancel イベント時に close が呼ばれる', () => {
      hookReturnOverrides = { canZoom: true };

      render(<ZoomImage alt="test" src="/test.jpg" />);

      const dialog = screen.getByRole('dialog', { hidden: true });

      const cancelEvent = new Event('cancel', { bubbles: true, cancelable: true });
      dialog.dispatchEvent(cancelEvent);

      expect(mockClose).toHaveBeenCalledOnce();
    });
  });
});
