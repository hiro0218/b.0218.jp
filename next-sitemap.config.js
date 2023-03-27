import { SITE } from '@/constant';
import { getPostsJson } from '@/lib/posts';

const posts = getPostsJson();

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE.URL,
  outDir: './public',
  exclude: ['/tags/*'],
  transform: async (config, path) => {
    const slug = path.replace(/^\//, '').replace('.html', '');
    const post = posts.find((post) => post.slug === slug);
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
