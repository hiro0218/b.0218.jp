import { FILENAME_TAG_CATEGORIES } from '@/constants';
import type { TagIndex } from '@/types/source';
import { BUILD_PATHS } from '~/build/shared/paths';
import { readJSON, writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';

import { classifyTags } from './classifyTags';
import { buildJaccardAdjacency } from './jaccard';
import { labelPropagation } from './labelPropagation';

(async () => {
  const startTime = Date.now();

  try {
    Log.info('タグカテゴリ分類を開始...');

    const tagIndex = await readJSON<TagIndex>(`${BUILD_PATHS.dist}/tags.json`);
    const tagNames = Object.keys(tagIndex);
    Log.info(`タグ: ${tagNames.length}件`);

    // 1. タグ間の Jaccard 類似度を計算
    const adjMap = buildJaccardAdjacency(tagIndex);

    // 2. Label Propagation でクラスタリング
    const clusters = labelPropagation(tagNames, adjMap);
    Log.info(`クラスタ: ${clusters.length}件`);

    // 3. クラスタを 3 カテゴリに分類
    const tagCategories = classifyTags(clusters, adjMap);

    // カテゴリ別の集計
    const counts = new Map<string, number>();
    for (const category of Object.values(tagCategories)) {
      counts.set(category, (counts.get(category) || 0) + 1);
    }
    const summary = [...counts.entries()].map(([k, v]) => `${k}=${v}`).join(', ');
    Log.info(`分類結果: ${summary}`);

    await writeJSON(`${BUILD_PATHS.dist}/${FILENAME_TAG_CATEGORIES}.json`, tagCategories);
    Log.info(`Write dist/${FILENAME_TAG_CATEGORIES}.json`);

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    Log.info(`タグカテゴリ分類完了 (${elapsed}秒)`);
  } catch (error) {
    Log.error('タグカテゴリ分類に失敗しました');

    if (error instanceof Error) {
      Log.error(`エラー: ${error.message}`);
      if (error.stack) {
        Log.error(error.stack);
      }
    }

    process.exit(1);
  }
})();
