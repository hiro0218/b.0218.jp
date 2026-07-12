import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants';
import { getPostBySlug, getPostsListJson } from '@/lib/source/post';
import { getTagsWithCount } from '@/lib/source/tag';
import { tagPermalink } from '@/lib/tag/navigation';
import { getOgpImage, getPermalink } from '@/lib/utils/url';

const posts = getPostsListJson();
const tags = getTagsWithCount();

export const dynamic = 'force-static';

const pages = [
  { path: '', priority: 1.0, usesLatestPostDate: true, changeFrequency: 'daily' as const },
  { path: 'popular', priority: 0.8, usesLatestPostDate: true, changeFrequency: 'daily' as const },
  { path: 'archive', priority: 0.8, usesLatestPostDate: true, changeFrequency: 'daily' as const },
  { path: 'tags', priority: 0.5, usesLatestPostDate: true, changeFrequency: 'weekly' as const },
  // @todo generate from pages.json
  { path: 'about', priority: 0.5, usesLatestPostDate: false, changeFrequency: 'yearly' as const },
  { path: 'privacy', priority: 0.5, usesLatestPostDate: false, changeFrequency: 'yearly' as const },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  // 最新記事の日付を取得
  const sitemapPosts = posts.filter((post) => getPostBySlug(post.slug)?.noindex !== true);
  const latestPostDate = sitemapPosts.length > 0 ? sitemapPosts[0].date : undefined;

  const pageList: MetadataRoute.Sitemap = pages.map(({ path, priority, usesLatestPostDate, changeFrequency }) => {
    return {
      url: `${SITE_URL}/${path}`,
      lastModified: usesLatestPostDate ? latestPostDate : undefined,
      changeFrequency,
      priority,
    };
  });

  const postList: MetadataRoute.Sitemap = sitemapPosts.map((post) => {
    const ogpImage = `${getOgpImage(post.slug)}`;
    const permalink = getPermalink(post.slug);

    return {
      url: permalink,
      lastModified: post.date,
      changeFrequency: 'monthly',
      priority: 0.7,
      images: [ogpImage],
    };
  });

  // タグごとの最新記事日付を1パスで収集する。sitemapPosts は date 降順
  // (src/lib/source/post.ts の getPostsListJson が保証) なので、タグの初出時点の date がそのタグの最新記事日付になる。
  // 以前は tags.map の内側で毎回 sitemapPosts 全体を filter しており、タグ数×記事数の走査になっていた。
  const latestTagPostDateMap = new Map<string, string>();

  for (const post of sitemapPosts) {
    for (const tag of post.tags) {
      if (!latestTagPostDateMap.has(tag)) {
        latestTagPostDateMap.set(tag, post.date);
      }
    }
  }

  const tagList: MetadataRoute.Sitemap = tags.map(({ slug }) => {
    const permalink = tagPermalink(slug);
    const latestTagPostDate = latestTagPostDateMap.get(slug);

    return {
      url: permalink,
      lastModified: latestTagPostDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    };
  });

  return [...pageList, ...postList, ...tagList];
}
