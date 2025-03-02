import type { PostListProps, TagSimilarProps, TagsListProps } from '@/types/source';

// 設定パラメータ
const MIN_CO_OCCURRENCE = 2; // 最小共起回数（ノイズ除去）
const MIN_TAG_FREQUENCY = 3; // 最小タグ出現頻度
const TIME_DECAY_FACTOR = 0.95; // 時間減衰係数（古い記事の影響を弱める）
const INDIRECT_RELATION_WEIGHT = 0.3; // 間接関係の重み
const MAX_AGE_DAYS = 365 * 2; // 最大の記事年齢（2年）

// 共起行列の型定義
type OccurrenceMatrixProps = {
  [tag: string]: {
    [relatedTag: string]: number;
  };
};

// タグの頻度情報
type TagFrequencyProps = {
  [tag: string]: {
    count: number; // 出現回数
    idf: number; // 逆文書頻度
  };
};

/**
 * タグの頻度とIDF (Inverse Document Frequency) を計算
 */
function calculateTagFrequency(posts: PostListProps[]): TagFrequencyProps {
  const tagFrequency: TagFrequencyProps = {};
  const totalPosts = posts.length;

  // 各タグの出現回数をカウント
  for (const post of posts) {
    const tags = post.tags || [];
    const processedTags = new Set<string>(); // 同じ記事内での重複を避ける

    for (const tag of tags) {
      if (!processedTags.has(tag)) {
        processedTags.add(tag);

        if (!tagFrequency[tag]) {
          tagFrequency[tag] = { count: 1, idf: 0 };
        } else {
          tagFrequency[tag].count++;
        }
      }
    }
  }

  // IDFの計算
  for (const tag in tagFrequency) {
    // idf = log(全記事数 / そのタグを含む記事数)
    const idf = Math.log(totalPosts / tagFrequency[tag].count);
    tagFrequency[tag].idf = parseFloat(idf.toFixed(4));
  }

  return tagFrequency;
}

/**
 * 時間重み付き共起行列を作成
 */
function createWeightedCoOccurrenceMatrix(posts: PostListProps[]) {
  const coOccurrenceMatrix: OccurrenceMatrixProps = {};
  const now = new Date();

  for (const post of posts) {
    const tags = post.tags || [];
    if (tags.length < 2) {
      continue; // 1つ以下のタグしかない記事はスキップ
    }

    // 記事の時間的重みを計算
    let timeWeight = 1.0;
    if (post.date) {
      const postDate = new Date(post.date);
      const ageInDays = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);
      // 古い記事ほど重みを減らす（ただし下限あり）
      timeWeight = Math.max(0.5, Math.pow(TIME_DECAY_FACTOR, Math.min(ageInDays, MAX_AGE_DAYS) / 30));
    }

    // タグの共起関係を記録
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];

      if (!coOccurrenceMatrix[tag]) {
        coOccurrenceMatrix[tag] = {};
      }

      for (let j = 0; j < tags.length; j++) {
        if (i === j) continue;

        const otherTag = tags[j];

        if (!coOccurrenceMatrix[tag][otherTag]) {
          coOccurrenceMatrix[tag][otherTag] = timeWeight;
        } else {
          coOccurrenceMatrix[tag][otherTag] += timeWeight;
        }
      }
    }
  }

  return coOccurrenceMatrix;
}

/**
 * PMI (Pointwise Mutual Information) に基づくタグ関連度を計算
 */
