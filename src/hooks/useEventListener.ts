import { useEffect, useRef } from 'react';
import { isSSR } from '@/lib/isSSR';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * useEventListenerフックで使用するイベントリスナーのオプション設定
 *
 * ブラウザのaddEventListenerのオプションに対応し、パフォーマンス最適化や
 * イベント処理のカスタマイズが可能。SSR環境では自動的に無効化される。
 */
type UseEventListenerOptions = {
  /**
   * イベントリスナーが有効かどうか
   * @default true
   */
  enabled?: boolean;
  /**
   * イベントのキャプチャフェーズで処理するか
   * @default false
   */
  capture?: boolean;
  /**
   * イベントリスナーを一度だけ実行するか
   * @default false
   */
  once?: boolean;
  /**
   * パッシブリスナーとして登録するか（スクロールイベント等で有用）
   * @default false
   */
  passive?: boolean;
};

/**
 * イベントリスナーを管理する汎用フック
 *
 * DOM要素にイベントリスナーを安全に追加・削除するためのフック。
 * 複数のオーバーロードにより型安全性を確保し、SSR環境でも動作する。
 * コンポーネントのアンマウント時に自動的にクリーンアップが実行される。
 *
 * @param eventName - 監視するイベント名（型安全）
 * @param handler - イベント発生時に実行されるハンドラー関数
 * @param element - イベントリスナーを追加する要素（省略時はwindow）
 * @param options - イベントリスナーの動作オプション
 *
 * @performance スクロールイベントではpassive:trueの使用を推奨
 * @throws SSR環境ではイベントリスナーは登録されない
 *
 * @example
 * ```tsx
 * // 基本的なクリックイベントの監視
 * useEventListener('click', handleClick, elementRef.current);
 *
 * // パフォーマンス最適化されたスクロールイベント
 * useEventListener('scroll', handleScroll, { passive: true });
 *
 * // キャプチャフェーズでのキーボードイベント監視
 * useEventListener('keydown', handleKeyDown, document, { capture: true });
 *
 * // 一度だけ実行されるイベント
 * useEventListener('load', handleLoad, window, { once: true });
 * ```
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: UseEventListenerOptions,
): void;

// 要素とオプション指定
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element: Window | null,
  options?: UseEventListenerOptions,
): void;

export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: Document | null,
  options?: UseEventListenerOptions,
): void;

export function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: HTMLElement | null,
  options?: UseEventListenerOptions,
): void;

export function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  elementOrOptions?: HTMLElement | Document | Window | UseEventListenerOptions | null,
  options?: UseEventListenerOptions,
): void {
  const savedHandler = useRef(handler);

  // 引数の型判定とデフォルト値設定を統合
  const getDefaultElement = () => (isSSR ? null : window);

  let element: HTMLElement | Document | Window | null;
  let actualOptions: UseEventListenerOptions;

  if (elementOrOptions && typeof elementOrOptions === 'object' && !('addEventListener' in elementOrOptions)) {
    // オプションオブジェクトの場合
    element = getDefaultElement();
    actualOptions = elementOrOptions;
  } else {
    // DOM要素が指定された場合、またはnullの場合
    element = (elementOrOptions as HTMLElement | Document | Window | null) || getDefaultElement();
    actualOptions = options || {};
  }

  const { enabled = true, capture = false, once = false, passive = false } = actualOptions;

  // useIsomorphicLayoutEffectで同期的にハンドラー参照を更新
  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled || !element) {
      return;
    }

    // イベントリスナーのラッパー
    const eventListener = (event: Event) => savedHandler.current(event);

    // オプションオブジェクト（依存配列の値が変わった時のみ再生成）
    const listenerOptions: AddEventListenerOptions = {
      capture,
      once,
      passive,
    };

    element.addEventListener(eventName, eventListener, listenerOptions);

    return () => {
      element.removeEventListener(eventName, eventListener, listenerOptions);
    };
  }, [eventName, element, enabled, capture, once, passive]);
}
