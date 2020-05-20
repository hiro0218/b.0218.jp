<template>
  <article class="archive">
    <LayoutHeader>
      <template v-slot:header-title>
        {{ pageTitle }}
      </template>
      <template v-slot:header-description>
        {{ pageDescription }}
      </template>
    </LayoutHeader>
    <section>
      <ul class="archive-list">
        <li v-for="(post, key) in $source.archives" :key="key" class="archive-item">
          <time :datetime="post.date" class="archive-item__date">{{ post.date | formatDateString }}</time>
          <a :href="post.path" class="archive-item__link">{{ post.title }}</a>
        </li>
      </ul>
    </section>
  </article>
</template>

<script type="ts">
import { defineComponent, computed } from '@vue/composition-api';

export default defineComponent({
  name: 'Archive',
  setup() {
    const pageTitle = computed(() => 'Archive');
    const pageDescription = computed(() => 'これまでに公開した記事の一覧です。');

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
