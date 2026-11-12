/**
 * 検索語ごとの結果と、部分一致のトークンをキャッシュしない。
 * 実データ（索引語 999・記事 618）では、キャッシュなしの検索が中央値 0.02〜0.33ms で、入力の debounce（300ms）よりずっと短く、キャッシュの効果がない。
 */

import { normalizeSearchToken, type SearchDataItem, type SearchDataPayload } from '@/lib/search';

const MAX_SEARCH_RESULTS = 100;
const QUERY_WHITESPACE_REGEX = /\s+/;

const SCORE = {
  exactMatch: 10,
  partialMatch: 3,
  titleMatch: 50,
  tagExact: 30,
  tagPartial: 15,
  tagContains: 10,
  allTokensExact: 20,
  compoundWord: 40,
  fallbackExactTitle: 30,
  fallbackWordBoundary: 20,
  fallbackEarlyPosition: 10,
} as const;

/**
 * matchedTag は、タイトルにクエリ全体が含まれず、タグ経由でだけ一致した記事の、一致した最初のタグ（記事のタグ順）。
 * タイトルにも一致した記事には付けない。タイトルの太字で一致の理由が見えるため。
 */
export type SearchResult = {
  slug: string;
  title: string;
  matchedTag?: string;
};

export type SearchEngine = {
  search: (query: string) => SearchResult[];
};

interface NormalizedSearchDataItem extends SearchDataItem {
  titleLower: string;
  tagsLower: string[];
}

type MatchType = 'exact' | 'partial';
type TokenMatch = { token: string; matchType: MatchType };
type Candidate = { exactMatches: number; partialMatches: number; indexTokens: Set<string>; queryTokens: Set<string> };
type ScoredSearchResult = SearchResult & { id: number; score: number };

export function tokenizeQuery(query: string): string[] {
  const normalized = normalizeSearchToken(query);
  if (!normalized) return [];

  return [...new Set(normalized.split(QUERY_WHITESPACE_REGEX))];
}

function toSearchResult({ id: _id, score: _score, ...item }: ScoredSearchResult): SearchResult {
  return item;
}

function calculateTagScore(tagsLower: string[], queryTokens: string[]): { score: number; firstMatchIndex: number } {
  let score = 0;
  let firstMatchIndex = -1;

  for (const [tagIndex, tagLower] of tagsLower.entries()) {
    for (const queryToken of queryTokens) {
      if (tagLower === queryToken) {
        score += SCORE.tagExact;
      } else if (tagLower.includes(queryToken)) {
        score += SCORE.tagPartial;
      } else if (queryToken.includes(tagLower)) {
        score += SCORE.tagContains;
      } else {
        continue;
      }

      if (firstMatchIndex === -1) firstMatchIndex = tagIndex;
    }
  }

  return { score, firstMatchIndex };
}

function calculateCompoundWordBonus(indexTokens: Set<string>, queryTokens: string[]): number {
  for (const indexToken of indexTokens) {
    let matchCount = 0;
    for (const queryToken of queryTokens) {
      if (!indexToken.includes(queryToken)) continue;

      matchCount++;
      if (matchCount >= 2) {
        return SCORE.compoundWord;
      }
    }
  }
  return 0;
}

