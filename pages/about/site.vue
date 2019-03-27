<template>
  <LayoutArticle :class-name="'about'" @mounted="init">
    <template v-slot:postTitle>{{ pageTitle }}</template>
    <div class="post-content" v-html="aboutData"/>
  </LayoutArticle>
</template>

<script>
const LayoutArticle = () => import('~/components/LayoutArticle.vue');
import externalLink from '~/assets/script/externalLink.js';
import aboutSiteData from '~/assets/page/about/site.md';

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
        this.elPostContent = this.$el.querySelector('.post-content');
        externalLink(this.elPostContent);
      });
    },
  },
};
</script>
