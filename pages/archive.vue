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
    archiveList: () => {
      return archives.sort(function(a, b) {
        // 日付順にソート
        return a.date < b.date ? 1 : -1;
      });
    },
  },
  head() {
    return {
      title: this.pageTitle,
    };
  },
};
</script>

<style lang="scss">
.archive {
  a {
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
}

.archive-list-container {
  display: flex;
  margin-bottom: 4rem;
}

.archive-list {
  padding: 0 1rem;
}

.archive-item {
  display: flex;
  margin-bottom: 1rem;
  line-height: 2;

  .post-date {
    flex: 0 0 10rem;
    color: $color-text--light;
    font-weight: bold;
  }
}
</style>
