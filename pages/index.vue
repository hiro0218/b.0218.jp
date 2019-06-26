<template>
  <section>
    <header class="c-title is-home">
      <h1 class="title-main">
        <template v-if="$route.query.search">
          {{ $route.query.search }}
        </template>
        <template v-else>
          {{ pageTitle }}
        </template>
      </h1>
      <div v-if="$route.query.search" class="title-sub">
        search results
      </div>
    </header>
    <LayoutPostsList>
      <no-ssr>
        <PostsCategoryList />
        <PostsList />
      </no-ssr>
    </LayoutPostsList>
  </section>
</template>

<script>
import LayoutPostsList from '~/components/LayoutPostsList.vue';
import PostsList from '~/components/PostsList.vue';
import PostsCategoryList from '~/components/PostsCategoryList.vue';

export default {
  components: {
    LayoutPostsList,
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
    await store.dispatch('posts/fetchCategoryList');
    return await store.dispatch('posts/fetch', query);
  },
  // beforeRouteLeave(to, from, next) {
  //   this.$store.dispatch('posts/resetList');
  //   next();
  // },
};
</script>
