<template>
  <article class="about">
    <header class="c-title">
      <h1 class="title-main">{{ pageTitle }}</h1>
    </header>
    <div class="post-content" v-html="aboutData"/>
  </article>
</template>

<script>
import aboutSiteData from '~/assets/page/about/site.md';

export default {
  name: 'About',
  head() {
    return {
      title: this.pageTitle,
    };
  },
  computed: {
    pageTitle: () => 'サイトについて',
    aboutData: () => aboutSiteData,
  },
};
</script>
