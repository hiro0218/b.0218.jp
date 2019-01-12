<template>
  <div v-if="Object.keys(post).length !== 0">
    <PostData/>
    <PostPager/>
    <PostRelated/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import PostData from '~/components/PostData.vue';
import PostPager from '~/components/PostPager.vue';
import PostRelated from '~/components/PostRelated.vue';

export default {
  name: 'Post',
  components: {
    PostData,
    PostPager,
    PostRelated,
  },
  head() {
    return {
      __dangerouslyDisableSanitizers: ['script'],
      title: this.post.title.rendered,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: this.post.excerpt.rendered },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:url', property: 'og:url', content: `${process.env.SITE_URL}${this.post.slug}` },
        { hid: 'og:title', property: 'og:title', content: this.post.title.rendered },
        { hid: 'og:description', property: 'og:description', content: this.post.excerpt.rendered },
        { hid: 'og:image', property: 'og:image', content: this.post.thumbnail },
      ],
      links: [{ rel: 'canonical', href: `${process.env.SITE_URL}${this.post.slug}` }],
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
  async asyncData({ store, $axios, params, error }) {
    return $axios
      .get(`wp/v2/posts?slug=${params.post}`, {
        params: {
          _embed: '',
        },
      })
      .then(async res => {
        // postsで見つからない場合はpagesを参照する
        if (res.data.length === 0) {
          return await $axios
            .get(`wp/v2/pages?slug=${params.post}`, {
              params: {
                _embed: '',
              },
            })
            .then(res => {
              if (res.data.length === 0) {
                throw { statusCode: 404, message: 'Page not found' };
              }
              return res;
            });
        }

        return res;
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
  beforeRouteLeave(to, from, next) {
    if (to.path !== from.path) {
      this.$store.dispatch('post/restData');
    }
    next();
  },
};
</script>

<style>
</style>
