<template>
  <article class="post">
    <LayoutHeader>
      <template v-slot:header-title>
        {{ pageTitle }}
      </template>
      <template v-slot:header-description>
        {{ pageDescription }}
      </template>
    </LayoutHeader>
    <div class="post__content js-post-content" v-html="aboutData" />
  </article>
</template>

<script>
import externalLink from '~/assets/script/externalLink.js';

import aboutData from '~/_source/about.html';

export default {
  name: 'About',
  computed: {
    pageTitle: () => 'About',
    pageDescription: () => 'サイトと運営者の情報',
    aboutData: () => aboutData,
  },
  mounted() {
    this.$nextTick(() => {
      const elPostContent = document.querySelector('.js-post-content');
      externalLink(elPostContent);
    });
  },
  head() {
    return {
      title: this.pageTitle,
      meta: [{ hid: 'description', name: 'description', content: this.pageDescription }],
    };
  },
};
</script>
