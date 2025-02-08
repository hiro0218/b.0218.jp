import { CacheProvider, ThemeProvider } from '@emotion/react';
import type { ReactNode } from 'react';

import type createEmotionCache from '@/ui/lib/createEmotionCache';

type Props = {
  children: ReactNode;
  emotionCache: ReturnType<typeof createEmotionCache>;
};

export const StyledProvider = ({ emotionCache, children }: Props) => {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={{}}>{children}</ThemeProvider>
    </CacheProvider>
  );
};
