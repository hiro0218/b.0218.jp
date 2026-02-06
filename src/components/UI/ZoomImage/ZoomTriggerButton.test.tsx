import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

/* ------------------------------------------------------------------ */
/*  Mock dependencies                                                 */
/* ------------------------------------------------------------------ */

vi.mock('@/ui/styled', () => ({
  css: () => 'mocked-css-class',
  cx: (...args: string[]) => args.filter(Boolean).join(' '),
}));

vi.mock('@radix-ui/react-icons', () => ({
  // biome-ignore lint/style/useNamingConvention: React component mock requires PascalCase
  ZoomInIcon: (props: Record<string, unknown>) => <span data-testid="zoom-icon" {...props} />,
}));

vi.mock('@react-aria/button', () => ({
  useButton: (props: Record<string, unknown>, _ref: unknown) => ({
    buttonProps: {
      type: 'button',
      'aria-label': props['aria-label'],
      disabled: props.isDisabled,
    },
  }),
}));

vi.mock('@react-aria/focus', () => ({
  useFocusRing: () => ({ isFocusVisible: false, focusProps: {} }),
}));

vi.mock('@react-aria/utils', () => ({
  mergeProps: (...args: Record<string, unknown>[]) => Object.assign({}, ...args),
}));

/* ------------------------------------------------------------------ */
/*  Import component after mocks                                      */
/* ------------------------------------------------------------------ */

import { ZoomTriggerButton } from './ZoomTriggerButton';

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('ZoomTriggerButton', () => {
  afterEach(() => {
    cleanup();
  });

  /* ================================================================ */
  /*  Rendering                                                       */
  /* ================================================================ */
  describe('レンダリング', () => {
    it('button 要素をレンダリングする', () => {
      render(
        <ZoomTriggerButton
          a11yLabel="画像をズーム"
          imgProps={{}}
          imgRef={createRef<HTMLImageElement>()}
          isOpen={false}
          onImageLoad={vi.fn()}
          src="/test.jpg"
          zoomIn={vi.fn()}
        />,
      );

      const button = screen.getByRole('button');
      expect(button).toBeDefined();
    });

    it('style prop が img 要素に適用される', () => {
      render(
        <ZoomTriggerButton
          a11yLabel="画像をズーム"
          alt="テスト画像"
          imgProps={{}}
          imgRef={createRef<HTMLImageElement>()}
          isOpen={false}
          onImageLoad={vi.fn()}
          src="/test.jpg"
          style={{ width: '300px', height: '200px' }}
          zoomIn={vi.fn()}
        />,
      );

      const img = screen.getByAltText('テスト画像') as HTMLImageElement;
      expect(img.style.width).toBe('300px');
      expect(img.style.height).toBe('200px');
    });

    it('imgProps が img 要素に渡される', () => {
      render(
        <ZoomTriggerButton
          a11yLabel="画像をズーム"
          alt="テスト画像"
          imgProps={{ width: 400, height: 300 }}
          imgRef={createRef<HTMLImageElement>()}
          isOpen={false}
          onImageLoad={vi.fn()}
          src="/test.jpg"
          zoomIn={vi.fn()}
        />,
      );

      const img = screen.getByAltText('テスト画像') as HTMLImageElement;
      expect(img.width).toBe(400);
      expect(img.height).toBe(300);
    });
  });

  /* ================================================================ */
  /*  Accessibility                                                   */
  /* ================================================================ */
  describe('アクセシビリティ', () => {
    it('button に正しい aria-label が設定される', () => {
      render(
        <ZoomTriggerButton
          a11yLabel="風景写真をズーム"
          imgProps={{}}
          imgRef={createRef<HTMLImageElement>()}
          isOpen={false}
          onImageLoad={vi.fn()}
          src="/test.jpg"
          zoomIn={vi.fn()}
        />,
      );

      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-label')).toBe('風景写真をズーム');
    });

    it('isOpen が false の場合、aria-expanded が false に設定される', () => {
      render(
        <ZoomTriggerButton
          a11yLabel="画像をズーム"
          imgProps={{}}
          imgRef={createRef<HTMLImageElement>()}
          isOpen={false}
          onImageLoad={vi.fn()}
          src="/test.jpg"
          zoomIn={vi.fn()}
        />,
      );

      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('isOpen が true の場合、aria-expanded が true に設定される', () => {
      render(
        <ZoomTriggerButton
          a11yLabel="画像をズーム"
          imgProps={{}}
          imgRef={createRef<HTMLImageElement>()}
          isOpen={true}
          onImageLoad={vi.fn()}
          src="/test.jpg"
          zoomIn={vi.fn()}
        />,
      );

      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-expanded')).toBe('true');
    });

    it('button の type が "button" である', () => {
      render(
        <ZoomTriggerButton
          a11yLabel="画像をズーム"
          imgProps={{}}
          imgRef={createRef<HTMLImageElement>()}
          isOpen={false}
          onImageLoad={vi.fn()}
          src="/test.jpg"
          zoomIn={vi.fn()}
        />,
      );

      const button = screen.getByRole('button');
      expect(button.getAttribute('type')).toBe('button');
    });
  });

  /* ================================================================ */
  /*  isOpen states                                                   */
  /* ================================================================ */
  describe('isOpen 状態', () => {
    it('isOpen が true の場合、button が disabled になる', () => {
      render(
        <ZoomTriggerButton
          a11yLabel="画像をズーム"
          imgProps={{}}
          imgRef={createRef<HTMLImageElement>()}
          isOpen={true}
          onImageLoad={vi.fn()}
          src="/test.jpg"
          zoomIn={vi.fn()}
        />,
      );

      const button = screen.getByRole('button') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });
  });
});
