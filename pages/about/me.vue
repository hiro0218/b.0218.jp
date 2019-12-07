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
import aboutMeData from '~/assets/markdown/about/me.md';

export default {
  name: 'AboutMe',
  computed: {
    pageTitle: () => '運営者について',
    aboutData: () => aboutMeData,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$nextTick(() => {
        let elPostContent = document.querySelector('.js-post-content');
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
