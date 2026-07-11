import { getPostsListJson } from '@/lib/source/post';
import { getTagsJson } from '@/lib/source/tag';
import type { ArticleSummary } from '@/types/source';
import { getDateAndUpdatedToSimpleFormat } from './date';

const allPosts = getPostsListJson();
const allTags = getTagsJson();
const postsMap = new Map(allPosts.map((post) => [post.slug, post]));

// タグアーカイブはページ番号ごとに本関数を呼ぶため、slug 単位でキャッシュして
// 同一タグの記事サマリ再構築 (日付フォーマット処理込み) を避ける。
// 返す配列はページ間で共有参照になるため、呼び出し側は非破壊操作に限ること
// (現状の消費はtagArchiveModel.createTagArchivePageModel の length 参照・slice のみ)。
// タグ不在を示す null も有効なキャッシュ値なので、Map.get() の戻り値がundefined (未計算) か null (タグ不在) かを区別して判定する。
const tagPostsCache = new Map<string, ArticleSummary[] | null>();

export const getTagPosts = (slug: string): ArticleSummary[] | null => {
  const cached = tagPostsCache.get(slug);
  if (cached !== undefined) {
    return cached;
  }

  const tag = allTags[slug];

  if (!tag) {
    tagPostsCache.set(slug, null);
    return null;
  }

  const tagPosts = tag
    .map((postSlug: string) => {
      const post = postsMap.get(postSlug);

      if (!post) {
        return null;
      }

      const { title, date, updated } = post;

      return {
        title,
        slug: postSlug,
        ...getDateAndUpdatedToSimpleFormat(date, updated),
      };
    })
    .filter((post) => post !== null);

  tagPostsCache.set(slug, tagPosts);
  return tagPosts;
};
