<template>
  <article class="about">
    <LayoutHeader :is-large="true">
      <template v-slot:header-title>
        {{ pageTitle }}
      </template>
    </LayoutHeader>
    <div class="about__content js-post-content" v-html="aboutData" />
  </article>
</template>

<script>
import LayoutHeader from '~/components/LayoutHeader.vue';
import externalLink from '~/assets/script/externalLink.js';

import aboutData from '~/_source/about.html';

export default {
  name: 'About',
  components: {
    LayoutHeader,
  },
  computed: {
    pageTitle: () => 'about',
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
    };
  },
};
</script>
