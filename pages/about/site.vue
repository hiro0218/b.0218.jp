<template>
  <article class="about">
    <LayoutHeader :is-large="true">
      <template v-slot:header-title>
        {{ pageTitle }}
      </template>
    </LayoutHeader>
    <div class="post__content js-post-content" v-html="aboutData" />
  </article>
</template>

<script>
import LayoutHeader from '~/components/LayoutHeader.vue';

import externalLink from '~/assets/script/externalLink.js';
import aboutSiteData from '~/assets/markdown/about/site.md';

export default {
  name: 'AboutSite',
  components: {
    LayoutHeader,
  },
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
