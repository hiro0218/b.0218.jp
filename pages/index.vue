<template>
  <section>
    <h1>{{ pageTitle }}</h1>
    <PostsList/>
  </section>
</template>

<script>
import PostsList from '~/components/PostsList.vue';

export default {
  components: {
    PostsList,
  },
  head() {
    return {
      title: process.env.SITE_NAME,
      titleTemplate: null,
    };
  },
  computed: {
    pageTitle: () => 'Home',
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('posts/resetList');
    next();
  },
};
</script>

<style>
</style>
