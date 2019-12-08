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
import aboutMeData from '~/assets/markdown/about/me.md';

export default {
  name: 'AboutMe',
  components: {
    LayoutHeader,
  },
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
