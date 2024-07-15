import createCache from '@emotion/cache';

import { isSSR } from '@/lib/isSSR';

export default function createEmotionCache() {
  return createCache({
    key: '-',
    stylisPlugins: [],
    ...(!isSSR && {
      container: document.head,
      insertBefore: document.head.firstElementChild,
    }),
  });
}
