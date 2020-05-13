<template>
  <article class="archive">
    <LayoutHeader>
      <template v-slot:header-title>
        {{ pageTitle }}
      </template>
    </LayoutHeader>
    <section class="archive-list-container">
      <ul class="u-list-unstyled archive-list">
        <li v-for="(post, key) in archiveList" :key="key" class="archive-item">
          <time :datetime="post.date" class="post-date">{{ post.date | formatDateString }}</time>
          <nuxt-link :to="post.path">{{ post.title }}</nuxt-link>
        </li>
      </ul>
    </section>
  </article>
</template>

<script>
import LayoutHeader from '~/components/LayoutHeader.vue';
import archives from '~/_source/archives.json';

export default {
  name: 'Archive',
  components: {
    LayoutHeader,
  },
  computed: {
    pageTitle: () => 'Archive',
    archiveList: () => archives,
  },
  head() {
    return {
      title: this.pageTitle,
    };
  },
};
</script>
