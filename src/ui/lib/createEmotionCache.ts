import createCache from '@emotion/cache';

export default function createEmotionCache() {
  const isSSR = typeof document === 'undefined';

  return createCache({
    key: '-',
    stylisPlugins: [],
    ...(!isSSR && {
      container: document.head,
      insertBefore: document.head.firstElementChild,
    }),
  });
}
