import kuromoji, { type IpadicFeatures, type Tokenizer } from 'kuromoji';
import type { Post, TagSimilarityScores } from '@/types/source';
import { createError, type ErrorInfo, ErrorKind, failure, type Result, success, tryCatch } from './result';

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

// 正規表現パターン
const REGEX_DIGIT_ONLY = /^\d+$/;

// 類似度計算パラメータ
const SIMILARITY_LIMIT = 6; // 関連投稿の最大数
const TAG_WEIGHT = 0.6; // タグ類似度の重み
const CONTENT_WEIGHT = 0.4; // コンテンツ類似度の重み
const RECENCY_BONUS_FACTOR = 0.1; // 新鮮度ボーナス係数
const RECENCY_DECAY_DAYS = 30; // 新鮮度減衰日数
const TAG_SIMILARITY_BASE_THRESHOLD = 0.5; // タグ類似度閾値
const TAG_SIMILARITY_JACCARD_WEIGHT = 0.4; // ジャッカード係数重み
const TAG_SIMILARITY_RELATED_WEIGHT = 0.6; // 関連度スコア重み

// エラー定義
export const PostError = {
  // biome-ignore lint/style/useNamingConvention: エラー型の命名規則を維持
  InvalidInput: (message: string): ErrorInfo => createError(ErrorKind.INVALID_INPUT, message),
  // biome-ignore lint/style/useNamingConvention: エラー型の命名規則を維持
  TokenizerError: (message: string, cause?: unknown): ErrorInfo =>
    createError(ErrorKind.INITIALIZATION_ERROR, message, cause),
  // biome-ignore lint/style/useNamingConvention: エラー型の命名規則を維持
  ProcessingError: (message: string, cause?: unknown): ErrorInfo =>
    createError(ErrorKind.PROCESSING_ERROR, message, cause),
};

// トークナイザ初期化用のシングルトン
let tokenizerPromise: Promise<Tokenizer<IpadicFeatures>> | null = null;

/**
 * 形態素解析器を初期化する（シングルトン）
 */
async function getTokenizer(): Promise<Result<Tokenizer<IpadicFeatures>, ErrorInfo>> {
  if (!tokenizerPromise) {
    tokenizerPromise = new Promise((resolve, reject) => {
      const builder = kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' });
      builder.build((err, tokenizer) => {
        if (err) {
          reject(err);
        } else {
          resolve(tokenizer);
        }
      });
    });
  }

  try {
    const tokenizer = await tokenizerPromise;
    return success(tokenizer);
  } catch (error) {
    return failure(PostError.TokenizerError('形態素解析器の初期化に失敗しました', error));
  }
}

// キャッシュの初期化
const similarityCache = new Map<string, number>();
const tfIdfCache = new Map<string, Record<string, number>>();

/**
 * テキストを形態素解析し、意味のある単語の基本形配列を返す
 */
async function preprocessText(
  text: string,
  tokenizerInstance: Tokenizer<IpadicFeatures>,
): Promise<Result<string[], ErrorInfo>> {
  if (!text) {
    return success([]);
  }

  return await tryCatch(
    async () => {
      const tokens: IpadicFeatures[] = tokenizerInstance.tokenize(text);
      const meaningfulTokens: string[] = [];

      for (const token of tokens) {
        // 意味のある単語のみを抽出（条件チェックの短絡評価を活用）
        if (token.pos === '名詞' || token.pos === '動詞' || token.pos === '形容詞' || token.pos === '副詞') {
          if (token.pos_detail_1 && (token.pos_detail_1.includes('数') || token.pos_detail_1.includes('接尾'))) {
            continue;
          }
          if (token.pos === '記号' || STOP_WORDS_JA.has(token.basic_form) || token.basic_form.length <= 1) {
            continue;
          }
          if (REGEX_DIGIT_ONLY.test(token.basic_form)) {
            continue;
          }
          meaningfulTokens.push(token.basic_form);
        }
      }
      return meaningfulTokens;
    },
    (error) => PostError.ProcessingError('テキスト前処理中にエラーが発生しました', error),
  );
}

// TF-IDF計算関連の型定義
type IdfScores = Record<string, number>;
type TfScores = Record<string, number>;
type TfIdfVector = Record<string, number>;

/**
 * 全記事からIDFスコアを計算
 */
function calculateIdf(posts: Post[], processedContents: string[][]): Result<IdfScores, ErrorInfo> {
  try {
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

    return success(idfScores);
  } catch (error) {
    return failure(PostError.ProcessingError('IDF計算中にエラーが発生しました', error));
  }
}

/**
 * 単一記事のTFスコアを計算
 */
