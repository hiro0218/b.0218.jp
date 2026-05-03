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

vi.mock('@heroicons/react/24/outline', () => ({
  // biome-ignore lint/style/useNamingConvention: React component mock requires PascalCase
  MagnifyingGlassPlusIcon: (props: Record<string, unknown>) => <span data-testid="zoom-icon" {...props} />,
}));

/* ------------------------------------------------------------------ */
/*  Import component after mocks                                      */
/* ------------------------------------------------------------------ */

import { TriggerButton } from './TriggerButton';

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('TriggerButton', () => {
  afterEach(() => {
    cleanup();
  });

  /* ================================================================ */
  /*  Rendering                                                       */
  /* ================================================================ */
  describe('レンダリング', () => {
    it('button 要素をレンダリングする', () => {
      render(
        <TriggerButton
          imgProps={{}}
          imgRef={createRef<HTMLImageElement>()}
          isOpen={false}
          label="画像をズーム"
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
        <TriggerButton
          alt="テスト画像"
          imgProps={{}}
          imgRef={createRef<HTMLImageElement>()}
          isOpen={false}
          label="画像をズーム"
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
        <TriggerButton
          alt="テスト画像"
          imgProps={{ width: 400, height: 300 }}
          imgRef={createRef<HTMLImageElement>()}
          isOpen={false}
          label="画像をズーム"
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
        <TriggerButton
          imgProps={{}}
          imgRef={createRef<HTMLImageElement>()}
          isOpen={false}
          label="風景写真をズーム"
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
        <TriggerButton
          imgProps={{}}
          imgRef={createRef<HTMLImageElement>()}
          isOpen={false}
          label="画像をズーム"
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
        <TriggerButton
          imgProps={{}}
          imgRef={createRef<HTMLImageElement>()}
          isOpen={true}
          label="画像をズーム"
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
        <TriggerButton
          imgProps={{}}
          imgRef={createRef<HTMLImageElement>()}
          isOpen={false}
          label="画像をズーム"
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
    it('isOpen が true の場合、aria-disabled が設定される', () => {
      render(
        <TriggerButton
          imgProps={{}}
          imgRef={createRef<HTMLImageElement>()}
          isOpen={true}
          label="画像をズーム"
          onImageLoad={vi.fn()}
          src="/test.jpg"
          zoomIn={vi.fn()}
        />,
      );

      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-disabled')).toBe('true');
    });

    it('isOpen が false の場合、aria-disabled が設定されない', () => {
      render(
        <TriggerButton
          imgProps={{}}
          imgRef={createRef<HTMLImageElement>()}
          isOpen={false}
          label="画像をズーム"
          onImageLoad={vi.fn()}
          src="/test.jpg"
          zoomIn={vi.fn()}
        />,
      );

      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-disabled')).toBeNull();
    });

    it('isOpen が true の場合、onClick ハンドラが設定されない', () => {
      const zoomIn = vi.fn();
      render(
        <TriggerButton
          imgProps={{}}
          imgRef={createRef<HTMLImageElement>()}
          isOpen={true}
          label="画像をズーム"
          onImageLoad={vi.fn()}
          src="/test.jpg"
          zoomIn={zoomIn}
        />,
      );

      const button = screen.getByRole('button');
      button.click();
      expect(zoomIn).not.toHaveBeenCalled();
    });
  });
});
