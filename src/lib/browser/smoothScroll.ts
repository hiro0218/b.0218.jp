import { isSSR } from '@/lib/browser/isSSR';

/**
 * ユーザーのモーション設定に基づいてスクロール動作を決定
 * - SSR環境: 'instant' を返す
 * - prefers-reduced-motion: reduce の場合: 'instant' を返す
 * - それ以外: 'smooth' を返す
 *
 * @returns スクロール動作（'instant' または 'smooth'）
 */
const getScrollBehavior = (): ScrollBehavior => {
  if (isSSR) return 'instant';
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
};

// ページトップへのリンクを統一的に処理するため
const isTopHash = (hash: string): boolean => hash === '#top' || hash === '#';

const isSamePageLink = (anchor: HTMLAnchorElement): boolean => {
  const url = new URL(anchor.href, location.href);
  return url.origin === location.origin && url.pathname === location.pathname;
};

// URLデコードエラーや不正なIDに対する堅牢性を確保
const getTarget = (hash: string): HTMLElement | null => {
  try {
    const targetElementId = decodeURIComponent(hash.slice(1));
    return document.getElementById(targetElementId) || (isTopHash(hash) ? document.documentElement : null);
  } catch (error) {
    console.error('Failed to decode URL hash:', error);
    return null;
  }
};

const scrollToTarget = (element: HTMLElement): void => {
  try {
    element.scrollIntoView({ behavior: getScrollBehavior() });
  } catch (error) {
    console.error('Failed to scroll to target element:', error);
  }
};

const focusOnTarget = (element: HTMLElement): void => {
  try {
    element.focus({ preventScroll: true });

    // スクリーンリーダーのナビゲーション向上のため
    if (document.activeElement !== element) {
      const previousTabindex = element.getAttribute('tabindex');
      // 通常フォーカス不可能な要素でもキーボードナビゲーションできるように
      element.setAttribute('tabindex', '-1');
      element.focus({ preventScroll: true });

      // blurイベントで元のtabindex状態に復元
      element.addEventListener(
        'blur',
        () => {
          if (previousTabindex === null) {
            element.removeAttribute('tabindex');
          } else {
            element.setAttribute('tabindex', previousTabindex);
          }
        },
        { once: true },
      );
    }
  } catch (error) {
    console.error('Failed to focus on target element:', error);
  }
};

const handleSmoothScrollClick = (event: MouseEvent): void => {
  const eventTarget = event.target as HTMLElement | null;
  if (!eventTarget) return;

  const element = eventTarget.closest<HTMLAnchorElement>('a[href*="#"]');
  if (!element) return;

  // 同一ページのアンカーリンクのみ処理
  if (!isSamePageLink(element)) return;

  const hash = element.hash;
  const target = getTarget(hash);
  if (!target) return;

  event.preventDefault();

  scrollToTarget(target);
  focusOnTarget(target);

  // トップページへの移動時はURL変更を避ける
  if (!isTopHash(hash)) {
    history.pushState({}, '', hash);
  }
};

/**
 * ページ内アンカーリンクのスムーズスクロール機能を初期化
 * アクセシビリティ対応とメモリリーク防止を考慮した実装
 * @returns クリーンアップ関数 - コンポーネントのアンマウント時に呼び出す
 * @example
 * const cleanup = initializeSmoothScroll();
 * // コンポーネントのアンマウント時
 * cleanup();
 */
const initializeSmoothScroll = (): (() => void) => {
  const abortController = new AbortController();

  if (!isSSR) {
    document.addEventListener('click', handleSmoothScrollClick, {
      capture: true,
      signal: abortController.signal,
    });
  }

  return () => {
    abortController.abort();
  };
};

export default initializeSmoothScroll;
