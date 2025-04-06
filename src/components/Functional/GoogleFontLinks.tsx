import uniqueChars from '~/dist/uniqueChars';

/** Google Fontsが受け付けられる限界文字数があるため8000文字程度に制限する */
const MAX_URL_LENGTH = 8000;
const BASE_URL = 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400..900&display=swap';

export const GoogleFontLinks = () => {
  const links: string[] = [];
  let currentChunk = '';

  for (const char of uniqueChars) {
    // 現在の chunk に新しい文字を追加した場合、エンコード後の長さが制限を超えるかをチェック
    if (encodeURIComponent(currentChunk + char).length > MAX_URL_LENGTH) {
      links.push(`${BASE_URL}&text=${encodeURIComponent(currentChunk)}`);
      currentChunk = ''; // 新しい chunk を開始
    }
    currentChunk += char;
  }

  // 最後の chunk を追加
  if (currentChunk) {
    links.push(`${BASE_URL}&text=${encodeURIComponent(currentChunk)}`);
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {links.map((url, index) => (
        <link
          key={`preload-${index}`}
          href={url}
          rel="preload"
          as="style"
          fetchPriority="high"
          crossOrigin="anonymous"
        />
      ))}
      {links.map((url, index) => (
        <link key={`stylesheet-${index}`} href={url} rel="stylesheet" />
      ))}
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Mono&display=swap" rel="stylesheet" />
    </>
  );
};
