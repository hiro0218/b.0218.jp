<template>
  <article class="post">
    <LayoutHeader>
      <template v-slot:header-title>
        {{ pageTitle }}
      </template>
      <template v-slot:header-description>
        {{ pageDescription }}
      </template>
    </LayoutHeader>
    <div class="post__content js-post-content" v-html="page.content" />
  </article>
</template>

<script type="ts">
import { defineComponent, computed } from '@vue/composition-api';

export default defineComponent({
  name: 'About',
  asyncData({ app }) {
    const page = app.$source.pages.find((page) => page.slug === 'about');

    return {
      page: {
        ...page,
        content: app.$filteredPost(page.content),
      },
    };
  },
  setup(_) {
    const pageTitle = computed(() => 'About');
    const pageDescription = computed(() => 'サイトと運営者の情報');

    return {
      pageTitle,
      pageDescription,
    };
  },
  head() {
    return {
      title: this.pageTitle,
      meta: [{ hid: 'description', name: 'description', content: this.pageDescription }],
    };
  },
});
</script>
