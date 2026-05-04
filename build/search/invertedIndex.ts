import type { IpadicFeatures, Tokenizer } from 'kuromoji';
import { normalizeSearchToken, type SearchDataItem, type SearchIndex } from '@/lib/search';
import type { PostSummary } from '@/types/source';
import * as Log from '~/tools/logger';
import { tokenizeText } from './tokenizer';

/**
 * 転置インデックスの型定義
 * キー: トークン（単語）
 * 値: そのトークンを含む searchData の配列インデックス
 */
export type InvertedIndex = SearchIndex;

/**
 * 転置インデックスと検索用データの生成結果
 */
interface GenerateSearchIndexResult {
  invertedIndex: InvertedIndex;
  searchData: SearchDataItem[];
}

/**
 * 転置インデックスと検索用データを一括生成する
 *
 * @description
 * トークン化を1回だけ実行し、転置インデックスと検索用データを同時に生成する。
 * これにより、同じテキストを複数回トークン化する無駄を排除。
 *
 * @param posts 記事データ配列
 * @param tokenizer 形態素解析器インスタンス
 * @returns 転置インデックスと検索用データ
 */
export function generateSearchIndex(
  posts: PostSummary[],
  tokenizer: Tokenizer<IpadicFeatures>,
): GenerateSearchIndexResult {
  const invertedIndex: InvertedIndex = {};
  const searchData: SearchDataItem[] = [];

  function addToIndex(key: string, itemId: number): void {
    if (!invertedIndex[key]) {
      invertedIndex[key] = [];
    }

    invertedIndex[key].push(itemId);
  }

  for (const post of posts) {
    if (!post.slug) continue;

    // タイトルとタグを結合してトークン化（1回のみ）
    const textToProcess = [post.title, ...post.tags].join(' ');

    try {
      const tokens = tokenizeText(textToProcess, tokenizer);
      const uniqueTokens = new Set(tokens.map(normalizeSearchToken).filter((token) => token.length > 0));
      const normalizedTags = post.tags.map(normalizeSearchToken).filter((tag) => tag.length > 0);
      const indexKeys = new Set([...uniqueTokens, ...normalizedTags]);
      const itemId = searchData.length;

      // 転置インデックスに追加
      for (const key of indexKeys) {
        addToIndex(key, itemId);
      }

      // 検索用データに追加
      searchData.push({
        slug: post.slug,
        title: post.title,
        tags: post.tags,
      });
    } catch (error) {
      Log.warn(`[build/search/invertedIndex] 記事 ${post.slug} の処理中にエラー: ${String(error)}`);
      continue;
    }
  }

  return { invertedIndex, searchData };
}
