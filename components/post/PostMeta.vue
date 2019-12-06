<template>
  <div class="post-meta">
    <div class="c-post-meta">
      <font-awesome-icon icon="clock" class="c-post-meta__icon" />
      <div class="c-post-meta__item--date">
        <time :datetime="date" itemprop="datePublished">{{ date | formatDateString }}</time>
      </div>
      <div v-if="!isDateSameDay(date, modified)" class="c-post-meta__item--date">
        <time :datetime="modified" itemprop="dateModified">{{ modified | formatDateString }}</time>
      </div>
    </div>
    <div v-if="category.lentgh !== 0" class="c-post-meta">
      <font-awesome-icon icon="folder" class="c-post-meta__icon" />
      <template v-for="(category, index) in category">
        <div :key="index" class="c-post-meta__item--separator">
          <nuxt-link :to="'/categories/' + category.slug" class="c-post-meta__link">{{ category.name }}</nuxt-link>
        </div>
      </template>
    </div>
    <div v-if="post_tag.length !== 0" class="c-post-meta">
      <font-awesome-icon icon="tag" class="c-post-meta__icon" />
      <template v-for="(post_tag, index) in post_tag">
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
      date: state => state.data.date,
      modified: state => state.data.modified,
      category: state => state.data._embedded['wp:term'][0],
      post_tag: state => state.data._embedded['wp:term'][1],
    }),
  },
};
</script>
