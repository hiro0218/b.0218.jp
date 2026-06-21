const keywordSplitCache = new Map<string, string[]>();
const KEYWORD_CACHE_SIZE = 50;

const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * ハイライト描画用のタイトルセグメント。
 * `marked` が true の区間を `<mark>` で強調する。
 */
export type TitleSegment = {
  text: string;
  marked: boolean;
  /** タイトル内の開始位置。React リストの key に使用する */
  start: number;
};

const buildSegments = (() => {
  const regexCache = new Map<string, RegExp>();

  return (text: string, markTexts: string[]): TitleSegment[] => {
    const nonEmptyMarks = markTexts.filter((t) => t.trim() !== '');

    if (nonEmptyMarks.length === 0) {
      return [{ text, marked: false, start: 0 }];
    }

    const cacheKey = nonEmptyMarks.map(escapeRegExp).join('|');

    let regEx = regexCache.get(cacheKey);
    if (!regEx) {
      regEx = new RegExp(cacheKey, 'gi');
      if (regexCache.size > 100) {
        const firstKey = regexCache.keys().next().value;
        if (firstKey !== undefined) regexCache.delete(firstKey);
      }
      regexCache.set(cacheKey, regEx);
    }

    const segments: TitleSegment[] = [];
    let lastIndex = 0;

    for (const match of text.matchAll(regEx)) {
      const start = match.index ?? 0;
      if (start > lastIndex) {
        segments.push({ text: text.slice(lastIndex, start), marked: false, start: lastIndex });
      }
      segments.push({ text: match[0], marked: true, start });
      lastIndex = start + match[0].length;
    }

    if (lastIndex < text.length) {
      segments.push({ text: text.slice(lastIndex), marked: false, start: lastIndex });
    }

    return segments;
  };
})();

/**
 * キーワードに一致する区間をハイライトするためのセグメント配列を生成する。
 * React の children として描画する前提のため HTML エスケープは行わない
 * （React が自動でエスケープするため XSS の懸念はない）。
 */
export const createMarkedTitles = (suggestions: { title: string }[], keyword: string): TitleSegment[][] => {
  let splitKeyword = keywordSplitCache.get(keyword);

  if (!splitKeyword) {
    splitKeyword = keyword.split(' ').filter((word) => word.trim() !== '');

    if (keywordSplitCache.size > KEYWORD_CACHE_SIZE) {
      const firstKey = keywordSplitCache.keys().next().value;
      if (firstKey !== undefined) keywordSplitCache.delete(firstKey);
    }

    keywordSplitCache.set(keyword, splitKeyword);
  }

  return suggestions.map(({ title }) => buildSegments(title, splitKeyword));
};
