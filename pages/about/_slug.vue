<template>
  <article class="about">
    <LayoutHeader :is-large="true">
      <template v-slot:header-title>
        {{ pageTitle }}
      </template>
    </LayoutHeader>
    <div class="post__content js-post-content" v-html="pageContent" />
  </article>
</template>

<script>
import LayoutHeader from '~/components/LayoutHeader.vue';

import externalLink from '~/assets/script/externalLink.js';
import aboutMeData from '~/assets/markdown/about/me.md';
import aboutSiteData from '~/assets/markdown/about/site.md';

export default {
  name: 'AboutPage',
  components: {
    LayoutHeader,
  },
  validate({ params }) {
    return params.slug === 'me' || params.slug === 'site';
  },
  data() {
    return {
      pageTitle: '',
      pageContent: '',
      config: {
        me: {
          title: '運営者について',
          data: aboutMeData,
        },
        site: {
          title: 'サイトについて',
          data: aboutSiteData,
        },
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.pageTitle = this.getPageTitle();
      this.pageContent = this.getPageContent();

      this.$nextTick(() => {
        const elPostContent = document.querySelector('.js-post-content');
        externalLink(elPostContent);
      });
    },
    getPageTitle() {
      return this.config[this.$route.params.slug].title;
    },
    getPageContent() {
      return this.config[this.$route.params.slug].data;
    },
  },
  head() {
    return {
      title: this.pageTitle,
    };
  },
};
</script>
