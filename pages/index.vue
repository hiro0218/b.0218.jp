<template>
  <section>
    <header class="c-heading">
      <h1 class="c-heading__title">
        <template v-if="$route.query.search">
          {{ $route.query.search }}
        </template>
        <template v-else>
          {{ pageTitle }}
        </template>
      </h1>
      <div class="c-heading__description">
        <template v-if="$route.query.search">
          search results
        </template>
        <template v-else>
          {{ siteDescription }}
        </template>
      </div>
    </header>
    <PostsCategoryList :current-path="$route.path" :list="categoryList" />
    <client-only>
      <PostsList />
    </client-only>
  </section>
</template>

<script>
import { mapState } from 'vuex';

import PostsList from '~/components/list/PostsList.vue';
import PostsCategoryList from '~/components/list/PostsCategoryList.vue';

export default {
  components: {
    PostsList,
    PostsCategoryList,
  },
  async fetch({ store, params, query }) {
    await store.dispatch('posts/fetchCategoryList');
    return await store.dispatch('posts/fetch', query);
  },
  computed: {
    pageTitle: () => 'Home',
    siteDescription: () => process.env.SITE_DESCRIPTION,
    ...mapState('posts', {
      categoryList: state => state.categoryList,
    }),
  },
  head() {
    return {
      title: process.env.SITE_NAME,
      titleTemplate: null,
    };
  },
  // beforeRouteLeave(to, from, next) {
  //   this.$store.dispatch('posts/resetList');
  //   next();
  // },
};
</script>
