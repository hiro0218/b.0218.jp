import { getFilteredPosts } from '@/app/_lib/getFilteredPosts';
import { getRecentPosts } from '@/app/_lib/getRecentPosts';

/**
 * モジュールレベルでキャッシュされた最新記事データ
 *
 * IGNORE_TAGSで除外された記事を元に算出。
 * 全ページで共有され、計算は1回のみ実行される。
 */
const filteredPosts = getFilteredPosts();
export const recentPosts = getRecentPosts(filteredPosts);
