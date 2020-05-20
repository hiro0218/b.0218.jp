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
    <div class="post__content js-post-content" v-html="aboutHTML" />
  </article>
</template>

<script type="ts">
import { defineComponent, computed, onMounted } from '@vue/composition-api';

import externalLink from '~/assets/script/externalLink.js';

import aboutData from '~/_source/about.html';

export default defineComponent({
  name: 'About',
  setup(_, { root }) {
    const pageTitle = computed(() => 'About');
    const pageDescription = computed(() => 'サイトと運営者の情報');
    const aboutHTML = computed(() => aboutData);

    onMounted(() => {
      root.$nextTick(() => {
        const elPostContent = document.querySelector('.js-post-content');
        externalLink(elPostContent);
      });
    });

    return {
      pageTitle,
      pageDescription,
      aboutHTML,
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
