import * as Log from '~/tools/logger';

const SEED = 42;
const MAX_ITERATIONS = 100;

/**
 * 簡易 seeded PRNG（再現可能なシャッフル用）
 * LCG (Linear Congruential Generator) で [0, 1) の範囲を返す
 */
function createRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x80000000;
  };
}

/**
 * Fisher-Yates シャッフル（破壊的）
 */
function shuffle<T>(arr: T[], rand: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Label Propagation によるコミュニティ検出
 *
 * 各ノードに初期ラベルを割り当て、隣接ノードの重み付き投票で
 * ラベルを伝播させることでクラスタを形成する。
 * 同点時は現在のラベルを保持する（安定性優先）。
 *
 * @param nodes - ノード（タグ名）の配列
 * @param adjMap - ノード間の重み付き隣接マップ
 * @returns タグ名の配列の配列（各配列が1クラスタ）
 */
export function labelPropagation(nodes: string[], adjMap: Map<string, Map<string, number>>): string[][] {
  const label = new Map<string, number>();
  for (let i = 0; i < nodes.length; i++) {
    label.set(nodes[i], i);
  }

  const rand = createRng(SEED);
  let converged = false;

  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    let changed = false;
    const shuffled = shuffle([...nodes], rand);

    for (const node of shuffled) {
      const neighbors = adjMap.get(node);
      if (!neighbors || neighbors.size === 0) continue;

      // 隣接ノードのラベルに重み付き投票
      const votes = new Map<number, number>();
      for (const [neighbor, weight] of neighbors) {
        const neighborLabel = label.get(neighbor);
        if (neighborLabel !== undefined) {
          votes.set(neighborLabel, (votes.get(neighborLabel) || 0) + weight);
        }
      }

      // 同点時は現ラベルを保持（安定性優先）
      const currentLabel = label.get(node)!;
      let bestLabel = currentLabel;
      let bestWeight = votes.get(currentLabel) || 0;

      for (const [candidateLabel, weight] of votes) {
        if (weight > bestWeight) {
          bestWeight = weight;
          bestLabel = candidateLabel;
        }
      }

      if (bestLabel !== currentLabel) {
        label.set(node, bestLabel);
        changed = true;
      }
    }

    if (!changed) {
      converged = true;
      break;
    }
  }

  if (!converged) {
    Log.warn(`Label Propagation が ${MAX_ITERATIONS} 回で収束しなかった`);
  }

  // ラベル → クラスタに変換
  const clusterMap = new Map<number, string[]>();
  for (const [node, labelId] of label) {
    if (!clusterMap.has(labelId)) clusterMap.set(labelId, []);
    clusterMap.get(labelId)!.push(node);
  }

  return [...clusterMap.values()].sort((a, b) => b.length - a.length);
}
