import kuromoji, { type IpadicFeatures, type Tokenizer } from 'kuromoji';
import type { PostProps, TagSimilarProps } from '@/types/source';

// 形態素解析時に除外する日本語ストップワード
const STOP_WORDS_JA = new Set([
  'の',
  'に',
  'は',
  'を',
  'た',
  'が',
  'で',
  'て',
  'と',
  'し',
  'れ',
  'さ',
  'ある',
  'いる',
  'も',
  'する',
  'から',
  'な',
  'こと',
  'この',
  'その',
  'あの',
  'これ',
  'それ',
  'あれ',
  'ため',
  'よう',
  'ます',
  'です',
  'なり',
  'なら',
  'へ',
  'また',
  'ない',
  'いう',
  'もの',
  'という',
  'あり',
  'まで',
  'られ',
  'なる',
  'へ',
  'か',
  'だ',
  'これら',
  'として',
  'そして',
  'について',
  'および',
  'ならびに',
  'もの',
  'こと',
  'とき',
  '場合',
  '的',
  '数',
]);

// 類似度計算パラメータ
const SIMILARITY_LIMIT = 6; // 関連投稿の最大数
const TAG_WEIGHT = 0.6; // タグ類似度の重み
const CONTENT_WEIGHT = 0.4; // コンテンツ類似度の重み
const RECENCY_BONUS_FACTOR = 0.1; // 新鮮度ボーナス係数
const RECENCY_DECAY_DAYS = 30; // 新鮮度減衰日数
const TAG_SIMILARITY_BASE_THRESHOLD = 0.5; // タグ類似度閾値
const TAG_SIMILARITY_JACCARD_WEIGHT = 0.4; // ジャッカード係数重み
const TAG_SIMILARITY_RELATED_WEIGHT = 0.6; // 関連度スコア重み

// トークナイザのインスタンス（非同期初期化用）
let tokenizer: Tokenizer<IpadicFeatures> | null = null;
const kuromojiBuilder = kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' });

async function initializeTokenizer(): Promise<Tokenizer<IpadicFeatures>> {
  return new Promise((resolve, reject) => {
    if (tokenizer) {
      resolve(tokenizer);
      return;
    }
    kuromojiBuilder.build((err, builtTokenizer) => {
      if (err) {
        console.error('Error building kuromoji tokenizer:', err);
        reject(err);
      } else {
        tokenizer = builtTokenizer;
        resolve(builtTokenizer);
      }
    });
  });
}

// 類似度計算のキャッシュ
const similarityCache = new Map<string, number>();

/**
 * テキストを形態素解析し、意味のある単語の基本形配列を返す
 */
async function preprocessText(text: string, tokenizerInstance: Tokenizer<IpadicFeatures>): Promise<string[]> {
  if (!text) {
    return [];
  }
  try {
    const tokens: IpadicFeatures[] = tokenizerInstance.tokenize(text);
    const meaningfulTokens = tokens
      .filter(
        (token) =>
          ['名詞', '動詞', '形容詞', '副詞'].includes(token.pos) &&
          !token.pos_detail_1?.includes('数') &&
          !token.pos_detail_1?.includes('接尾') &&
          token.pos !== '記号' &&
          !STOP_WORDS_JA.has(token.basic_form) &&
          token.basic_form.length > 1 &&
          !/^\d+$/.test(token.basic_form),
      )
      .map((token) => token.basic_form);
    return meaningfulTokens;
  } catch (error) {
    console.error('Error during text preprocessing with kuromoji:', error);
    return [];
  }
}

// TF-IDF計算関連の型定義
type IdfScores = Record<string, number>;
type TfScores = Record<string, number>;
type TfIdfVector = Record<string, number>;

/**
 * 全記事からIDFスコアを計算
 */
function calculateIdf(posts: PostProps[], processedContents: string[][]): IdfScores {
  const idfScores: IdfScores = {};
  const totalDocs = posts.length;
  const docFrequency: Record<string, number> = {};
  const allWords = new Set<string>();

  processedContents.forEach((words) => {
    const uniqueWordsInDoc = new Set(words);
    uniqueWordsInDoc.forEach((word) => {
      docFrequency[word] = (docFrequency[word] || 0) + 1;
      allWords.add(word);
    });
  });

  allWords.forEach((word) => {
    idfScores[word] = Math.log((totalDocs + 1) / ((docFrequency[word] || 0) + 1)) + 1;
  });

  return idfScores;
}

/**
 * 単一記事のTFスコアを計算
 */
function calculateTf(words: string[]): TfScores {
  const tfScores: TfScores = {};
  const wordCount = words.length;
  if (wordCount === 0) return tfScores;

  words.forEach((word) => {
    tfScores[word] = (tfScores[word] || 0) + 1;
  });

  for (const word in tfScores) {
    tfScores[word] /= wordCount;
  }

  return tfScores;
}

/**
 * TF-IDFベクトルを計算
 */
