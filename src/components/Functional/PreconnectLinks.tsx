/**
 * パフォーマンス最適化のための preconnect/dns-prefetch リンク
 */
export const PreconnectLinks = () => {
  return (
    <>
      <link crossOrigin="anonymous" href="https://www.googletagmanager.com" rel="preconnect" />
      <link crossOrigin="anonymous" href="https://www.google.com" rel="preconnect" />
      <link crossOrigin="anonymous" href="https://googleads.g.doubleclick.net" rel="preconnect" />
      <link crossOrigin="anonymous" href="https://adtrafficquality.google" rel="dns-prefetch" />
    </>
  );
};
