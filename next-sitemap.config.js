import { SITE_URL } from '@/constant';
import { getPostsJson } from '@/lib/posts';

const posts = getPostsJson();

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: SITE_URL,
  exclude: ['/tags/*'],
  generateIndexSitemap: false,
  transform: async (config, path) => {
    const slug = path.replace(/^\//, '').replace('.html', '');
    /** @type {import('./src/types/source').PostProps} */
    const post = posts.get(slug);
    const isPost = !!post;

    /**
     * > Google は、`<priority>` と `<changefreq>` の値を無視します。
     * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=ja#additional-notes-about-xml-sitemaps
     */
    return {
      loc: path,
      lastmod: isPost ? post?.updated || post?.date : config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};

module.exports = config;