function calculateTf(words: string[]): Result<TfScores, ErrorInfo> {
  try {
    const tfScores: TfScores = {};
    const wordCount = words.length;
    if (wordCount === 0) return success(tfScores);

    words.forEach((word) => {
      tfScores[word] = (tfScores[word] || 0) + 1;
    });

    for (const word in tfScores) {
      tfScores[word] /= wordCount;
    }

    return success(tfScores);
  } catch (error) {
    return failure(PostError.ProcessingError('TF計算中にエラーが発生しました', error));
  }
}

/**
 * TF-IDFベクトルを計算（キャッシュを利用）
 */
function calculateTfIdfVector(slug: string, tfScores: TfScores, idfScores: IdfScores): Result<TfIdfVector, ErrorInfo> {
  // キャッシュをチェック
  const cacheKey = `tfidf_${slug}`;
  const cachedVector = tfIdfCache.get(cacheKey);
  if (cachedVector) {
    return success(cachedVector);
  }

  try {
    const tfIdfVector: TfIdfVector = {};

    for (const word in tfScores) {
      if (idfScores[word] !== undefined) {
        tfIdfVector[word] = tfScores[word] * idfScores[word];
      }
    }

    // 計算結果をキャッシュに保存
    tfIdfCache.set(cacheKey, tfIdfVector);
    return success(tfIdfVector);
  } catch (error) {
    return failure(PostError.ProcessingError('TF-IDF計算中にエラーが発生しました', error));
  }
}

/**
 * コサイン類似度を計算
 */
function calculateCosineSimilarity(vec1: TfIdfVector, vec2: TfIdfVector): Result<number, ErrorInfo> {
  try {
    // ベクトルの大きさとドット積を一度に計算（ループ最適化）
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    // 一般的に多くの単語がゼロの値を持つため、非ゼロ値のみを処理
    // まず第1ベクトルの非ゼロ値を処理
    for (const word in vec1) {
      const val1 = vec1[word];
      if (val1 === 0) continue;
      magnitude1 += val1 * val1;

      const val2 = vec2[word] || 0;
      if (val2 !== 0) {
        dotProduct += val1 * val2;
      }
    }

    // 次に第2ベクトルの非ゼロ値を処理（vec2に固有の単語のみ）
    for (const word in vec2) {
      const val2 = vec2[word];
      if (val2 === 0) continue;
      magnitude2 += val2 * val2;

      // vec1に含まれない単語は既に上のループで処理済みなので、
      // ここではdotProductに加算しない
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) {
      return success(0);
    }

    const similarity = dotProduct / (magnitude1 * magnitude2);
    return success(Math.min(1, similarity)); // 1以下に制限
  } catch (error) {
    return failure(PostError.ProcessingError('コサイン類似度計算中にエラーが発生しました', error));
  }
}

/**
 * コンテンツ類似度を計算
 */
function calculateContentSimilarity(tfIdfVector1: TfIdfVector, tfIdfVector2: TfIdfVector): Result<number, ErrorInfo> {
  return calculateCosineSimilarity(tfIdfVector1, tfIdfVector2);
}

/**
 * タグ類似度を計算
 */
