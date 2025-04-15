const NOTO_SANS_MONO_URL = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Mono&display=swap';

export const GoogleFontLinks = () => {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={NOTO_SANS_MONO_URL} rel="preload" as="style" fetchPriority="high" crossOrigin="anonymous" />
      <link href={NOTO_SANS_MONO_URL} rel="stylesheet" />
    </>
  );
};