function calculateTagRelations(
  tags: TagsListProps,
  coOccurrenceMatrix: OccurrenceMatrixProps,
  tagFrequency: TagFrequencyProps,
) {
  const tagRelations: TagSimilarProps = {};
  const tagsKeys = Object.keys(tags);
  const totalArticles = Object.values(tags).reduce((sum, articles) => sum + articles.length, 0);

  // 高頻度のタグのみを使用（ノイズ除去）
  const validTags = tagsKeys.filter((tag) => tagFrequency[tag] && tagFrequency[tag].count >= MIN_TAG_FREQUENCY);

  // 1. 直接的な関連度の計算（PMIベース）
  for (const tag of validTags) {
    const tagArticles = tags[tag];
    const tagArticleCount = tagArticles.length;
    const coOccurrenceTags = coOccurrenceMatrix[tag] || {};

    tagRelations[tag] = {};

    for (const otherTag of validTags) {
      if (tag === otherTag) continue;

      const otherTagArticles = tags[otherTag];
      if (!otherTagArticles) continue;

      const otherTagArticleCount = otherTagArticles.length;
      const coOccurrenceCount = coOccurrenceTags[otherTag] || 0;

      // 最小共起回数を下回る場合はスキップ
      if (coOccurrenceCount < MIN_CO_OCCURRENCE) continue;

      // PMI計算: log(P(x,y) / (P(x) * P(y)))
      const px = tagArticleCount / totalArticles;
      const py = otherTagArticleCount / totalArticles;
      const pxy = coOccurrenceCount / totalArticles;

      // 確率が0になるのを避けるためのスムージング
      const smoothedPMI = Math.log((pxy + 0.00001) / (px * py + 0.00001));

      // PMI値を[0,1]の範囲に正規化して保存
      const normalizedPMI = sigmoid(smoothedPMI);

      // IDF値で重み付け（珍しいタグ間の関連ほど重要視）
      const idfWeight = (tagFrequency[tag].idf + tagFrequency[otherTag].idf) / 2;
      const finalScore = normalizedPMI * (1 + 0.5 * idfWeight);

      tagRelations[tag][otherTag] = parseFloat(finalScore.toFixed(4));
    }
  }

  // 2. 間接的な関連度の計算（グラフベース）
  const enhancedRelations = enhanceWithIndirectRelations(tagRelations);

  return enhancedRelations;
}

/**
 * 間接的な関連度も考慮した拡張関係の計算
 */
function enhanceWithIndirectRelations(directRelations: TagSimilarProps): TagSimilarProps {
  const enhancedRelations: TagSimilarProps = directRelations;

  // すべてのタグのペアについて検討
  for (const tag1 in directRelations) {
    if (!enhancedRelations[tag1]) {
      enhancedRelations[tag1] = {};
    }

    for (const tag2 in directRelations) {
      if (tag1 === tag2) continue;

      // tag1とtag2の間の直接関連度
      const directRelation = directRelations[tag1]?.[tag2] || 0;

      // 間接関係のスコアを計算
      let indirectScore = 0;
      let intermediateCount = 0;

      // 中間タグを通した間接関係を考慮
      for (const intermediateTag in directRelations) {
        if (intermediateTag === tag1 || intermediateTag === tag2) continue;

        const relation1 = directRelations[tag1]?.[intermediateTag] || 0;
        const relation2 = directRelations[intermediateTag]?.[tag2] || 0;

        if (relation1 > 0 && relation2 > 0) {
          // 中間タグを通した間接関係のスコア
          indirectScore += relation1 * relation2;
          intermediateCount++;
        }
      }

      // 間接関係が存在する場合、直接関係と組み合わせて更新
      if (intermediateCount > 0) {
        const avgIndirectScore = indirectScore / intermediateCount;
        const combinedScore = directRelation + INDIRECT_RELATION_WEIGHT * avgIndirectScore;

        // スコアが向上する場合のみ更新
        if (combinedScore > directRelation) {
          enhancedRelations[tag1][tag2] = parseFloat(combinedScore.toFixed(4));
        }
      }
    }
  }

  return enhancedRelations;
}

/**
 * タグ関連度を整列し、関連度の高い順にソート
 */
function sortTagRelations(tagRelations: TagSimilarProps) {
  const sortedTags: TagSimilarProps = {};

  for (const tag in tagRelations) {
    const relatedTags = tagRelations[tag];
    const sortedRelatedTags: Record<string, number> = {};

    // 関連度でソート
    const sortedEntries = Object.entries(relatedTags)
      .filter(([_, value]) => value > 0) // スコアが0より大きいもののみ
      .sort((a, b) => b[1] - a[1]);

    // ソートした結果を保存
    for (const [relatedTag, score] of sortedEntries) {
      sortedRelatedTags[relatedTag] = score;
    }

    sortedTags[tag] = sortedRelatedTags;
  }

  return sortedTags;
}

/**
 * シグモイド関数（値を0-1の範囲に正規化）
 */
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/**
 * 関連タグを取得する主要関数
 */
export function getRelatedTags(posts: PostListProps[], tags: TagsListProps) {
  // タグの頻度とIDFを計算
  const tagFrequency = calculateTagFrequency(posts);

  // 時間重み付き共起行列を作成
  const coOccurrenceMatrix = createWeightedCoOccurrenceMatrix(posts);

  // PMIとIDF重みに基づくタグ関連度を計算
  const tagRelations = calculateTagRelations(tags, coOccurrenceMatrix, tagFrequency);

  // 関連度の高い順にソート
  const sortedTags = sortTagRelations(tagRelations);

  return sortedTags;
}
