import escapeHTML from '@/lib/escapeHTML';

const HIGHLIGHT_TAG_NAME = 'mark';

const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const markEscapedHTML = (() => {
  const regexCache = new Map<string, RegExp>();

  return (text: string, markTexts: string[]) => {
    const escapedText = escapeHTML(text);

    if (markTexts.length === 0 || markTexts.every((t) => t.trim() === '')) {
      return escapedText;
    }

    const escapedMarkTexts = markTexts.map(escapeRegExp);
    const cacheKey = escapedMarkTexts.join('|');

    let regEx = regexCache.get(cacheKey);
    if (!regEx) {
      regEx = new RegExp(cacheKey, 'gi');
      if (regexCache.size > 100) {
        const firstKey = regexCache.keys().next().value;
        regexCache.delete(firstKey);
      }
      regexCache.set(cacheKey, regEx);
    }

    return escapedText.replace(regEx, `<${HIGHLIGHT_TAG_NAME}>$&</${HIGHLIGHT_TAG_NAME}>`);
  };
})();

/**
 * 検索キーワードにマッチする部分をマークアップしたタイトル配列を生成
 * @param suggestions - 検索結果の配列
 * @param keyword - 検索キーワード（スペース区切り）
 * @returns マークアップされたHTML文字列の配列
 */
export const createMarkedTitles = (suggestions: { title: string }[], keyword: string) => {
  const splitKeyword = keyword.split(' ').filter((word) => word.trim() !== '');
  return suggestions.map(({ title }) => markEscapedHTML(title, splitKeyword));
};
