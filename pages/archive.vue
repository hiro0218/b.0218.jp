<template>
  <article class="archive">
    <header class="c-title is-page">
      <h1 class="title-main">
        {{ pageTitle }}
      </h1>
    </header>
    <div class="archive-list-container">
      <section v-for="(posts, year) in archiveList" :key="year">
        <h2 class="archive-year">{{ year }}</h2>
        <ul class="u-list-unstyled archive-list">
          <li v-for="post in posts" :key="post.id" class="archive-item">
            <time :datetime="post.date" class="post-date">{{ post.date | formatDateString }}</time>
            <nuxt-link :to="post.link">{{ post.title }}</nuxt-link>
          </li>
        </ul>
      </section>
    </div>
  </article>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Archive',
  head() {
    return {
      title: this.pageTitle,
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
  .archive-year {
    font-size: 2rem;
  }

  a:hover {
    opacity: 0.6;
  }
}

.archive-list-container {
  display: flex;
  flex-direction: column-reverse;
}

.archive-list {
  padding: 0 1rem;
  margin-bottom: 4rem;
}

.archive-item {
  display: flex;
  margin-bottom: 1rem;
  line-height: 2;

  .post-date {
    flex: 0 0 10rem;
    color: $secondary-color;
    font-size: $font-size-lg;
    font-weight: bold;
  }
}
</style>
