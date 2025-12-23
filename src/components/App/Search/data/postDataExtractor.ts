import type { PostSummary } from '@/types/source';
import type { SearchProps } from '../types';

/**
 * PostSummary データを SearchProps に変換
 *
 * @param data - 記事サマリーデータ
 * @param popularityScores - 記事別の人気スコア（オプション）
 * @returns 検索用の記事データ
 *
 * @description
 * - title, tags, slug を抽出
 * - popularityScores から該当記事のスコアを付与
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
