import type { MetadataRoute } from 'next';
import { createTagArchivePaginationStaticParams } from '@/app/(ArchivePage)/tags/[slug]/_lib/tagArchiveModel';
import { SITE_URL } from '@/constants';
import { getPostBySlug, getPostsListJson } from '@/lib/source/post';
import { getTagsWithCount } from '@/lib/source/tag';
import { tagPermalink } from '@/lib/tag/navigation';
import { getOgpImage, getPermalink } from '@/lib/utils/url';
import type { Post, PostSummary } from '@/types/source';

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

type SitemapPost = PostSummary & {
  lastModified: string;
};

/** Google は lastmod を再クロール判断に使うので、公開日より更新日を優先する。 */
function getPostLastModified(summary: PostSummary, full: Post | null): string {
  return full?.updated ?? summary.updated ?? full?.date ?? summary.date;
}

function getLatestLastModified(items: readonly Pick<SitemapPost, 'lastModified'>[]): string | undefined {
  if (items.length === 0) {
    return undefined;
  }

  return items.reduce(
    (latest, item) => (item.lastModified > latest ? item.lastModified : latest),
    items[0].lastModified,
  );
}

function toSitemapPost(summary: PostSummary): SitemapPost | null {
  const full = getPostBySlug(summary.slug);

  if (full?.noindex === true) {
    return null;
  }

  return {
    ...summary,
    lastModified: getPostLastModified(summary, full),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapPosts = posts.flatMap((post) => {
    const sitemapPost = toSitemapPost(post);
    return sitemapPost ? [sitemapPost] : [];
  });
  const latestPostDate = getLatestLastModified(sitemapPosts);

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
      lastModified: post.lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
      images: [ogpImage],
    };
  });

  // タグごとの最終更新を 1 パスで収集する。updated を見るため date 降順の初出では足りない。
  const latestTagPostDateMap = new Map<string, string>();

  for (const post of sitemapPosts) {
    for (const tag of post.tags) {
      const current = latestTagPostDateMap.get(tag);
      if (current === undefined || post.lastModified > current) {
        latestTagPostDateMap.set(tag, post.lastModified);
      }
    }
  }

  const tagList: MetadataRoute.Sitemap = tags.flatMap(({ slug, count }) => {
    const permalink = tagPermalink(slug);
    const latestTagPostDate = latestTagPostDateMap.get(slug);
    const firstPage: MetadataRoute.Sitemap[number] = {
      url: permalink,
      lastModified: latestTagPostDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    };

    // 2 ページ目以降も独立 URL なので、1 ページ目と同じ lastmod で列挙する。
    const extraPages = createTagArchivePaginationStaticParams(slug, count).map(({ page }) => ({
      url: `${permalink}/${page}`,
      lastModified: latestTagPostDate,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

    return [firstPage, ...extraPages];
  });

  return [...pageList, ...postList, ...tagList];
}
