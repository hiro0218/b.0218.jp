<template>
  <article class="archive">
    <header class="c-title is-page">
      <h1 class="title-main">
        {{ pageTitle }}
      </h1>
    </header>
    <section class="archive-list-container">
      <ul class="u-list-unstyled archive-list">
        <li v-for="(post, key) in archiveList" :key="key" class="archive-item">
          <time :datetime="post.published_at" class="post-date">{{ post.published_at | formatDateString }}</time>
          <nuxt-link :to="post.slug">{{ post.title }}</nuxt-link>
        </li>
      </ul>
    </section>
  </article>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Archive',
  head() {
    return {
      title: this.pageTitle,
      test: 0,
    };
  },
  computed: {
    pageTitle: () => 'Archive',
    ...mapState('archive', {
      archiveList: state => state.data,
    }),
  },
  async fetch({ store, app, params, error }) {
    if (store.getters['archive/dataSize'] !== 0) return;
    return await app.$api
      .getArchive()
      .then(async res => {
        store.dispatch('archive/setData', res.data);
      })
      .catch(e => {
        error({ statusCode: 404, message: 'Page not found' });
      });
  },
};
</script>

<style lang="scss">
.archive {
  a {
    text-decoration: underline;
    &:hover {
      opacity: 0.6;
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
    color: $secondary-color;
    font-weight: bold;
  }
}
</style>
