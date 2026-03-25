import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useImageZoom } from './hooks/useImageZoom';

/**
 * useImageZoom hook unit tests
 *
 * canZoom logic, state transitions, View Transition fallback,
 * race condition guards, and unmount guards.
 */

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function createMockImage(overrides: Partial<HTMLImageElement> = {}): HTMLImageElement {
  return {
    naturalWidth: 800,
    naturalHeight: 600,
    complete: false,
    style: {} as CSSStyleDeclaration,
    closest: vi.fn(() => null),
    ...overrides,
  } as unknown as HTMLImageElement;
}

function createMockDialog(overrides: Partial<HTMLDialogElement> = {}): HTMLDialogElement {
  return {
    open: false,
    showModal: vi.fn(),
    close: vi.fn(),
    style: {} as CSSStyleDeclaration,
    ...overrides,
  } as unknown as HTMLDialogElement;
}

interface DeferredViewTransitionMock {
  startViewTransition: typeof document.startViewTransition;
  closeFinishedResolve: () => void;
  closeFinishedPromise: Promise<undefined>;
}

/**
 * open は即座に resolve、close は手動制御の ViewTransition モック
 */
function createDeferredViewTransitionMock(): DeferredViewTransitionMock {
  let closeFinishedResolve: () => void = () => {};
  const closeFinishedPromise = new Promise<undefined>((resolve) => {
    closeFinishedResolve = () => resolve(undefined);
  });

  let callCount = 0;
  const startViewTransition = vi.fn((cb: () => void) => {
    callCount++;
    cb();
    const finished = callCount === 1 ? Promise.resolve(undefined) : closeFinishedPromise;
    return {
      finished,
      ready: Promise.resolve(undefined),
      updateCallbackDone: Promise.resolve(undefined),
      skipTransition: vi.fn(),
    } as unknown as ViewTransition;
  });

  return { startViewTransition, closeFinishedResolve, closeFinishedPromise };
}

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('useImageZoom', () => {
  let originalStartViewTransition: typeof document.startViewTransition;

  beforeEach(() => {
    originalStartViewTransition = document.startViewTransition;
  });

  afterEach(() => {
    document.startViewTransition = originalStartViewTransition;
    vi.restoreAllMocks();
  });

  /* ================================================================ */
  /*  canZoom logic                                                   */
  /* ================================================================ */
  describe('canZoom', () => {
    it('初期状態では canZoom が false である', () => {
      const { result } = renderHook(() => useImageZoom());

      expect(result.current.canZoom).toBe(false);
    });

    it('画像ロード後、naturalWidth >= minImageSize の場合に canZoom が true になる', () => {
      const { result } = renderHook(() => useImageZoom({ minImageSize: 100 }));

      // imgRef に mock image を設定
      const mockImg = createMockImage({ naturalWidth: 200, naturalHeight: 50 });
      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });

      act(() => {
        result.current.handleImageLoad();
      });

      expect(result.current.canZoom).toBe(true);
    });

    it('画像ロード後、naturalHeight >= minImageSize の場合に canZoom が true になる', () => {
      const { result } = renderHook(() => useImageZoom({ minImageSize: 100 }));

      const mockImg = createMockImage({ naturalWidth: 50, naturalHeight: 200 });
      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });

      act(() => {
        result.current.handleImageLoad();
      });

      expect(result.current.canZoom).toBe(true);
    });

    it('画像の naturalWidth と naturalHeight がどちらも minImageSize 未満の場合、canZoom が false のまま', () => {
      const { result } = renderHook(() => useImageZoom({ minImageSize: 100 }));

      const mockImg = createMockImage({ naturalWidth: 50, naturalHeight: 50 });
      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });

      act(() => {
        result.current.handleImageLoad();
      });

      expect(result.current.canZoom).toBe(false);
    });

    it('hasObjectFit が true の場合、canZoom は常に false', () => {
      const { result } = renderHook(() => useImageZoom({ hasObjectFit: true, minImageSize: 100 }));

      const mockImg = createMockImage({ naturalWidth: 800, naturalHeight: 600 });
      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });

      act(() => {
        result.current.handleImageLoad();
      });

      expect(result.current.canZoom).toBe(false);
    });

    it('naturalWidth が minImageSize - 1 の場合、その次元では canZoom 条件を満たさない（境界値）', () => {
      const { result } = renderHook(() => useImageZoom({ minImageSize: 100 }));

      const mockImg = createMockImage({ naturalWidth: 99, naturalHeight: 99 });
      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });

      act(() => {
        result.current.handleImageLoad();
      });

      expect(result.current.canZoom).toBe(false);
    });
  });

  /* ================================================================ */
  /*  open()                                                          */
  /* ================================================================ */
  describe('open', () => {
    it('canZoom が false の場合、open() は何もしない', () => {
      const { result } = renderHook(() => useImageZoom());

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('isOpen が true の場合、open() は何もしない（二重 open 防止）', () => {
      document.startViewTransition = undefined;

      const { result } = renderHook(() => useImageZoom({ minImageSize: 1 }));

      const mockImg = createMockImage({ naturalWidth: 200, naturalHeight: 200 });
      const mockDialog = createMockDialog();
      const mockDialogImg = createMockImage();

      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });
      Object.defineProperty(result.current.dialogRef, 'current', { value: mockDialog, writable: true });
      Object.defineProperty(result.current.dialogImgRef, 'current', { value: mockDialogImg, writable: true });

      act(() => {
        result.current.handleImageLoad();
      });
      act(() => {
        result.current.open();
      });

      expect(mockDialog.showModal).toHaveBeenCalledOnce();

      // 2回目の open() は無視される
      act(() => {
        result.current.open();
      });

      expect(mockDialog.showModal).toHaveBeenCalledOnce();
    });

    it('imgRef が null の場合、open() は何もしない', () => {
      const { result } = renderHook(() => useImageZoom({ minImageSize: 1 }));

      // canZoom を true にする
      const mockImg = createMockImage({ naturalWidth: 100, naturalHeight: 100 });
      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });

      act(() => {
        result.current.handleImageLoad();
      });

      // imgRef を null に戻す
      Object.defineProperty(result.current.imgRef, 'current', { value: null, writable: true });

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('dialogRef が null の場合、open() は何もしない', () => {
      const { result } = renderHook(() => useImageZoom({ minImageSize: 1 }));

      const mockImg = createMockImage({ naturalWidth: 200, naturalHeight: 200 });
      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });

      act(() => {
        result.current.handleImageLoad();
      });

      // dialogRef は null のまま
      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('dialogImgRef が null の場合、open() は何もしない', () => {
      const { result } = renderHook(() => useImageZoom({ minImageSize: 1 }));

      const mockImg = createMockImage({ naturalWidth: 200, naturalHeight: 200 });
      const mockDialog = createMockDialog();
      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });
      Object.defineProperty(result.current.dialogRef, 'current', { value: mockDialog, writable: true });

      act(() => {
        result.current.handleImageLoad();
      });

      // dialogImgRef は null のまま
      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(false);
      expect(mockDialog.showModal).not.toHaveBeenCalled();
    });

    it('View Transition API 非対応時、dialog.showModal() を直接呼び isOpen を true にする', () => {
      document.startViewTransition = undefined;

      const { result } = renderHook(() => useImageZoom({ minImageSize: 1 }));

      const mockImg = createMockImage({ naturalWidth: 200, naturalHeight: 200 });
      const mockDialog = createMockDialog();
      const mockDialogImg = createMockImage();

      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });
      Object.defineProperty(result.current.dialogRef, 'current', { value: mockDialog, writable: true });
      Object.defineProperty(result.current.dialogImgRef, 'current', { value: mockDialogImg, writable: true });

      act(() => {
        result.current.handleImageLoad();
      });

      act(() => {
        result.current.open();
      });

      expect(mockDialog.showModal).toHaveBeenCalledOnce();
      expect(result.current.isOpen).toBe(true);
    });

    it('View Transition API 対応時、startViewTransition 経由で showModal を呼ぶ', () => {
      const capturedCallbacks: Array<() => void> = [];
      document.startViewTransition = vi.fn((cb: () => void) => {
        capturedCallbacks.push(cb);
        cb();
        return {
          finished: Promise.resolve(undefined),
          ready: Promise.resolve(undefined),
          updateCallbackDone: Promise.resolve(undefined),
          skipTransition: vi.fn(),
        } as unknown as ViewTransition;
      });

      const { result } = renderHook(() => useImageZoom({ minImageSize: 1 }));

      const mockImg = createMockImage({ naturalWidth: 200, naturalHeight: 200 });
      const mockDialog = createMockDialog();
      const mockDialogImg = createMockImage();

      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });
      Object.defineProperty(result.current.dialogRef, 'current', { value: mockDialog, writable: true });
      Object.defineProperty(result.current.dialogImgRef, 'current', { value: mockDialogImg, writable: true });

      act(() => {
        result.current.handleImageLoad();
      });

      act(() => {
        result.current.open();
      });

      expect(document.startViewTransition).toHaveBeenCalledOnce();
      expect(mockDialog.showModal).toHaveBeenCalledOnce();
      expect(result.current.isOpen).toBe(true);
    });

    it('View Transition API 対応時、viewTransitionName を正しく切り替える', () => {
      let capturedCallback: (() => void) | null = null;
      document.startViewTransition = vi.fn((cb: () => void) => {
        capturedCallback = cb;
        // callback を即時実行せず、キャプチャだけする
        return {
          finished: Promise.resolve(undefined),
          ready: Promise.resolve(undefined),
          updateCallbackDone: Promise.resolve(undefined),
          skipTransition: vi.fn(),
        } as unknown as ViewTransition;
      });

      const { result } = renderHook(() => useImageZoom({ minImageSize: 1 }));

      const imgStyle = {} as CSSStyleDeclaration;
      const dialogImgStyle = {} as CSSStyleDeclaration;
      const mockImg = createMockImage({ naturalWidth: 200, naturalHeight: 200, style: imgStyle });
      const mockDialog = createMockDialog();
      const mockDialogImg = createMockImage({ style: dialogImgStyle });

      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });
      Object.defineProperty(result.current.dialogRef, 'current', { value: mockDialog, writable: true });
      Object.defineProperty(result.current.dialogImgRef, 'current', { value: mockDialogImg, writable: true });

      act(() => {
        result.current.handleImageLoad();
      });

      // open() で sourceImg.style.viewTransitionName が設定される
      act(() => {
        result.current.open();
      });

      // callback 実行前: sourceImg に viewTransitionName が設定されている
      expect(imgStyle.viewTransitionName).toBeDefined();

      // callback を実行（setIsOpen(true) も callback 内で呼ばれる）
      act(() => {
        capturedCallback?.();
      });

      // callback 実行後: sourceImg の viewTransitionName が空、dialogImg に移動
      expect(imgStyle.viewTransitionName).toBe('');
      expect(dialogImgStyle.viewTransitionName).toBeTruthy();
      expect(result.current.isOpen).toBe(true);
    });
  });

  /* ================================================================ */
  /*  close()                                                         */
  /* ================================================================ */
  describe('close', () => {
    it('dialogRef が null の場合、close() は何もしない', () => {
      const { result } = renderHook(() => useImageZoom());

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('dialog.open が false の場合、close() は何もしない', () => {
      const { result } = renderHook(() => useImageZoom());

      const mockImg = createMockImage({ naturalWidth: 200, naturalHeight: 200 });
      const mockDialog = createMockDialog({ open: false });
      const mockDialogImg = createMockImage();

      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });
      Object.defineProperty(result.current.dialogRef, 'current', { value: mockDialog, writable: true });
      Object.defineProperty(result.current.dialogImgRef, 'current', { value: mockDialogImg, writable: true });

      act(() => {
        result.current.close();
      });

      expect(mockDialog.close).not.toHaveBeenCalled();
    });

    it('View Transition API 非対応時、dialog.close() を直接呼び isOpen を false にする', () => {
      document.startViewTransition = undefined;

      const { result } = renderHook(() => useImageZoom({ minImageSize: 1 }));

      const mockImg = createMockImage({ naturalWidth: 200, naturalHeight: 200 });
      const mockDialog = createMockDialog();
      const mockDialogImg = createMockImage();

      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });
      Object.defineProperty(result.current.dialogRef, 'current', { value: mockDialog, writable: true });
      Object.defineProperty(result.current.dialogImgRef, 'current', { value: mockDialogImg, writable: true });

      // まず open する
      act(() => {
        result.current.handleImageLoad();
      });
      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);

      // dialog.open を true に設定
      Object.defineProperty(mockDialog, 'open', { value: true, writable: true });

      act(() => {
        result.current.close();
      });

      expect(mockDialog.close).toHaveBeenCalledOnce();
      expect(result.current.isOpen).toBe(false);
    });

    it('View Transition API 対応時、startViewTransition 経由で close を実行する', async () => {
      const mock = createDeferredViewTransitionMock();
      document.startViewTransition = mock.startViewTransition;

      const { result } = renderHook(() => useImageZoom({ minImageSize: 1 }));

      const mockImg = createMockImage({ naturalWidth: 200, naturalHeight: 200 });
      const mockDialog = createMockDialog();
      const mockDialogImg = createMockImage();

      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });
      Object.defineProperty(result.current.dialogRef, 'current', { value: mockDialog, writable: true });
      Object.defineProperty(result.current.dialogImgRef, 'current', { value: mockDialogImg, writable: true });

      // open
      act(() => {
        result.current.handleImageLoad();
      });
      act(() => {
        result.current.open();
      });

      // open の transition.finished を解決して isTransitioning をリセット
      await act(async () => {
        await Promise.resolve();
      });

      Object.defineProperty(mockDialog, 'open', { value: true, writable: true });

      act(() => {
        result.current.close();
      });

      expect(mock.startViewTransition).toHaveBeenCalledTimes(2);
      expect(mockDialog.close).toHaveBeenCalled();

      // transition.finished で isOpen が false になる
      await act(async () => {
        mock.closeFinishedResolve();
        await mock.closeFinishedPromise;
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('close() で triggerButton が見つかった場合、visibility を制御する', async () => {
      const mock = createDeferredViewTransitionMock();
      document.startViewTransition = mock.startViewTransition;

      const { result } = renderHook(() => useImageZoom({ minImageSize: 1 }));

      const triggerButtonStyle = { visibility: '' } as CSSStyleDeclaration;
      const mockTriggerButton = { style: triggerButtonStyle } as HTMLButtonElement;

      const mockImg = createMockImage({
        naturalWidth: 200,
        naturalHeight: 200,
        closest: vi.fn(() => mockTriggerButton),
      });
      const mockDialog = createMockDialog({ open: true });
      const mockDialogImg = createMockImage();

      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });
      Object.defineProperty(result.current.dialogRef, 'current', { value: mockDialog, writable: true });
      Object.defineProperty(result.current.dialogImgRef, 'current', { value: mockDialogImg, writable: true });

      act(() => {
        result.current.handleImageLoad();
      });
      act(() => {
        result.current.open();
      });

      // open の transition.finished を解決
      await act(async () => {
        await Promise.resolve();
      });

      act(() => {
        result.current.close();
      });

      // transition callback 中に visibility が 'visible' に設定される
      expect(triggerButtonStyle.visibility).toBe('visible');

      // transition.finished 後に visibility が空に戻る
      await act(async () => {
        mock.closeFinishedResolve();
        await mock.closeFinishedPromise;
      });

      expect(triggerButtonStyle.visibility).toBe('');
    });

    it('isTransitioning が true の場合、close() は何もしない（二重 close 防止）', async () => {
      const mock = createDeferredViewTransitionMock();
      document.startViewTransition = mock.startViewTransition;

      const { result } = renderHook(() => useImageZoom({ minImageSize: 1 }));

      const mockImg = createMockImage({ naturalWidth: 200, naturalHeight: 200 });
      const mockDialog = createMockDialog({ open: true });
      const mockDialogImg = createMockImage();

      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });
      Object.defineProperty(result.current.dialogRef, 'current', { value: mockDialog, writable: true });
      Object.defineProperty(result.current.dialogImgRef, 'current', { value: mockDialogImg, writable: true });

      act(() => {
        result.current.handleImageLoad();
      });
      act(() => {
        result.current.open();
      });

      // open の transition.finished を解決
      await act(async () => {
        await Promise.resolve();
      });

      // 1回目の close(): isTransitioning が true になる（closeFinishedPromise 未解決）
      act(() => {
        result.current.close();
      });

      const mockFn = mock.startViewTransition as unknown as ReturnType<typeof vi.fn>;
      const closeCallCount = mockFn.mock.calls.length;

      // 2回目の close(): isTransitioning が true のため無視される
      act(() => {
        result.current.close();
      });

      const afterSecondCloseCount = mockFn.mock.calls.length;
      expect(afterSecondCloseCount).toBe(closeCallCount);

      // cleanup
      await act(async () => {
        mock.closeFinishedResolve();
        await mock.closeFinishedPromise;
      });
    });

    it('View Transition API 非対応時、viewTransitionName をクリアする', () => {
      document.startViewTransition = undefined;

      const { result } = renderHook(() => useImageZoom({ minImageSize: 1 }));

      const imgStyle = { viewTransitionName: 'test' } as unknown as CSSStyleDeclaration;
      const dialogImgStyle = { viewTransitionName: 'test' } as unknown as CSSStyleDeclaration;

      const mockImg = createMockImage({ naturalWidth: 200, naturalHeight: 200, style: imgStyle });
      const mockDialog = createMockDialog({ open: true });
      const mockDialogImg = createMockImage({ style: dialogImgStyle });

      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });
      Object.defineProperty(result.current.dialogRef, 'current', { value: mockDialog, writable: true });
      Object.defineProperty(result.current.dialogImgRef, 'current', { value: mockDialogImg, writable: true });

      act(() => {
        result.current.handleImageLoad();
      });
      act(() => {
        result.current.open();
      });
      act(() => {
        result.current.close();
      });

      expect(dialogImgStyle.viewTransitionName).toBe('');
      expect(imgStyle.viewTransitionName).toBe('');
    });
  });

  /* ================================================================ */
  /*  isOpen state transitions                                        */
  /* ================================================================ */
  describe('isOpen state transitions', () => {
    it('open → close で isOpen が false → true → false に遷移する（View Transition 非対応）', () => {
      document.startViewTransition = undefined;

      const { result } = renderHook(() => useImageZoom({ minImageSize: 1 }));

      const mockImg = createMockImage({ naturalWidth: 200, naturalHeight: 200 });
      const mockDialog = createMockDialog();
      const mockDialogImg = createMockImage();

      Object.defineProperty(result.current.imgRef, 'current', { value: mockImg, writable: true });
      Object.defineProperty(result.current.dialogRef, 'current', { value: mockDialog, writable: true });
      Object.defineProperty(result.current.dialogImgRef, 'current', { value: mockDialogImg, writable: true });

      act(() => {
        result.current.handleImageLoad();
      });

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);

      Object.defineProperty(mockDialog, 'open', { value: true, writable: true });

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });
  });
});
