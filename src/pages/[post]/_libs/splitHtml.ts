export function splitHtml(html: string): { before: string; after: string } {
  const regex = /<h2\b[^>]*>(.*?)<\/h2>/gi;
  const matches = html.match(regex);

  if (!matches || matches.length < 2) {
    // 2番目の<h2>が見つからない場合
    return {
      before: html,
      after: '',
    };
  }

  // 2番目の<h2>までの位置を取得
  const splitIndex = html.indexOf(matches[1]);

  if (splitIndex !== -1) {
    return {
      before: html.substring(0, splitIndex),
      after: html.substring(splitIndex),
    };
  }

  return {
    before: html,
    after: '',
  };
}
