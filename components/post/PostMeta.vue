<template>
  <div class="post-meta">
    <div class="c-post-meta">
      <font-awesome-icon icon="clock" class="c-post-meta__icon" />
      <div class="c-post-meta__item--date">
        <time :datetime="post.date" itemprop="datePublished">{{ post.date | formatDateString }}</time>
      </div>
      <div v-if="!isDateSameDay(post.date, post.modified)" class="c-post-meta__item--date">
        <time :datetime="post.modified" itemprop="dateModified">{{ post.modified | formatDateString }}</time>
      </div>
    </div>
    <div v-if="post.hasOwnProperty('_embedded') && post._embedded['wp:term'][0].length" class="c-post-meta">
      <font-awesome-icon icon="folder" class="c-post-meta__icon" />
      <template v-for="(category, index) in post._embedded['wp:term'][0]">
        <div :key="index" class="c-post-meta__item">
          <!-- prettier-ignore -->
          <nuxt-link :to="'/categories/' + category.slug" class="c-post-meta__link">{{ category.name }}</nuxt-link>
          <span v-if="index !== post._embedded['wp:term'][0].length - 1">,&nbsp;</span>
        </div>
      </template>
    </div>
    <div v-if="post.hasOwnProperty('_embedded') && post._embedded['wp:term'][1].length" class="c-post-meta">
      <font-awesome-icon icon="tag" class="c-post-meta__icon" />
      <template v-for="(post_tag, index) in post._embedded['wp:term'][1]">
        <div :key="index" class="c-post-meta__item--separator">
          <nuxt-link :to="'/tags/' + post_tag.slug" class="c-post-meta__link">{{ post_tag.name }}</nuxt-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PostMeta',
  computed: {
    ...mapState('post', {
      post: state => state.data,
    }),
  },
};
</script>
