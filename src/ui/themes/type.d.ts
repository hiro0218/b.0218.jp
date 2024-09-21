import '@emotion/react';

import type { theme } from '@/ui/themes';

type ThemeProps = typeof theme;

declare module '@emotion/react' {
  interface Theme extends ThemeProps { }
}