function calculateTagSimilarity(
  tags1: string[],
  tags2: string[],
  sortedTags: TagSimilarityScores,
): Result<number, ErrorInfo> {
  try {
    if (!tags1 || !tags2 || tags1.length === 0 || tags2.length === 0 || !sortedTags) {
      return success(0);
    }

    const validTags1 = tags1.filter((tag) => sortedTags[tag]);
    const validTags2 = tags2.filter((tag) => sortedTags[tag]);

    if (validTags1.length === 0 || validTags2.length === 0) {
      return success(0);
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
    return success(
      jaccardSimilarity * TAG_SIMILARITY_JACCARD_WEIGHT + normalizedRelatedScore * TAG_SIMILARITY_RELATED_WEIGHT,
    );
  } catch (error) {
    return failure(PostError.ProcessingError('タグ類似度計算中にエラーが発生しました', error));
  }
}

/**
 * 新鮮度ボーナスを計算（更新日を考慮）
 */
function calculateRecencyBonus(post1: Post, post2: Post): Result<number, ErrorInfo> {
  try {
    const getEffectiveDate = (post: Post): Date | null => {
      let effectiveDate: Date | null = null;
      let updatedDate: Date | null = null;
      let publishedDate: Date | null = null;

      if (post.updated) {
        try {
          const d = new Date(post.updated);
          if (!Number.isNaN(d.getTime())) updatedDate = d;
        } catch (_) {
          // 無効な日付は無視
        }
      }
      if (post.date) {
        try {
          const d = new Date(post.date);
          if (!Number.isNaN(d.getTime())) publishedDate = d;
        } catch (_) {
          // 無効な日付は無視
        }
      }

      if (updatedDate) effectiveDate = updatedDate;
      else if (publishedDate) effectiveDate = publishedDate;

      return effectiveDate;
    };

    const effectiveDate1 = getEffectiveDate(post1);
    const effectiveDate2 = getEffectiveDate(post2);

    if (!effectiveDate1 || !effectiveDate2) return success(0);

    try {
      const diffInMs = Math.abs(effectiveDate1.getTime() - effectiveDate2.getTime());
      const decayPeriodInMs = RECENCY_DECAY_DAYS * 24 * 60 * 60 * 1000;

      if (decayPeriodInMs <= 0) return success(0);

      const bonus = RECENCY_BONUS_FACTOR * Math.max(0, 1 - diffInMs / decayPeriodInMs);
      return success(bonus);
    } catch (error) {
      return failure(
        PostError.ProcessingError(`新鮮度ボーナス計算中にエラーが発生しました (${post1.slug} と ${post2.slug})`, error),
      );
    }
  } catch (error) {
    return failure(PostError.ProcessingError('新鮮度ボーナス計算中に予期しないエラーが発生しました', error));
  }
}

/**
 * 投稿間の類似度を計算（キャッシュを利用）
 */
async function calculatePostSimilarity(
  post: Post,
  targetPost: Post,
  postTfIdf: TfIdfVector,
  targetPostTfIdf: TfIdfVector,
  sortedTags: TagSimilarityScores,
): Promise<Result<number, ErrorInfo>> {
  if (!post.slug || !targetPost.slug) {
    return failure(PostError.InvalidInput('スラグを持たない投稿の類似度は計算できません'));
  }

  // キャッシュをチェック
  const cacheKey = [post.slug, targetPost.slug].sort().join('_');
  const cachedScore = similarityCache.get(cacheKey);
  if (cachedScore !== undefined) {
    return success(cachedScore);
  }

  // タグ類似度を計算
  const tagSimilarityResult = calculateTagSimilarity(post.tags || [], targetPost.tags || [], sortedTags);
  if (tagSimilarityResult.isFailure()) {
    return tagSimilarityResult;
  }
  const tagSimilarityScore = tagSimilarityResult.value;

  // コンテンツ類似度を計算
  const contentSimilarityResult = calculateContentSimilarity(postTfIdf, targetPostTfIdf);
  if (contentSimilarityResult.isFailure()) {
    return contentSimilarityResult;
  }
  const contentSimilarityScore = contentSimilarityResult.value;

  // 新鮮度ボーナスを計算
  const recencyBonusResult = calculateRecencyBonus(post, targetPost);
  if (recencyBonusResult.isFailure()) {
    return recencyBonusResult;
  }
  const recencyBonus = recencyBonusResult.value;

  // 最終スコアの計算
  const weightedScore = Math.max(0, TAG_WEIGHT * tagSimilarityScore + CONTENT_WEIGHT * contentSimilarityScore);
  const finalScore = weightedScore * (1 + recencyBonus);
  const roundedScore = Math.round(Math.max(0, finalScore) * 10000) / 10000;

  // 計算結果をキャッシュに保存
  similarityCache.set(cacheKey, roundedScore);
  return success(roundedScore);
}

/**
 * 関連投稿を取得するメイン関数
 * タグによる事前フィルタリングによりパフォーマンスを改善
 */
export async function getRelatedPosts(
  posts: Post[],
  sortedTags: TagSimilarityScores,
): Promise<{ [key: string]: Record<string, number> }[]> {
  // 入力検証
  if (!Array.isArray(posts) || posts.length === 0 || typeof sortedTags !== 'object' || sortedTags === null) {
    console.warn('getRelatedPosts: Invalid input provided (posts or sortedTags). Returning empty array.');
    return [];
  }

  // トークナイザの初期化
  const tokenizerResult = await getTokenizer();
  if (tokenizerResult.isFailure()) {
    console.error('Failed to initialize kuromoji tokenizer. Aborting.', tokenizerResult.error);
    return [];
  }
  const tokenizer = tokenizerResult.value;

  // キャッシュクリア（不要なコメントアウトを削除）

  // 1. コンテンツ前処理（非同期・並行処理）
  // biome-ignore lint/style/useNamingConvention: 定数名の命名規則を維持
  const BATCH_SIZE = 50; // 処理バッチサイズ
  const processedContents: string[][] = [];

  // 記事を小さなバッチに分割して処理
  for (let i = 0; i < posts.length; i += BATCH_SIZE) {
    const batch = posts.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (post) => {
        const textToProcess = post.content || post.title || '';
        const processedTextResult = await preprocessText(textToProcess, tokenizer);
        return processedTextResult.match({
          success: (value) => value,
          failure: (error) => {
            console.warn(`記事 ${post.slug} の前処理中にエラーが発生: ${error.message}`);
            return [];
          },
        });
      }),
    );
    processedContents.push(...batchResults);
  }

  // 2. IDFスコア計算
  const idfScoresResult = calculateIdf(posts, processedContents);
  if (idfScoresResult.isFailure()) {
    return [];
  }
  const idfScores = idfScoresResult.value;

  // 3. TF-IDFベクトル計算
  const tfIdfVectors: { [slug: string]: TfIdfVector } = {};
  const postIndexMap = new Map<string, number>();

  for (let index = 0; index < posts.length; index++) {
    const post = posts[index];
    if (!post.slug) continue;

    postIndexMap.set(post.slug, index);
    const tfScoresResult = calculateTf(processedContents[index]);
    if (tfScoresResult.isFailure()) {
      console.warn(`記事 ${post.slug} のTF計算中にエラー: ${tfScoresResult.error.message}`);
      continue;
    }

    const tfIdfVectorResult = calculateTfIdfVector(post.slug, tfScoresResult.value, idfScores);
    if (tfIdfVectorResult.isFailure()) {
      console.warn(`記事 ${post.slug} のTF-IDF計算中にエラー: ${tfIdfVectorResult.error.message}`);
      continue;
    }

    tfIdfVectors[post.slug] = tfIdfVectorResult.value;
  }

  // タグによる候補絞り込みのためのインデックス作成
  const tagToPostIndices = new Map<string, Set<number>>();
  const taggedPostsCount = new Map<string, number>(); // タグごとの記事数カウント

  // タグのインデックス作成をバッチ処理前に一度だけ実行
  for (let index = 0; index < posts.length; index++) {
    const post = posts[index];
    if (!post.tags || post.tags.length === 0) continue;

    // Set化して重複を排除
    const uniqueTags = new Set(post.tags);

    for (const tag of uniqueTags) {
      // タグの記事インデックスを追加
      if (!tagToPostIndices.has(tag)) {
        tagToPostIndices.set(tag, new Set([index]));
        taggedPostsCount.set(tag, 1);
      } else {
        tagToPostIndices.get(tag)!.add(index);
        taggedPostsCount.set(tag, (taggedPostsCount.get(tag) || 0) + 1);
      }
    }
  }

  // 4. 各記事に対して関連度計算（チャンク分割で並行処理）
  const results: { [key: string]: Record<string, number> }[] = [];

  // 記事をチャンクに分割
  for (let i = 0; i < posts.length; i += BATCH_SIZE) {
    const targetPosts = posts.slice(i, i + BATCH_SIZE);
    const chunkResults = await Promise.all(
      targetPosts.map(async (targetPost) => {
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
              if (posts[index]?.slug !== targetPost.slug) {
                candidateIndices.add(index);
              }
            });
          }
        });

        // 絞り込んだ候補に対して類似度を計算
        // 重複計算を避けるためのキー検証用セット
        const processedPairs = new Set<string>();

        // 類似度計算を並列処理で効率化
        const relatedPostsData = await Promise.all(
          Array.from(candidateIndices).map(async (postIndex) => {
            const post = posts[postIndex];
            if (!post || !post.slug || !tfIdfVectors[post.slug]) return null;

            // 既に計算済みのペアはスキップ
            const pairKey = [post.slug, targetPost.slug].sort().join('_');
            if (processedPairs.has(pairKey)) return null;
            processedPairs.add(pairKey);

            const postTfIdf = tfIdfVectors[post.slug];
            const similarityScoreResult = await calculatePostSimilarity(
              post,
              targetPost,
              postTfIdf,
              targetPostTfIdf,
              sortedTags,
            );

            return similarityScoreResult.match({
              success: (similarityScore) => ({ slug: post.slug, similarityScore }),
              failure: (error) => {
                console.warn(`類似度計算中にエラー (${post.slug} - ${targetPost.slug}): ${error.message}`);
                return null;
              },
            });
          }),
        );

        // フィルタリングとソート
        const validPosts = relatedPostsData
          .filter(
            (post): post is { slug: string; similarityScore: number } => post !== null && post.similarityScore > 0,
          )
          .sort((a, b) => b.similarityScore - a.similarityScore)
          .slice(0, SIMILARITY_LIMIT);

        if (validPosts.length === 0) {
          return null;
        }

        // 結果を指定形式に変換
        const scoredArticles = validPosts.reduce<Record<string, number>>((acc, post) => {
          acc[post.slug] = post.similarityScore;
          return acc;
        }, {});

        return { [targetPost.slug]: scoredArticles };
      }),
    );

    results.push(
      ...chunkResults.filter((result): result is { [key: string]: Record<string, number> } => result !== null),
    );
  }

  return results;
}
