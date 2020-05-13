<template>
  <div v-if="Object.keys(post).length !== 0" class="post">
    <article class="post__article">
      <LayoutHeader>
        <template v-slot:header-title>
          {{ post.title }}
        </template>
        <PostMeta :date="post.date" :updated="post.updated" :post-category="post.categories" :post-tag="post.tags" />
      </LayoutHeader>
      <PostAds />
      <PostData :content="post.content" />
    </article>
    <div class="post__share">
      <client-only>
        <PostShare />
      </client-only>
    </div>
    <div class="post__pager">
      <PostPager :next="post.next" :prev="post.prev" />
    </div>
  </div>
</template>

<script>
import LayoutHeader from '~/components/LayoutHeader.vue';
import PostMeta from '~/components/post/PostMeta.vue';
import PostData from '~/components/post/PostData.vue';
import PostAds from '~/components/post/PostAds.vue';
import PostShare from '~/components/post/PostShare.vue';
import PostPager from '~/components/post/PostPager.vue';

import posts from '~/_source/posts.json';

export default {
  name: 'Post',
  components: {
    LayoutHeader,
    PostMeta,
    PostData,
    PostAds,
    PostShare,
    PostPager,
  },
  validate({ params }) {
    if (process.static && process.server) return true;
    return params.post && /\d+.html/.test(params.post);
  },
  async asyncData({ store, app, params, error, payload }) {
    // when nuxt generate
    if (process.static && params.post.indexOf('.html') === -1) {
      params.post += '.html';
    }

    // パラメータからヘッダー情報を取得
    const post = posts.find((post) => post.path === params.post);

    if (post) {
      // 拡張子
      const allowExt = post.path ? post.path.match(/(.*)(?:\.([^.]+$))/)[2] === 'html' : false;

      if (allowExt) {
        // パラメータから記事内容を取得
        const content = await import(`~/_source/${post.path}`).then((text) => text.default);

        return {
          post: {
            date: post.date,
            updated: post.updated,
            slug: post.path,
            link: post.permalink,
            title: post.title,
            content: content,
            excerpt: post.excerpt,
            thumbnail: post.thumbnail,
            categories: post.categories,
            tags: post.tags,
            next: post.next,
            prev: post.prev,
          },
        };
      }
    }

    error({ statusCode: 404, message: 'Page not found' });
  },
  computed: {
    descriptionText: function () {
      let content = this.post.content;

      // strip line break
      content = content.replace(/(?:\r\n|\r|\n)/g, '');

      // strip tag
      content = content.replace(/<\/?[^>]+(>|$)/g, ' ');

      // character extraction
      content = content.substring(0, 140);

      return content;
    },
  },
  methods: {
    getBlogPostingStructured() {
      return JSON.stringify({
        '@context': 'http://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${process.env.SITE_URL}${this.post.slug}`,
        },
        headline: this.post.title,
        datePublished: this.post.date,
        dateModified: this.post.updated,
        author: { '@type': 'Person', name: process.env.AUTHOR },
        description: this.descriptionText,
        image: {
          '@type': 'ImageObject',
          url: this.post.thumbnail,
          width: 696,
          height: 696,
        },
        publisher: {
          '@type': 'Organization',
          name: process.env.SITE_NAME,
          logo: {
            '@type': 'ImageObject',
            url: 'https://b.0218.jp/hiro0218.png',
            width: '400px',
            height: '400px',
          },
        },
      });
    },
    getBreadcrumbStructured() {
      let itemCount = 1;
      const itemListElement = [
        {
          '@type': 'ListItem',
          position: itemCount,
          item: { '@id': process.env.SITE_URL, name: process.env.SITE_NAME },
        },
      ];

      if (this.post.categories) {
        for (let i = 0; i < this.post.categories.length; i++) {
          const category = this.post.categories[i];
          itemListElement.push({
            '@type': 'ListItem',
            position: ++itemCount,
            item: {
              '@id': `${process.env.SITE_URL}/${category.path}`,
              name: category.name,
            },
          });
        }
      }

      itemListElement.push({
        '@type': 'ListItem',
        position: ++itemCount,
        item: { '@id': this.post.link, name: this.post.title },
      });

      const structure = Object.assign(
        {
          '@context': 'http://schema.org',
          '@type': 'BreadcrumbList',
        },
        { itemListElement: itemListElement },
      );

      return JSON.stringify(structure);
    },
  },
  head() {
    return {
      __dangerouslyDisableSanitizers: ['script'],
      title: this.post.title,
      meta: [
        { hid: 'description', name: 'description', content: this.descriptionText },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:url', property: 'og:url', content: `${process.env.SITE_URL}${this.post.slug}` },
        { hid: 'og:title', property: 'og:title', content: this.post.title },
        { hid: 'og:description', property: 'og:description', content: this.descriptionText },
        { hid: 'og:image', property: 'og:image', content: this.post.thumbnail || process.env.AUTHOR_ICON },
        { hid: 'og:updated_time', property: 'og:updated_time', content: this.post.updated },
        { hid: 'article:published_time', property: 'article:published_time', content: this.post.date },
        { hid: 'article:modified_time', property: 'article:modified_time', content: this.post.updated },
      ],
      link: [{ rel: 'canonical', href: `${process.env.SITE_URL}${this.post.slug}` }],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: this.getBlogPostingStructured(),
        },
        {
          type: 'application/ld+json',
          innerHTML: this.getBreadcrumbStructured(),
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.post {
  .c-heading {
    margin: 2rem 0;
  }
  .c-alert {
    margin-bottom: 1rem;
  }
}
</style>
