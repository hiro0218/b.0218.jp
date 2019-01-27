<template>
  <article class="archive">
    <header class="c-title">
      <h1 class="title-main">{{ pageTitle }}</h1>
    </header>
    <div class="archive-list-container">
      <section v-for="(posts, year) in archiveList" :key="year">
        <h2>{{ year }}</h2>
        <ul class="u-list-unstyled archive-list">
          <li v-for="post in posts" :key="post.id" class="archive-item">
            <time :datetime="post.date">{{ post.date | dateToISOString }}</time>
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
  async asyncData({ store, $axios, params, error }) {
    return await $axios
      .get('0218/v1/archive')
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
  h2 {
    font-size: $h3-font-size;
  }
  a {
    &:hover {
      opacity: 0.6;
    }
  }
}
.archive-list-container {
  display: flex;
  flex-direction: column-reverse;
}
.archive-list {
  margin-bottom: 2rem;
}
.archive-item {
  display: flex;
  padding: 0 1rem;
  margin-bottom: 0.5rem;
  line-height: 1.8;
  word-break: break-all;

  time {
    flex: 0 0 10rem;
    color: $oc-gray-6;
    letter-spacing: normal;
  }
}
</style>
