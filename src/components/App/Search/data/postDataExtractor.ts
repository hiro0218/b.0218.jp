import type { PostSummary } from '@/types/source';
import type { SearchProps } from '../types';

/**
 * Extracts search-relevant properties and merges popularity scores
 */
export const extractSearchProps = (
  data: PostSummary[],
  popularityScores: Record<string, number> = {},
): SearchProps[] => {
  return data.map(({ title, tags, slug }) => ({
    title,
    tags,
    slug,
    score: popularityScores[slug],
  }));
};
