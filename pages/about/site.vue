<template>
  <article class="about">
    <header class="c-heading--large">
      <h1 class="c-heading__title">
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
  head() {
    return {
      title: this.pageTitle,
    };
  },
};
</script>
