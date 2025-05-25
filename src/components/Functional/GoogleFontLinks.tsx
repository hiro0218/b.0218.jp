const NOTO_SANS_MONO_URL = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Mono&display=swap';

export const GoogleFontLinks = () => {
  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
      <link as="style" crossOrigin="anonymous" fetchPriority="high" href={NOTO_SANS_MONO_URL} rel="preload" />
      <link href={NOTO_SANS_MONO_URL} rel="stylesheet" />
    </>
  );
};
