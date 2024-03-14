import { CacheProvider, ThemeProvider } from '@emotion/react';

import type createEmotionCache from '@/ui/lib/createEmotionCache';
import { theme } from '@/ui/themes';

type Props = {
  children: React.ReactNode;
  emotionCache: ReturnType<typeof createEmotionCache>;
};

export const StyledProvider = ({ emotionCache, children }: Props) => {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  );
};
