import escapeHTML from '@/lib/utils/escapeHTML';

const HIGHLIGHT_TAG_NAME = 'mark';
const keywordSplitCache = new Map<string, string[]>();
const KEYWORD_CACHE_SIZE = 50;

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
 * XSS対策のためHTMLエスケープした上でキーワード部分を<mark>タグでマークアップ
 */
export const createMarkedTitles = (suggestions: { title: string }[], keyword: string) => {
  let splitKeyword = keywordSplitCache.get(keyword);

  if (!splitKeyword) {
    splitKeyword = keyword.split(' ').filter((word) => word.trim() !== '');

    // Mapのサイズ制限を超えた場合、最も古いエントリを削除してメモリ使用量を抑える
    if (keywordSplitCache.size > KEYWORD_CACHE_SIZE) {
      const firstKey = keywordSplitCache.keys().next().value;
      keywordSplitCache.delete(firstKey);
    }

    keywordSplitCache.set(keyword, splitKeyword);
  }

  return suggestions.map(({ title }) => markEscapedHTML(title, splitKeyword));
};
