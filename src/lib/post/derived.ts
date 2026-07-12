import { createEagerSource } from '@/lib/distLoader/eagerSource';
import { isObject } from '@/lib/utils/isObject';
import type { PopularityDetail, PostPopularityScores, PostSimilarityIndex } from '@/types/source';
import postsPopularData from '~/dist/posts-popular.json';
import postsSimilarityData from '~/dist/posts-similarity.json';

function isPopularityDetail(value: unknown): value is PopularityDetail {
  return (
    isObject(value) &&
    typeof value.total === 'number' &&
    typeof value.ga === 'number' &&
    typeof value.hatena === 'number'
  );
}

function isPostPopularityScores(value: unknown): value is PostPopularityScores {
  return isObject(value) && Object.values(value).every(isPopularityDetail);
}

function isScoreMap(value: unknown): value is Record<string, number> {
  return isObject(value) && Object.values(value).every((score) => typeof score === 'number');
}

function isPostSimilarityIndex(value: unknown): value is PostSimilarityIndex {
  return isObject(value) && Object.values(value).every(isScoreMap);
}

// 派生データは Source 対象外 (追加ドメイン規則を持たない) だが、壊れた dist を
// 検出する fail-fast の仕組み (読み込み + キャッシュ + shape 検証 + throw) は
// Source と同じ内部機構 (createEagerSource) を共有する。
const postsPopularSource = createEagerSource<PostPopularityScores>({
  data: postsPopularData,
  validate: isPostPopularityScores,
  label: 'posts-popular',
});

const postsSimilaritySource = createEagerSource<PostSimilarityIndex>({
  data: postsSimilarityData,
  validate: isPostSimilarityIndex,
  label: 'posts-similarity',
});

/** 記事スラッグごとの人気度スコアを取得する。 */
export function getPostsPopular(): PostPopularityScores {
  return postsPopularSource.get();
}

/** 記事スラッグごとの類似記事インデックスを取得する。 */
export function getSimilarPosts(): PostSimilarityIndex {
  return postsSimilaritySource.get();
}
