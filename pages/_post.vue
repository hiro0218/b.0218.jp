<template>
  <div v-if="Object.keys(post).length !== 0" class="post">
    <article class="post__article">
      <LayoutHeader>
        <template v-slot:header-title>
          {{ post.title.rendered }}
        </template>
        <PostMeta
          :date="post.date"
          :modified="post.modified"
          :post-category="post._embedded['wp:term'][0]"
          :post-tag="post._embedded['wp:term'][1]"
        />
      </LayoutHeader>
      <PostAds />
      <PostData :post="post" />
    </article>
    <div class="post__share">
      <PostShare />
    </div>
    <div v-if="Object.keys(pager).length !== 0" class="post__pager">
      <PostPager :pager="pager" />
    </div>
    <div v-if="related.length !== 0" class="post__related">
      <PostRelated :related="related" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import LayoutHeader from '~/components/LayoutHeader.vue';
import PostMeta from '~/components/post/PostMeta.vue';
import PostData from '~/components/post/PostData.vue';
import PostAds from '~/components/post/PostAds.vue';
import PostShare from '~/components/post/PostShare.vue';
import PostPager from '~/components/post/PostPager.vue';
const PostRelated = () => import('~/components/post/PostRelated.vue');

export default {
  name: 'Post',
  components: {
    LayoutHeader,
    PostMeta,
    PostData,
    PostAds,
    PostShare,
    PostPager,
    PostRelated,
  },
  validate({ params }) {
    if (process.static && process.server) return true;
    return params.post && /\d+.html/.test(params.post);
  },
  async fetch({ store, app, params, error, payload }) {
    // when nuxt generate
    if (process.static && params.post.indexOf('.html') === -1) {
      params.post += '.html';
    }

    return app.$api
      .getPost(params)
      .then(res => {
        store.dispatch('post/setData', res.data[0]);
      })
      .catch(e => {
        error(e);
      });
  },
  computed: {
    ...mapState('post', {
      post: state => state.data,
      pager: state => {
        const pager = state.data.attach.pager;
        if (!pager) return {};
        return pager;
      },
      related: state => state.data.attach.related,
    }),
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
      const itemListElement = [
        {
          '@type': 'ListItem',
          position: itemCount,
          item: { '@id': process.env.SITE_URL, name: process.env.SITE_NAME },
        },
      ];

      if (this.post.hasOwnProperty('_embedded')) {
        const wp_term = this.post._embedded['wp:term'][0];
        for (let i = 0; i < wp_term.length; i++) {
          const category = wp_term[i];
          itemListElement.push({
            '@type': 'ListItem',
            position: ++itemCount,
            item: {
              '@id': `${process.env.SITE_URL}category/${category.slug}`,
              name: category.name,
            },
          });
        }
      }

      itemListElement.push({
        '@type': 'ListItem',
        position: ++itemCount,
        item: { '@id': this.post.link, name: this.post.title.rendered },
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
  // beforeRouteLeave(to, from, next) {
  //   if (to.path !== from.path) {
  //     this.$store.dispatch('post/restData');
  //   }
  //   next();
  // },
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

.post__share {
  margin: 3rem 0;
  text-align: center;

  @include mobile {
    position: sticky;
    bottom: 1rem;
  }
}

.post__related {
  margin: 4rem 0 2rem;
}
</style>
