const { SITE_URL } = require('@/constant');
const { getPostsListJson } = require('@/lib/posts');

/** @type {import('./src/types/source').PostListProps[]} */
const posts = getPostsListJson();

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: SITE_URL,
  exclude: ['/tags/*'],
  generateIndexSitemap: false,
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

module.exports = config;
