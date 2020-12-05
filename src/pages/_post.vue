<template>
  <div v-if="Object.keys(post).length !== 0" class="post">
    <article class="post__article">
      <LayoutHeader :title="post.title">
        <PostMeta :date="post.date" :updated="post.updated" :post-category="post.categories" :post-tag="post.tags" />
      </LayoutHeader>
      <PostAds />
      <PostData :content="post.content" />
    </article>
    <div class="post__share">
      <client-only>
        <PostShare :post-title="post.title" />
      </client-only>
    </div>
    <div class="post__pager">
      <PostPager :next="post.next" :prev="post.prev" />
    </div>
  </div>
</template>

<script>
import CONSTANT from '~/constant';
import { getBlogPostingStructured, getBreadcrumbStructured } from '~/utils/json-ld';

const getOgImagePath = (slug) => {
  const filename = slug.replace('.html', '');
  return slug ? `https://hiro0218.github.io/blog/images/ogp/${filename}.png` : CONSTANT.AUTHOR_ICON;
};

export default {
  name: 'Post',
  validate({ params }) {
    // nuxt generate & nuxt dev
    if (process.static && process.server) {
      return true;
    } else {
      return params.post && /\d+.html/.test(params.post);
    }
  },
  asyncData({ app, params, error }) {
    // nuxt generate & nuxt dev
    if (process.static && process.server) {
      // generate時はhtmlが含まれていないため付与する
      if (!params.post.includes('.html')) {
        params.post += '.html';
      }
    }

    // パラメータからヘッダー情報を取得
    const post = app.$source.posts.find((post) => post.path === params.post);

    if (post) {
      return {
        post: {
          date: post.date,
          updated: post.updated,
          slug: post.path,
          link: post.permalink,
          title: post.title,
          content: app.$filteredPost(post.content),
          excerpt: post.excerpt,
          thumbnail: post.thumbnail,
          categories: post.categories,
          tags: post.tags,
          next: post.next,
          prev: post.prev,
        },
      };
    } else {
      error({ statusCode: 404, message: 'Page not found' });
    }
  },
  beforeCreate() {
    // workaround
    // *.htmlとなっていない場合に.htmlを付与する
    const param = this.$route.params.post;
    if (!param.includes('.html')) {
      this.$router.replace({ params: { post: `${param}.html` } });
    }
  },
  head() {
    return {
      __dangerouslyDisableSanitizers: ['script'],
      title: this.post.title,
      titleTemplate: null,
      meta: [
        { hid: 'description', name: 'description', content: this.post.excerpt },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:url', property: 'og:url', content: `${CONSTANT.SITE_URL}${this.post.slug}` },
        { hid: 'og:title', property: 'og:title', content: this.post.title },
        { hid: 'og:description', property: 'og:description', content: this.post.excerpt },
        {
          hid: 'og:image',
          property: 'og:image',
          content: getOgImagePath(this.post.slug),
        },
        { name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'og:updated_time', property: 'og:updated_time', content: this.post.updated },
        { hid: 'article:published_time', property: 'article:published_time', content: this.post.date },
        { hid: 'article:modified_time', property: 'article:modified_time', content: this.post.updated },
      ],
      link: [{ rel: 'canonical', href: `${CONSTANT.SITE_URL}${this.post.slug}` }],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: getBlogPostingStructured(this.post),
        },
        {
          type: 'application/ld+json',
          innerHTML: getBreadcrumbStructured(this.post),
        },
        {
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
          async: true,
        },
        {
          innerHTML: '(adsbygoogle = window.adsbygoogle || []).push({});',
        },
      ],
    };
  },
};
</script>
