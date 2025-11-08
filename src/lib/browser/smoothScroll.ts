import { isSSR } from '@/lib/browser/isSSR';

let cachedScrollBehavior: ScrollBehavior | null = null;

/**
 * ユーザーのモーション設定に基づいてスクロール動作を決定
 * - SSR環境: 'instant' を返す
 * - prefers-reduced-motion: reduce の場合: 'instant' を返す
 * - それ以外: 'smooth' を返す
 *
 * @returns スクロール動作（'instant' または 'smooth'）
 */
const getScrollBehavior = (): ScrollBehavior => {
  if (cachedScrollBehavior === null) {
    if (isSSR) {
      cachedScrollBehavior = 'instant';
    } else {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      cachedScrollBehavior = prefersReducedMotion ? 'instant' : 'smooth';
    }
  }

  return cachedScrollBehavior;
};

// ページトップへのリンクを統一的に処理するため
const isTopHash = (hash: string): boolean => hash === '#top' || hash === '#';

// URLデコードエラーや不正なIDに対する堅牢性を確保
const getTarget = (hash: string): HTMLElement | null => {
  try {
    const targetElementId = decodeURIComponent(hash.slice(1));
    return document.getElementById(targetElementId) || (isTopHash(hash) ? document.body : null);
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
      // 通常フォーカス不可能な要素でもキーボードナビゲーションできるように
      element.setAttribute('tabindex', '-1');
      element.focus({ preventScroll: true });
      element.removeAttribute('tabindex');
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
  // 重複初期化を防ぐため
  let isInitialized = false;
  const abortController = new AbortController();

  if (!isInitialized && !isSSR) {
    document.addEventListener('click', handleSmoothScrollClick, {
      capture: true,
      signal: abortController.signal,
    });
    isInitialized = true;
  }

  return () => {
    abortController.abort();
    isInitialized = false;
  };
};

export default initializeSmoothScroll;
