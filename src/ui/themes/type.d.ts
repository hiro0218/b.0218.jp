import '@emotion/react';

import type { theme } from '@/ui/themes';

type ThemeProps = typeof theme;

declare module '@emotion/react' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  interface Theme extends ThemeProps {}
}
