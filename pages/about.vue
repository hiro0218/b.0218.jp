<template>
  <article class="post">
    <header class="c-title">
      <h1 class="title-main">{{ pageTitle }}</h1>
    </header>
    <div class="post-content" v-html="about"/>
  </article>
</template>

<script>
import aboutData from '~/assets/page/about.md';

export default {
  name: 'About',
  head() {
    return {
      title: this.pageTitle,
    };
  },
  computed: {
    pageTitle: () => 'about',
    about: () => aboutData,
  },
};
</script>

<style scoped>
.post {
  margin-bottom: 5rem;
}
</style>
