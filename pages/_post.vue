<template>
  <div v-if="Object.keys(post).length !== 0">
    <PostData />
    <PostPager />
    <PostAmazon />
    <PostRelated />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import PostData from '~/components/PostData.vue';
const PostAmazon = () => import('~/components/post/PostAmazon.vue');
const PostPager = () => import('~/components/post/PostPager.vue');
const PostRelated = () => import('~/components/post/PostRelated.vue');

export default {
  name: 'Post',
  components: {
    PostData,
    PostAmazon,
    PostPager,
    PostRelated,
  },
  head() {
    return {
      __dangerouslyDisableSanitizers: ['script'],
      title: this.post.title.rendered,
      meta: [
        { hid: 'description', name: 'description', content: this.post.excerpt.rendered },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:url', property: 'og:url', content: `${process.env.SITE_URL}${this.post.slug}` },
        { hid: 'og:title', property: 'og:title', content: this.post.title.rendered },
        { hid: 'og:description', property: 'og:description', content: this.post.excerpt.rendered },
        { hid: 'og:image', property: 'og:image', content: this.post.thumbnail || process.env.AUTHOR_ICON },
        { hid: 'og:updated_time', property: 'og:updated_time', content: this.post.modified },
        { hid: 'article:published_time', property: 'article:published_time', content: this.post.date },
        { hid: 'article:modified_time', property: 'article:modified_time', content: this.post.modified },
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
  computed: {
    ...mapState('post', {
      post: state => state.data,
    }),
  },
  validate({ params }) {
    if (process.static && process.server) return true;
    return params.post && /\d+.html/.test(params.post);
  },
  async fetch({ store, $axios, params, error, payload }) {
    // when nuxt generate
    if (process.static && params.post.indexOf('.html') === -1) {
      params.post += '.html';
    }

    return $axios
      .get(`wp/v2/posts?slug=${params.post}`, {
        params: {
          _embed: '',
        },
      })
      .then(res => {
        store.dispatch('post/setData', res.data[0]);
      })
      .catch(e => {
        error(e);
      });
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
        headline: this.post.title.rendered,
        datePublished: this.post.date,
        dateModified: this.post.modified,
        author: { '@type': 'Person', name: process.env.AUTHOR },
        description: this.post.excerpt.rendered,
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
      let itemListElement = [
        {
          '@type': 'ListItem',
          position: itemCount,
          item: { '@id': process.env.SITE_URL, name: process.env.SITE_NAME },
        },
      ];

      if (this.post.hasOwnProperty('_embedded')) {
        if (this.post._embedded['wp:term'].length !== 0) {
          Array.from(this.post._embedded['wp:term'][0], category => {
            itemListElement.push({
              '@type': 'ListItem',
              position: ++itemCount,
              item: {
                '@id': `${process.env.SITE_URL}category/${category.slug}`,
                name: category.name,
              },
            });
          });
        }
      }

      itemListElement.push({
        '@type': 'ListItem',
        position: ++itemCount,
        item: { '@id': this.post.link, name: this.post.title.rendered },
      });

      let structure = Object.assign(
        {
          '@context': 'http://schema.org',
          '@type': 'BreadcrumbList',
        },
        { itemListElement: itemListElement },
      );

      return JSON.stringify(structure);
    },
  },
  // beforeRouteLeave(to, from, next) {
  //   if (to.path !== from.path) {
  //     this.$store.dispatch('post/restData');
  //   }
  //   next();
  // },
};
</script>

<style lang="scss" scoped>
div {
  max-width: $tablet;
  margin-right: auto;
  margin-left: auto;
}
</style>
