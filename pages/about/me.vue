<template>
  <LayoutArticle :class-name="'about'" @mounted="init">
    <template v-slot:postTitle>{{ pageTitle }}</template>
    <div class="post-content" v-html="aboutData"/>
  </LayoutArticle>
</template>

<script>
const LayoutArticle = () => import('~/components/LayoutArticle.vue');
import externalLink from '~/assets/script/externalLink.js';
import aboutMeData from '~/assets/page/about/me.md';

export default {
  name: 'AboutMe',
  head() {
    return {
      title: this.pageTitle,
    };
  },
  components: {
    LayoutArticle,
  },
  computed: {
    pageTitle: () => '運営者について',
    aboutData: () => aboutMeData,
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
