import { isSSR } from '@/lib/browser/isSSR';

/**
 * ユーザーのモーション設定に基づいてスクロール動作を決定
 * - SSR環境: 'instant' を返す
 * - prefers-reduced-motion: reduce の場合: 'instant' を返す
 * - それ以外: 'smooth' を返す
 *
 * @returns スクロール動作（'instant' または 'smooth'）
 */
export const getScrollBehavior = (): ScrollBehavior => {
  if (isSSR) return 'instant';
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
};

// ページトップへのリンクを統一的に処理するため
const isTopHash = (hash: string): boolean => hash === '#top' || hash === '#';

const isSamePageLink = (anchor: HTMLAnchorElement): boolean => {
  const url = new URL(anchor.href, location.href);
  return url.origin === location.origin && url.pathname === location.pathname;
};

// URL-encoded 形式 (例: %E8%83%8C%E6%99%AF) を id 属性に使用している場合があるため、ハッシュの生の値とデコード後の値の両方で要素を検索する
const getTarget = (hash: string): HTMLElement | null => {
  if (isTopHash(hash)) return document.documentElement;

  const rawId = hash.slice(1);
  const byRaw = document.getElementById(rawId);
  if (byRaw) return byRaw;

  try {
    const decodedId = decodeURIComponent(rawId);
    if (decodedId !== rawId) {
      return document.getElementById(decodedId);
    }
  } catch (error) {
    console.error('Failed to decode URL hash:', error);
  }
  return null;
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

/** URL を更新したあとに実行したい処理を受け取り、ルーターの再描画が確定してから実行する */
type RunAfterUrlUpdate = (task: () => void) => void;

// history.pushState は Next.js のルーターに URL の変更を伝え、ルーターは再描画で searchParams を作り直す。
// ClientSideScrollRestorer（next-scroll-restorer）はこれを遷移とみなし、履歴に記録済みの位置へ scrollTo(instant) で戻す。
// スクロールを先に始めて、あとで pushState する順にしない。スクロールの最初のフレームの位置が履歴に記録され、再描画の確定が遅れた場合
// （記事の末尾からの目次など）に、復元がアニメーションを打ち切って、移動先に着かない。
// 打ち切られたら scrollend で再実行する形にしない。着いたかどうかの推測が要り、位置を二度動かす。
const createClickHandler =
  (runAfterUrlUpdate: RunAfterUrlUpdate) =>
  (event: MouseEvent): void => {
    const eventTarget = event.target;
    if (!(eventTarget instanceof Element)) return;

    const element = eventTarget.closest<HTMLAnchorElement>('a[href*="#"]');
    if (!element) return;

    if (!isSamePageLink(element)) return;

    const hash = element.hash;
    const target = getTarget(hash);
    if (!target) return;

    event.preventDefault();

    focusOnTarget(target);

    // ページトップへの移動では、URL を変えず runAfterUrlUpdate も使わない。ルーターの再描画が起きないので、待たずにスクロールする
    if (isTopHash(hash)) {
      scrollToTarget(target);
      return;
    }

    history.pushState({}, '', hash);
    runAfterUrlUpdate(() => scrollToTarget(target));
  };

/**
 * @param runAfterUrlUpdate 省略可能にしない。省略時に即時実行する既定値を持たせると、
 * createClickHandler の上の注記が退けている動き（再描画の確定前にスクロールを始める）を、省略するだけで選べてしまうため。
 * @returns クリーンアップ関数。コンポーネントのアンマウント時に呼び出す
 */
const initializeSmoothScroll = (runAfterUrlUpdate: RunAfterUrlUpdate): (() => void) => {
  const abortController = new AbortController();

  if (!isSSR) {
    document.addEventListener('click', createClickHandler(runAfterUrlUpdate), {
      capture: true,
      signal: abortController.signal,
    });
  }

  return () => {
    abortController.abort();
  };
};

export default initializeSmoothScroll;
