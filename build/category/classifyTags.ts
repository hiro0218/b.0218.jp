import type { TagCategoryMap, TagCategoryName } from '@/types/source';

/** どのカテゴリにも親和度がない場合のデフォルトカテゴリ */
const DEFAULT_CATEGORY: TagCategoryName = 'その他';

/**
 * カテゴリ判定用のシードタグ
 *
 * 各カテゴリの代表的なタグを定義し、LP クラスタとの親和度計算に使用する。
 * クラスタ内にシードタグが含まれる場合、そのカテゴリに即座に割り当てられる。
 * 含まれない場合は、クラスタ内タグとシードタグの Jaccard 類似度の平均で判定する。
 */
const CATEGORY_SEEDS = new Map<TagCategoryName, ReadonlySet<string>>([
  [
    '開発',
    new Set([
      'JavaScript',
      'TypeScript',
      'React',
      'CSS',
      'PHP',
      'Node.js',
      'Vue.js',
      'Git',
      'C++',
      'Electron',
      'Eclipse',
      'シェルスクリプト',
    ]),
  ],
  ['テクノロジー', new Set(['Windows', 'macOS', 'Chrome', 'Firefox', 'Excel', 'Android'])],
  ['その他', new Set(['名探偵コナン', '雑記', 'レビュー', '考察'])],
]);

const CATEGORY_PRIORITY: readonly TagCategoryName[] = ['開発', 'その他', 'テクノロジー'];

/**
 * クラスタとカテゴリの親和度を計算する
 *
 * クラスタ内にシードタグが含まれる場合は Infinity を返す（即座に割り当て）。
 * 含まれない場合は、adjMap に存在するシードのみを対象に Jaccard スコア平均を返す。
 */
function clusterAffinity(
  cluster: string[],
  seeds: ReadonlySet<string>,
  adjMap: Map<string, Map<string, number>>,
): number {
  for (const tag of cluster) {
    if (seeds.has(tag)) return Number.POSITIVE_INFINITY;
  }

  // adjMap に存在するシードのみで計算（存在しないシードはスコアを減衰させない）
  let effectiveSeedCount = 0;
  let totalAffinity = 0;

  for (const seed of seeds) {
    if (!adjMap.has(seed)) continue;
    effectiveSeedCount++;

    for (const tag of cluster) {
      const neighbors = adjMap.get(tag);
      if (neighbors) {
        totalAffinity += neighbors.get(seed) || 0;
      }
    }
  }

  if (effectiveSeedCount === 0) return 0;

  return totalAffinity / (cluster.length * effectiveSeedCount);
}

/**
 * LP クラスタを 3 カテゴリに分類し、タグ → カテゴリのマッピングを生成する
 *
 * 全カテゴリの親和度が 0 のクラスタは DEFAULT_CATEGORY に分類される。
 *
 * @param clusters - Label Propagation で得られたクラスタ配列
 * @param adjMap - タグ間の Jaccard 隣接マップ
 * @returns タグ名 → カテゴリ名のマッピング
 */
export function classifyTags(clusters: string[][], adjMap: Map<string, Map<string, number>>): TagCategoryMap {
  const tagToCategory: TagCategoryMap = {};

  for (const cluster of clusters) {
    // 最も親和度が高いカテゴリに割り当て（全スコア 0 ならデフォルトカテゴリ）
    let bestCategory: TagCategoryName = DEFAULT_CATEGORY;
    let bestScore = 0;

    for (const category of CATEGORY_PRIORITY) {
      const score = clusterAffinity(cluster, CATEGORY_SEEDS.get(category)!, adjMap);
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    }

    for (const tag of cluster) {
      tagToCategory[tag] = bestCategory;
    }
  }

  return tagToCategory;
}
