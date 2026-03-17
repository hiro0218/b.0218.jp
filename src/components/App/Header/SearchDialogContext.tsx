'use client';

import { usePathname } from 'next/navigation';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type { OverlayTriggerProps } from 'react-stately';
import { useOverlayTriggerState } from 'react-stately';
import { useRequestAnimationFrame } from '@/hooks/useRequestAnimationFrame';
import { useTimeout } from '@/hooks/useTimeout';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

type SearchDialogContextType = {
  isOpen: boolean;
  isClosing: boolean;
  open: () => void;
  close: () => void;
  dialogRef: React.RefObject<HTMLDialogElement>;
};

const SearchDialogContext = createContext<SearchDialogContextType | undefined>(undefined);

interface UseDialogStateOptions extends Partial<OverlayTriggerProps> {
  animated?: boolean;
  duration?: number;
}

function useDialogState(options?: UseDialogStateOptions) {
  const { animated = true, duration: baseDuration = 200, ...overlayOptions } = options ?? {};

  const state = useOverlayTriggerState(overlayOptions);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const duration = animated && !prefersReducedMotion ? baseDuration : 0;
  const { schedule: scheduleRaf, cancel: cancelRaf } = useRequestAnimationFrame();
  const { schedule: scheduleTimeout, cancel: cancelTimeout } = useTimeout();

  useEffect(() => {
    if (!state.isOpen) return;

    const openDialogWhenReady = () => {
      const dialog = dialogRef.current;
      if (dialog && !dialog.open) {
        dialog.showModal();
      } else if (!dialog) {
        scheduleRaf(openDialogWhenReady);
      }
    };

    scheduleRaf(openDialogWhenReady);

    return cancelRaf;
  }, [cancelRaf, scheduleRaf, state.isOpen]);

  const close = useCallback(() => {
    cancelTimeout();

    if (duration > 0) {
      setIsClosing(true);
      scheduleTimeout(() => {
        dialogRef.current?.close();
        setIsClosing(false);
        state.close();
      }, duration);
    } else {
      dialogRef.current?.close();
      state.close();
    }
  }, [cancelTimeout, duration, scheduleTimeout, state]);

  return {
    dialogRef,
    open: state.open,
    close,
    isOpen: state.isOpen,
    isClosing: animated && isClosing,
  } as const;
}

export function SearchDialogProvider({ children }: { children: ReactNode }) {
  const dialog = useDialogState();
  const pathname = usePathname();

  // pathnameの変更を保存するためのref
  const previousPathnameRef = useRef(pathname);
  const isInitialMount = useRef(true);
  const dialogRef = useRef(dialog);
  dialogRef.current = dialog;

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // 画面遷移時、ダイアログが開いている場合のみ閉じる（検索状態は保持される）
    if (previousPathnameRef.current !== pathname) {
      if (dialogRef.current.isOpen) {
        dialogRef.current.close();
      }
      previousPathnameRef.current = pathname;
    }
  }, [pathname]);

  // グローバルキーボードショートカット: / でダイアログを開く
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ダイアログが既に開いている場合、または IME 入力中（日本語変換中など）のキーイベントはショートカット判定から除外
      if (dialogRef.current.isOpen || e.isComposing) {
        return;
      }

      // 入力フィールドにフォーカスがある場合は無視
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // / キーでダイアログを開く
      if (e.key === '/') {
        e.preventDefault();
        dialogRef.current.open();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return <SearchDialogContext.Provider value={dialog}>{children}</SearchDialogContext.Provider>;
}

export function useSearchDialog() {
  const context = useContext(SearchDialogContext);

  if (context === undefined) {
    throw new Error('useSearchDialog must be used within SearchDialogProvider');
  }

  return context;
}
