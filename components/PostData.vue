<template>
  <article class="post">
    <header class="c-title">
      <h1 class="title-main">{{ post.title.rendered }}</h1>
      <ul class="meta-list">
        <li class="meta-item">
          <svgTime/>
          <time :datetime="post.date" itemprop="datePublished">{{ post.date | dateToISOString }}</time>
        </li>
        <li v-if="!isDateSameDay(post.date, post.modified)" class="meta-item">
          <svgArrowRight/>
          <time
            :datetime="post.modified"
            itemprop="dateModified"
          >{{ post.modified | dateToISOString }}</time>
        </li>
      </ul>
    </header>
    <div class="post-content" v-html="post.content.rendered"/>
    <footer>
      <ul v-if="post.hasOwnProperty('_embedded')">
        <li v-for="(category, index) in post._embedded['wp:term'][0]" :key="index">
          <nuxt-link :to="'/category/' + category.slug">{{ category.name }}</nuxt-link>
        </li>
      </ul>
      <ul v-if="post.hasOwnProperty('_embedded')">
        <li v-for="(post_tag, index) in post._embedded['wp:term'][1]" :key="index">
          <nuxt-link :to="'/tag/' + post_tag.slug">{{ post_tag.name }}</nuxt-link>
        </li>
      </ul>
    </footer>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import svgTime from '~/assets/image/time.svg?inline';
import svgArrowRight from '~/assets/image/arrow_right.svg?inline';

export default {
  name: 'PostData',
  components: {
    svgTime,
    svgArrowRight,
  },
  computed: {
    ...mapState('post', {
      post: state => state.data,
    }),
  },
};
</script>

<style lang="scss">
.post {
  .c-title {
    margin-bottom: 2rem;
  }
}
.post-content {
  hr {
    height: 2rem;
    margin: 2rem 0;
    border: 0;
    color: $oc-gray-6;
    text-align: center;

    &::before {
      content: '***';
      font-size: 1.5rem;
    }
  }
}
</style>
