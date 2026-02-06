import type { IpadicFeatures, Tokenizer } from 'kuromoji';
import type { Post } from '@/types/source';
import { tokenizeText } from './tokenizer';

/**
 * 転置インデックスの型定義
 * キー: トークン（単語）
 * 値: そのトークンを含む記事のslug配列
 */
export type InvertedIndex = Record<string, string[]>;

/**
 * 検索用軽量データの型定義
 */
export interface SearchData {
  slug: string;
  title: string;
  tags: string[];
  tokens: string[];
}

/**
 * 転置インデックスと検索用データの生成結果
 */
interface GenerateSearchIndexResult {
  invertedIndex: InvertedIndex;
  searchData: SearchData[];
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
export async function generateSearchIndex(
  posts: Post[],
  tokenizer: Tokenizer<IpadicFeatures>,
): Promise<GenerateSearchIndexResult> {
  const invertedIndex: InvertedIndex = {};
  const searchData: SearchData[] = [];
  // タグ用のSetマップ（重複チェック用）
  const tagSlugSets = new Map<string, Set<string>>();

  for (const post of posts) {
    if (!post.slug) continue;

    // タイトルとタグを結合してトークン化（1回のみ）
    const textToProcess = [post.title, ...(post.tags || [])].join(' ');

    try {
      const tokens = await tokenizeText(textToProcess, tokenizer);
      const uniqueTokens = [...new Set(tokens)];

      // 転置インデックスに追加
      for (const token of uniqueTokens) {
        if (!invertedIndex[token]) {
          invertedIndex[token] = [];
        }
        invertedIndex[token].push(post.slug);
      }

      // タグは完全一致検索用に正規化した形でも登録
      if (post.tags) {
        // タグを正規化して重複を排除
        const normalizedTags = new Set(post.tags.map((tag) => tag.toLowerCase().trim()));

        for (const normalizedTag of normalizedTags) {
          // Setで重複管理（O(1)の重複チェック）
          if (!tagSlugSets.has(normalizedTag)) {
            tagSlugSets.set(normalizedTag, new Set());
            invertedIndex[normalizedTag] = [];
          }

          const slugSet = tagSlugSets.get(normalizedTag)!;
          if (!slugSet.has(post.slug)) {
            slugSet.add(post.slug);
            invertedIndex[normalizedTag].push(post.slug);
          }
        }
      }

      // 検索用データに追加
      searchData.push({
        slug: post.slug,
        title: post.title,
        tags: post.tags || [],
        tokens: uniqueTokens,
      });
    } catch (error) {
      console.warn(`[build/search/invertedIndex] 記事 ${post.slug} の処理中にエラー:`, error);
      continue;
    }
  }

  return { invertedIndex, searchData };
}
