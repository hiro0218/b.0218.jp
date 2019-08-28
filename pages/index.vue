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
      <div class="title-sub">
        <template v-if="$route.query.search">
          search results
        </template>
        <template v-else>
          {{ siteDescription }}
        </template>
      </div>
    </header>
    <PostsCategoryList />
    <client-only>
      <PostsList />
    </client-only>
  </section>
</template>

<script>
import PostsList from '~/components/list/PostsList.vue';
import PostsCategoryList from '~/components/list/PostsCategoryList.vue';

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
    siteDescription: () => process.env.SITE_DESCRIPTION,
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
