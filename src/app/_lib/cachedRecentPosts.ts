import { getFilteredPosts } from '@/app/_lib/getFilteredPosts';
import { getRecentAndUpdatedPosts } from '@/app/_lib/getRecentAndUpdatedPosts';

/**
 * モジュールレベルでキャッシュされたデータ
 *
 * IGNORE_TAGSで除外された記事を元に算出した最新記事と更新記事。
 * 全ページで共有され、計算は1回のみ実行される。
 */
const filteredPosts = getFilteredPosts();
export const { recentPosts, updatesPosts } = getRecentAndUpdatedPosts(filteredPosts);
