import { isSSR } from '@/lib/isSSR';

/** ユーザーが簡易動作効果を設定しているかどうかを判定する */
const isPrefersReduced: boolean = !isSSR ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

/** パララックス効果を簡易化する設定がされている場合はスクロール動作を「instant」に、そうでない場合は「smooth」に設定する */
const scrollBehavior: ScrollBehavior = isPrefersReduced ? 'instant' : 'smooth';

/** ハッシュが'#top'または'#'である場合にtrueを返す */
const isTopHash = (hash: string): boolean => hash === '#top' || hash === '#';

/** アンカーリンクのハッシュ部分から対象の要素を取得する */
const getTarget = (hash: string): HTMLElement | null => {
  try {
    const targetElementId = decodeURIComponent(hash.slice(1));
    return document.getElementById(targetElementId) || (isTopHash(hash) ? document.body : null);
  } catch (error) {
    console.error('Error decoding hash:', error);
    return null;
  }
};

const scrollToTarget = (element: HTMLElement): void => {
  try {
    element.scrollIntoView({ behavior: scrollBehavior });
  } catch (error) {
    console.error('Error scrolling to target:', error);
  }
};

const focusOnTarget = (element: HTMLElement): void => {
  try {
    element.focus({ preventScroll: true });

    // アクティブな要素が対象要素でない場合
    if (document.activeElement !== element) {
      // tabindexを一時的に設定し、フォーカス後に削除する（非フォーカス可能要素対応）
      element.setAttribute('tabindex', '-1');
      element.focus({ preventScroll: true });
      element.removeAttribute('tabindex');
    }
  } catch (error) {
    console.error('Error focusing on target:', error);
  }
};

/** スムーズスクロールのクリックイベントを処理する */
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

  if (!isTopHash(hash)) {
    history.pushState({}, '', hash);
  }
};

/** スムーズスクロール機能を初期化する */
const initializeSmoothScroll = (): void => {
  document.addEventListener('click', handleSmoothScrollClick, { capture: true });
};

export default initializeSmoothScroll;
