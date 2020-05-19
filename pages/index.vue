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
    <PostsCategoryList :current-path="$route.path" :list="$source.categories" />
    <PostsList :posts="posts" />
  </section>
</template>

<script>
export default {
  name: 'Top',
  computed: {
    pageTitle: () => '最新の記事',
    siteDescription: () => process.env.SITE_DESCRIPTION,
    posts: function () {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return this.$source.posts.filter((post, i) => i < 5);
    },
  },
  head() {
    return {
      title: process.env.SITE_NAME,
      titleTemplate: null,
    };
  },
};
</script>
