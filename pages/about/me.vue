<template>
  <article class="about">
    <header class="c-title">
      <h1 class="title-main">{{ pageTitle }}</h1>
    </header>
    <div class="post-content">
      <section v-html="aboutData"/>
    </div>
  </article>
</template>

<script>
import aboutMeData from '~/assets/page/about/me.md';

export default {
  name: 'About',
  head() {
    return {
      title: this.pageTitle,
    };
  },
  computed: {
    pageTitle: () => '運営者について',
    aboutData: () => aboutMeData,
  },
};
</script>
