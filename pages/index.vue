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

<script type="ts">
import { defineComponent, computed } from '@vue/composition-api';

export default defineComponent({
  name: 'Top',
  setup(_, { root }) {
    const pageTitle = computed(() => '最新の記事');
    const siteDescription = computed(() => process.env.SITE_DESCRIPTION);
    const posts = computed(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return root.$source.posts.filter((post, i) => i < 5);
    });

    return {
      pageTitle,
      siteDescription,
      posts,
    };
  },
  head() {
    return {
      title: process.env.SITE_NAME,
      titleTemplate: null,
    };
  },
});
</script>