function calculateTfIdfVector(tfScores: TfScores, idfScores: IdfScores): TfIdfVector {
  const tfIdfVector: TfIdfVector = {};

  for (const word in tfScores) {
    if (idfScores[word] !== undefined) {
      tfIdfVector[word] = tfScores[word] * idfScores[word];
    }
  }

  return tfIdfVector;
}

/**
 * コサイン類似度を計算
 */
function calculateCosineSimilarity(vec1: TfIdfVector, vec2: TfIdfVector): number {
  const allWords = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  allWords.forEach((word) => {
    const val1 = vec1[word] || 0;
    const val2 = vec2[word] || 0;
    dotProduct += val1 * val2;
    magnitude1 += val1 * val1;
    magnitude2 += val2 * val2;
  });

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  const similarity = dotProduct / (magnitude1 * magnitude2);
  return Math.min(1, similarity); // 1以下に制限
}

/**
 * コンテンツ類似度を計算
 */
function calculateContentSimilarity(tfIdfVector1: TfIdfVector, tfIdfVector2: TfIdfVector): number {
  return calculateCosineSimilarity(tfIdfVector1, tfIdfVector2);
}

/**
 * タグ類似度を計算
 */
function calculateTagSimilarity(tags1: string[], tags2: string[], sortedTags: TagSimilarProps): number {
  if (!tags1 || !tags2 || tags1.length === 0 || tags2.length === 0 || !sortedTags) {
    return 0;
  }

  const validTags1 = tags1.filter((tag) => sortedTags[tag]);
  const validTags2 = tags2.filter((tag) => sortedTags[tag]);

  if (validTags1.length === 0 || validTags2.length === 0) {
    return 0;
  }

  // ジャッカード類似度の計算
  const tagSet1 = new Set(validTags1);
  const tagSet2 = new Set(validTags2);
  const intersection = new Set([...tagSet1].filter((tag) => tagSet2.has(tag)));
  const union = new Set([...tagSet1, ...tagSet2]);
  const jaccardSimilarity = union.size > 0 ? intersection.size / union.size : 0;

  // 関連タグスコアの計算
  let relatedTagScoreSum = 0;
  let comparisonCount = 0;

  for (const tag1 of validTags1) {
    const tagRelevanceMap = sortedTags[tag1];
    if (!tagRelevanceMap) continue;

    for (const tag2 of validTags2) {
      const relevanceScore = tagRelevanceMap[tag2];
      const dynamicThreshold =
        TAG_SIMILARITY_BASE_THRESHOLD * (1 - 0.1 * Math.min(validTags1.length, validTags2.length));

      if (relevanceScore && relevanceScore >= dynamicThreshold) {
        relatedTagScoreSum += relevanceScore;
        comparisonCount++;
      }
    }
  }

  const normalizedRelatedScore = comparisonCount > 0 ? relatedTagScoreSum / comparisonCount : 0;

  // 最終的なタグ類似度
  return jaccardSimilarity * TAG_SIMILARITY_JACCARD_WEIGHT + normalizedRelatedScore * TAG_SIMILARITY_RELATED_WEIGHT;
}

/**
 * 新鮮度ボーナスを計算（更新日を考慮）
 */
function calculateRecencyBonus(post1: PostProps, post2: PostProps): number {
  const getEffectiveDate = (post: PostProps): Date | null => {
    let effectiveDate: Date | null = null;
    let updatedDate: Date | null = null;
    let publishedDate: Date | null = null;

    if (post.updated) {
      try {
        const d = new Date(post.updated);
        if (!Number.isNaN(d.getTime())) updatedDate = d;
      } catch (_) {}
    }
    if (post.date) {
      try {
        const d = new Date(post.date);
        if (!Number.isNaN(d.getTime())) publishedDate = d;
      } catch (_) {}
    }

    if (updatedDate) effectiveDate = updatedDate;
    else if (publishedDate) effectiveDate = publishedDate;

    return effectiveDate;
  };

  const effectiveDate1 = getEffectiveDate(post1);
  const effectiveDate2 = getEffectiveDate(post2);

  if (!effectiveDate1 || !effectiveDate2) return 0;

  try {
    const diffInMs = Math.abs(effectiveDate1.getTime() - effectiveDate2.getTime());
    const decayPeriodInMs = RECENCY_DECAY_DAYS * 24 * 60 * 60 * 1000;

    if (decayPeriodInMs <= 0) return 0;

    const bonus = RECENCY_BONUS_FACTOR * Math.max(0, 1 - diffInMs / decayPeriodInMs);
    return bonus;
  } catch (error) {
    console.error(`Error calculating recency bonus between ${post1.slug} and ${post2.slug}`, error);
    return 0;
  }
}

/**
 * 投稿間の類似度を計算
 */
