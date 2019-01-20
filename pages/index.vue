<template>
  <section>
    <div class="c-title">
      <h1 class="title-main">{{ pageTitle }}</h1>
      <div v-if="$route.query.search" class="title-sub">search: {{ $route.query.search }}</div>
    </div>
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