export function createSearchEngine({ searchIndex, searchData }: SearchDataPayload): SearchEngine {
  const normalizedSearchData: NormalizedSearchDataItem[] = searchData.map((item) => ({
    ...item,
    titleLower: normalizeSearchToken(item.title),
    tagsLower: item.tags.map(normalizeSearchToken),
  }));
  const indexTokenKeys = Object.keys(searchIndex);
  const indexTokensByFirstChar = new Map<string, string[]>();

  for (const token of indexTokenKeys) {
    const firstChar = token[0];
    if (!firstChar) continue;

    const bucket = indexTokensByFirstChar.get(firstChar);
    if (bucket) {
      bucket.push(token);
    } else {
      indexTokensByFirstChar.set(firstChar, [token]);
    }
  }

  function getIndexedItemIds(token: string): number[] | undefined {
    if (!Object.hasOwn(searchIndex, token)) return undefined;

    const itemIds = searchIndex[token];
    return Array.isArray(itemIds) ? itemIds : undefined;
  }

  // 部分一致で全 indexToken を走査しない。性能のため、先頭文字が同じ indexToken だけを走査する（先頭文字の bucket が無いときだけ、全て走査する）。
  // 例: `script` クエリでは `javascript`（先頭 `j`）にヒットしない
  function findMatchingTokens(queryToken: string): TokenMatch[] {
    const matches: TokenMatch[] = [];

    if (getIndexedItemIds(queryToken) !== undefined) {
      matches.push({ token: queryToken, matchType: 'exact' });
    }

    const candidateTokens = indexTokensByFirstChar.get(queryToken[0]) ?? indexTokenKeys;
    for (const indexToken of candidateTokens) {
      if (indexToken !== queryToken && indexToken.includes(queryToken)) {
        matches.push({ token: indexToken, matchType: 'partial' });
      }
    }

    return matches;
  }

  function searchByTitleFallback(queryLower: string, excludeIds: Set<number>): SearchResult[] {
    const results: Array<SearchResult & { score: number }> = [];

    for (const [itemId, data] of normalizedSearchData.entries()) {
      if (excludeIds.has(itemId)) continue;

      const matchIndex = data.titleLower.indexOf(queryLower);
      if (matchIndex !== -1) {
        let score = SCORE.titleMatch;

        if (data.titleLower === queryLower) {
          score += SCORE.fallbackExactTitle;
        } else if (
          matchIndex === 0 ||
          data.titleLower[matchIndex - 1] === ' ' ||
          data.titleLower[matchIndex - 1] === '[' ||
          data.titleLower[matchIndex - 1] === ']'
        ) {
          score += SCORE.fallbackWordBoundary;
        }

        score += Math.max(0, SCORE.fallbackEarlyPosition - Math.floor(matchIndex / 10));

        results.push({ slug: data.slug, title: data.title, score });
      }
    }

    results.sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return a.title.localeCompare(b.title, 'ja');
    });

    return results.slice(0, MAX_SEARCH_RESULTS).map(({ score, ...item }) => item);
  }

  function search(searchValue: string): SearchResult[] {
    const queryTokens = tokenizeQuery(searchValue);
    if (queryTokens.length === 0) {
      return [];
    }

    const candidates = new Map<number, Candidate>();

    for (const queryToken of queryTokens) {
      for (const { token: indexToken, matchType } of findMatchingTokens(queryToken)) {
        const itemIds = getIndexedItemIds(indexToken);
        if (!itemIds) continue;

        for (const itemId of itemIds) {
          let candidate = candidates.get(itemId);
          if (!candidate) {
            candidate = { exactMatches: 0, partialMatches: 0, indexTokens: new Set(), queryTokens: new Set() };
            candidates.set(itemId, candidate);
          }
          candidate[matchType === 'exact' ? 'exactMatches' : 'partialMatches']++;
          candidate.indexTokens.add(indexToken);
          candidate.queryTokens.add(queryToken);
        }
      }
    }

    const scored: ScoredSearchResult[] = [];
    const queryLower = normalizeSearchToken(searchValue);

    for (const [itemId, candidate] of candidates) {
      if (queryTokens.length > 1 && candidate.queryTokens.size < queryTokens.length) continue;

      const data = normalizedSearchData[itemId];
      if (!data) continue;

      let score = candidate.exactMatches * SCORE.exactMatch + candidate.partialMatches * SCORE.partialMatch;

      const hasTitleMatch = data.titleLower.includes(queryLower);
      if (hasTitleMatch) {
        score += SCORE.titleMatch;
      }

      const tagResult = calculateTagScore(data.tagsLower, queryTokens);
      score += tagResult.score;

      if (queryTokens.length > 1 && candidate.exactMatches === queryTokens.length) {
        score += SCORE.allTokensExact;
      }

      if (queryTokens.length > 1) {
        score += calculateCompoundWordBonus(candidate.indexTokens, queryTokens);
      }

      scored.push({
        id: itemId,
        slug: data.slug,
        title: data.title,
        matchedTag:
          !hasTitleMatch && tagResult.firstMatchIndex !== -1 ? data.tags[tagResult.firstMatchIndex] : undefined,
        score,
      });
    }

    scored.sort((a, b) => b.score - a.score);

    const indexedResults = scored.slice(0, MAX_SEARCH_RESULTS).map(toSearchResult);

    if (indexedResults.length >= MAX_SEARCH_RESULTS) {
      return indexedResults;
    }

    const indexedIds = new Set(scored.map((result) => result.id));
    const fallbackResults = searchByTitleFallback(queryLower, indexedIds);

    return [...indexedResults, ...fallbackResults].slice(0, MAX_SEARCH_RESULTS);
  }

  return { search };
}
