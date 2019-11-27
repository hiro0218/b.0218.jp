<template>
  <article class="about">
    <header class="c-heading--large">
      <h1 class="c-heading__title">
        {{ pageTitle }}
      </h1>
    </header>
    <div class="post__content js-post-content" v-html="aboutData" />
  </article>
</template>

<script>
import externalLink from '~/assets/script/externalLink.js';
import aboutSiteData from '~/assets/markdown/about/site.md';

export default {
  name: 'AboutSite',
  computed: {
    pageTitle: () => 'サイトについて',
    aboutData: () => aboutSiteData,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$nextTick(() => {
        let elPostContent = this.$el.querySelector('.js-post-content');
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
