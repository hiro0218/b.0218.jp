<template>
  <section>
    <div class="c-title is-center">
      <h1 class="title-main">
        <template v-if="$route.query.search">
          search: {{ $route.query.search }}
        </template>
        <template v-else>
          {{ pageTitle }}
        </template>
      </h1>
    </div>
    <PostsCategoryList />
    <no-ssr>
      <PostsList />
    </no-ssr>
  </section>
</template>

<script>
import PostsList from '~/components/PostsList.vue';
import PostsCategoryList from '~/components/PostsCategoryList.vue';

export default {
  components: {
    PostsList,
    PostsCategoryList,
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
  async fetch({ store, params, query }) {
    store.dispatch('posts/fetchCategoryList');
    return store.dispatch('posts/fetch', query);
  },
  // beforeRouteLeave(to, from, next) {
  //   this.$store.dispatch('posts/resetList');
  //   next();
  // },
};
</script>
