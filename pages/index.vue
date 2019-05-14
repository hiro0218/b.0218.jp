<template>
  <section>
    <LayoutPostsList>
      <template v-slot:postsListTitle>
        <template v-if="$route.query.search">
          search: {{ $route.query.search }}
        </template>
        <template v-else>
          {{ pageTitle }}
        </template>
      </template>
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
    store.dispatch('posts/fetchCategoryList');
    return store.dispatch('posts/fetch', query);
  },
  // beforeRouteLeave(to, from, next) {
  //   this.$store.dispatch('posts/resetList');
  //   next();
  // },
};
</script>
