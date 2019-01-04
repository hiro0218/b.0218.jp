<template>
  <article>
    <header>
      <h1>{{ post.title.rendered }}</h1>
      <ul>
        <li>
          <time :datetime="post.date" itemprop="datePublished">{{ post.date | dateToISOString }}</time>
        </li>
        <li v-if="!isDateSameDay(post.date, post.modified)">
          <time :datetime="post.modified" itemprop="dateModified">{{ post.modified | dateToISOString }}</time>
        </li>
      </ul>
    </header>
    <div v-html="post.content.rendered"/>
    <footer>
      <ul>
        <li v-for="(category, index) in post._embedded['wp:term'][0]" :key="index">
          <nuxt-link :to="'/category/' + category.slug">{{ category.name }}</nuxt-link>
        </li>
      </ul>
      <ul>
        <li v-for="(post_tag, index) in post._embedded['wp:term'][1]" :key="index">
          <nuxt-link :to="'/tag/' + post_tag.slug">{{ post_tag.name }}</nuxt-link>
        </li>
      </ul>
    </footer>
  </article>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PostData',
  computed: {
    ...mapState('post', {
      post: state => state.data,
    }),
  },
};
</script>

<style>
</style>