function calculatePostSimilarity(
  post: PostProps,
  targetPost: PostProps,
  postTfIdf: TfIdfVector,
  targetPostTfIdf: TfIdfVector,
  sortedTags: TagSimilarProps,
): number {
  if (!post.slug || !targetPost.slug) {
    console.warn('Cannot calculate similarity for posts without slugs.');
    return 0;
  }

  const cacheKey = [post.slug, targetPost.slug].sort().join('_');
  if (similarityCache.has(cacheKey)) {
    return similarityCache.get(cacheKey)!;
  }

  const tagSimilarityScore = calculateTagSimilarity(post.tags || [], targetPost.tags || [], sortedTags);
  const contentSimilarityScore = calculateContentSimilarity(postTfIdf, targetPostTfIdf);
  const recencyBonus = calculateRecencyBonus(post, targetPost);

  const weightedScore = Math.max(0, TAG_WEIGHT * tagSimilarityScore + CONTENT_WEIGHT * contentSimilarityScore);
  const finalScore = weightedScore * (1 + recencyBonus);
  const roundedScore = Math.round(Math.max(0, finalScore) * 10000) / 10000;

  similarityCache.set(cacheKey, roundedScore);
  return roundedScore;
}

/**
 * 関連投稿を取得するメイン関数
 * タグによる事前フィルタリングによりパフォーマンスを改善
 */
export async function getRelatedPosts(
  posts: PostProps[],
  sortedTags: TagSimilarProps,
): Promise<{ [key: string]: Record<string, number> }[]> {
  // 入力検証
  if (!Array.isArray(posts) || posts.length === 0 || typeof sortedTags !== 'object' || sortedTags === null) {
    console.warn('getRelatedPosts: Invalid input provided (posts or sortedTags). Returning empty array.');
    return [];
  }

  // トークナイザの初期化
  if (!tokenizer) {
    try {
      await initializeTokenizer();
      if (!tokenizer) throw new Error('Tokenizer initialization failed silently.');
    } catch (error) {
      console.error('Failed to initialize kuromoji tokenizer. Aborting.', error);
      return [];
    }
  }

  // キャッシュクリア
  similarityCache.clear();

  // 1. コンテンツ前処理（非同期）
  const processedContents = await Promise.all(
    posts.map(async (post) => {
      const textToProcess = post.content || post.title || '';
      return await preprocessText(textToProcess, tokenizer!);
    }),
  );

  // 2. IDFスコア計算
  const idfScores = calculateIdf(posts, processedContents);

  // 3. TF-IDFベクトル計算
  const tfIdfVectors: { [slug: string]: TfIdfVector } = {};
  const postIndexMap = new Map<string, number>();
  posts.forEach((post, index) => {
    if (!post.slug) return;
    postIndexMap.set(post.slug, index);
    const tfScores = calculateTf(processedContents[index]);
    tfIdfVectors[post.slug] = calculateTfIdfVector(tfScores, idfScores);
  });

  // タグによる候補絞り込みのためのインデックス作成
  const tagToPostIndices = new Map<string, Set<number>>();
  posts.forEach((post, index) => {
    post.tags?.forEach((tag) => {
      if (!tagToPostIndices.has(tag)) {
        tagToPostIndices.set(tag, new Set());
      }
      tagToPostIndices.get(tag)!.add(index);
    });
  });

  // 各記事に対して関連度計算
  const results = posts
    .map((targetPost, targetIndex) => {
      if (!targetPost.slug || !tfIdfVectors[targetPost.slug]) {
        return null;
      }
      const targetPostTfIdf = tfIdfVectors[targetPost.slug];
      const targetTags = targetPost.tags || [];

      // タグに基づく候補記事の絞り込み
      const candidateIndices = new Set<number>();
      targetTags.forEach((tag) => {
        const indices = tagToPostIndices.get(tag);
        if (indices) {
          indices.forEach((index) => {
            if (index !== targetIndex) {
              candidateIndices.add(index);
            }
          });
        }
      });

      // 絞り込んだ候補に対して類似度を計算
      const relatedPostsData = Array.from(candidateIndices)
        .map((postIndex) => {
          const post = posts[postIndex];
          if (!post || !post.slug || !tfIdfVectors[post.slug]) return null;
          const postTfIdf = tfIdfVectors[post.slug];

          const similarityScore = calculatePostSimilarity(post, targetPost, postTfIdf, targetPostTfIdf, sortedTags);

          return { slug: post.slug, similarityScore };
        })
        .filter((post): post is { slug: string; similarityScore: number } => post !== null && post.similarityScore > 0)
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, SIMILARITY_LIMIT);

      if (relatedPostsData.length === 0) {
        return null;
      }

      // 結果を指定形式に変換
      const scoredArticles = relatedPostsData.reduce<Record<string, number>>((acc, post) => {
        acc[post.slug] = post.similarityScore;
        return acc;
      }, {});

      return {
        [targetPost.slug]: scoredArticles,
      };
    })
    .filter((result): result is { [key: string]: Record<string, number> } => result !== null);

  return results;
}
