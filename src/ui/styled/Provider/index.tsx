import type createEmotionCache from '@/ui/lib/createEmotionCache';
import { CacheProvider, ThemeProvider } from '@/ui/styled';
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
