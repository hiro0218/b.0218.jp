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
    <PickupCategory :list="$source.categories" />
    <PostsList :posts="posts" />
  </section>
</template>

<script type="ts">
import { defineComponent, computed } from '@vue/composition-api';
import CONSTANT from '~/constant.ts';

export default defineComponent({
  name: 'Top',
  setup(_, { root }) {
    const pageTitle = computed(() => '最新の記事');
    const siteDescription = computed(() => CONSTANT.SITE_DESCRIPTION);
    const posts = computed(() => {
      return root.$source.posts.filter((_, i) => i < 5);
    });

    return {
      pageTitle,
      siteDescription,
      posts,
    };
  },
  head() {
    return {
      title: CONSTANT.SITE_NAME,
      titleTemplate: null,
    };
  },
});
</script>
