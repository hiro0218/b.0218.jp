<template>
  <section>
    <no-ssr>
      <div class="c-title is-center">
        <h1 class="title-main">
          <template v-if="$route.query.search">search: {{ $route.query.search }}</template>
          <template v-else>{{ pageTitle }}</template>
        </h1>
      </div>
      <PostsList/>
    </no-ssr>
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
  async fetch({ store, params, query }) {
    return store.dispatch('posts/fetch', query);
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
