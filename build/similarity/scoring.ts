/**
 * 類似度スコアリングユーティリティ
 *
 * サブリニア TF、BM25 IDF、レア語フィルタ、IDF-weighted Jaccard を提供する。
 * doc-to-doc cosine similarity 向けの設計。
 */

type IdfScores = Record<string, number>;
type TfScores = Record<string, number>;

/** レア語フィルタの閾値（df がこの値未満のタームを除外） */
const MIN_DOC_FREQUENCY = 2;

/**
 * サブリニア TF を計算する
 *
 * 線形 TF (`count / total`) の代わりに `1 + log(rawTf)` を使用し、
 * 高頻度語の過大評価を抑制する。
 *
 * @param words - トークン化されたテキスト
 * @returns 各タームの TF スコア
 */
export function calculateSublinearTf(words: string[]): TfScores {
  const tfScores: TfScores = {};
  if (words.length === 0) return tfScores;

  const rawCounts: Record<string, number> = {};
  for (const word of words) {
    rawCounts[word] = (rawCounts[word] || 0) + 1;
  }

  for (const word in rawCounts) {
    tfScores[word] = 1 + Math.log(rawCounts[word]);
  }

  return tfScores;
}

/**
 * BM25 IDF を計算する
 *
 * 従来式 `log((N+1)/(df+1)) + 1` の代わりに
 * BM25 式 `log((N - df + 0.5) / (df + 0.5) + 1)` を使用し、
 * レアタームの弁別力を向上させる。
 *
 * @param totalDocs - 全文書数
 * @param docFrequency - 各タームの文書頻度
 * @returns 各タームの IDF スコア
 */
export function calculateBm25Idf(totalDocs: number, docFrequency: Record<string, number>): IdfScores {
  const idfScores: IdfScores = {};

  for (const word in docFrequency) {
    const df = docFrequency[word];
    idfScores[word] = Math.log((totalDocs - df + 0.5) / (df + 0.5) + 1);
  }

  return idfScores;
}

/**
 * レア語フィルタを適用する
 *
 * df < MIN_DOC_FREQUENCY のタームを除外し、
 * 1 記事にしか出現しないノイズを取り除く。
 *
 * @param docFrequency - 各タームの文書頻度
 * @returns フィルタ済みの文書頻度
 */
export function filterRareTerms(docFrequency: Record<string, number>): Record<string, number> {
  const filtered: Record<string, number> = {};

  for (const word in docFrequency) {
    if (docFrequency[word] >= MIN_DOC_FREQUENCY) {
      filtered[word] = docFrequency[word];
    }
  }

  return filtered;
}

/**
 * 文書頻度を計算する
 *
 * @param processedContents - 各文書のトークンリスト
 * @returns 各タームの文書頻度
 */
export function calculateDocFrequency(processedContents: string[][]): Record<string, number> {
  const docFrequency: Record<string, number> = {};

  for (const words of processedContents) {
    const uniqueWords = new Set(words);
    for (const word of uniqueWords) {
      docFrequency[word] = (docFrequency[word] || 0) + 1;
    }
  }

  return docFrequency;
}

/**
 * IDF-weighted Jaccard 類似度を計算する
 *
 * 通常の Jaccard 係数は全タグを等重みで扱うが、
 * IDF-weighted Jaccard は希少タグに高い重みを付与する。
 *
 * 計算式: sum(min(idf(tag))) / sum(max(idf(tag)))
 * - 共通タグ: min = max = idf(tag) なので両方に加算
 * - 片方だけのタグ: 分母のみに加算
 *
 * @param tags1 - 記事1のタグ配列
 * @param tags2 - 記事2のタグ配列
 * @param tagIdf - タグごとの IDF スコア
 * @returns IDF-weighted Jaccard 類似度 (0-1)
 */
export function calculateIdfWeightedJaccard(tags1: string[], tags2: string[], tagIdf: Record<string, number>): number {
  if (tags1.length === 0 || tags2.length === 0) return 0;

  const tagSet1 = new Set(tags1);
  const tagSet2 = new Set(tags2);

  // union の全タグを集める
  const unionTags = new Set([...tagSet1, ...tagSet2]);

  let numerator = 0;
  let denominator = 0;

  for (const tag of unionTags) {
    const idf = tagIdf[tag] ?? 0;
    if (idf === 0) continue;

    denominator += idf;
    if (tagSet1.has(tag) && tagSet2.has(tag)) {
      numerator += idf;
    }
  }

  return denominator > 0 ? numerator / denominator : 0;
}
