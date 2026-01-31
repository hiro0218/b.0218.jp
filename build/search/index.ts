import type { Post } from '@/types/source';
import { BUILD_PATHS } from '~/build/shared/paths';
import { readJSON, writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';
import { generateSearchIndex } from './invertedIndex';
import { getTokenizer } from './tokenizer';

(async () => {
  try {
    Log.info('転置インデックス生成を開始します...');

    // 記事データを読み込む
    const posts = await readJSON<Post[]>(`${BUILD_PATHS.dist}/posts.json`);
    Log.info(`${posts.length}件の記事を読み込みました`);

    // 形態素解析器を初期化
    const tokenizer = await getTokenizer();
    Log.info('形態素解析器を初期化しました');

    // 転置インデックスと検索用データを一括生成（トークン化は1回のみ）
    Log.info('検索インデックスを生成中...');
    const { invertedIndex, searchData } = await generateSearchIndex(posts, tokenizer);

    // ファイル出力
    await writeJSON(`${BUILD_PATHS.dist}/search-index.json`, invertedIndex);
    Log.info(`転置インデックスを生成しました（${Object.keys(invertedIndex).length}件のトークン）`);

    await writeJSON(`${BUILD_PATHS.dist}/search-data.json`, searchData);
    Log.info(`検索用軽量データを生成しました（${searchData.length}件）`);

    Log.info('転置インデックス生成が完了しました');
  } catch (error) {
    Log.error('転置インデックス生成処理に失敗しました:', error);
    process.exit(1);
  }
})();
