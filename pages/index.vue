<template>
  <section>
    <LayoutHeader>
      <template v-slot:header-title>
        {{ pageTitle }}
      </template>
      <template v-slot:header-description>
        {{ siteDescription }}
      </template>
    </LayoutHeader>
    <PostsCategoryList :current-path="$route.path" :list="categoryList" />
    <PostsList :posts="posts" />
  </section>
</template>

<script>
import LayoutHeader from '~/components/LayoutHeader.vue';
import PostsList from '~/components/list/PostsList.vue';
import PostsCategoryList from '~/components/list/PostsCategoryList.vue';

import posts from '~/_source/posts.json';
import categories from '~/_source/categories.json';

export default {
  name: 'Top',
  components: {
    LayoutHeader,
    PostsList,
    PostsCategoryList,
  },
  computed: {
    pageTitle: () => '最新の記事',
    siteDescription: () => process.env.SITE_DESCRIPTION,
    posts: () => posts.filter((post, i) => i < 5),
    categoryList: () => categories,
  },
  head() {
    return {
      title: process.env.SITE_NAME,
      titleTemplate: null,
    };
  },
};
</script>
