import { isSSR } from '@/lib/isSSR';

/** Determine if the user has set a reduced motion effect */
const isPrefersReduced = !isSSR ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

/** en: If the setting to reduce the parallax effect is set, set the scroll behavior to 'instant', otherwise set it to 'smooth' */
const scrollBehavior = isPrefersReduced ? 'instant' : 'smooth';

/** Returns true if the hash is '#top' or '#' */
const isTopHash = (hash: string): boolean => hash === '#top' || hash === '#';

/** Get the target element from the hash part of the anchor link */
const getTarget = (hash: string): HTMLElement | null => {
  const targetElementId = decodeURIComponent(hash.slice(1));
  return document.getElementById(targetElementId) || (isTopHash(hash) && document.body);
};

/** Scroll to the target element */
const scrollToTarget = (element: HTMLElement): void => {
  element.scrollIntoView({ behavior: scrollBehavior });
};

/** Focus on the target element */
const focusOnTarget = (element: HTMLElement): void => {
  // Set focus on the target element
  element.focus({ preventScroll: true });

  // If the active element is not the target element
  if (document.activeElement !== element) {
    // Temporarily set the tabindex of the target element to -1
    element.setAttribute('tabindex', '-1');
    // Set focus again
    element.focus({ preventScroll: true });
  }
};

const initializeSmoothScroll = (): void => {
  document.addEventListener(
    'click',
    (event) => {
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
    },
    { capture: true },
  );
};

export default initializeSmoothScroll;
