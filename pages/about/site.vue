<template>
  <article class="about">
    <header class="c-title is-page">
      <h1 class="title-main">
        {{ pageTitle }}
      </h1>
    </header>
    <LayoutArticle :class-name="'about'" @mounted="init">
      <div class="post-content" v-html="aboutData" />
    </LayoutArticle>
  </article>
</template>

<script>
const LayoutArticle = () => import('~/components/LayoutArticle.vue');
import externalLink from '~/assets/script/externalLink.js';
import aboutSiteData from '~/assets/markdown/about/site.md';

export default {
  name: 'AboutSite',
  head() {
    return {
      title: this.pageTitle,
    };
  },
  components: {
    LayoutArticle,
  },
  computed: {
    pageTitle: () => 'サイトについて',
    aboutData: () => aboutSiteData,
  },
  methods: {
    init() {
      this.$nextTick(() => {
        let elPostContent = this.$el.querySelector('.post-content');
        externalLink(elPostContent);
      });
    },
  },
};
</script>
