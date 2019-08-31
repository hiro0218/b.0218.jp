<template>
  <aside class="post-meta">
    <div class="c-meta-list">
      <font-awesome-icon icon="clock" />
      <div class="meta-item">
        <time :datetime="post.date" itemprop="datePublished">{{ post.date | formatDateString }}</time>
      </div>
      <template v-if="!isDateSameDay(post.date, post.modified)">
        <font-awesome-icon icon="angle-right" />
        <div class="meta-item">
          <time :datetime="post.modified" itemprop="dateModified">{{ post.modified | formatDateString }}</time>
        </div>
      </template>
    </div>
    <div v-if="post.hasOwnProperty('_embedded') && post._embedded['wp:term'][0].length" class="c-meta-list">
      <font-awesome-icon icon="folder" />
      <template v-for="(category, index) in post._embedded['wp:term'][0]">
        <div :key="index" class="meta-item">
          <nuxt-link :to="'/categories/' + category.slug">{{ category.name }}</nuxt-link
          ><span v-if="index !== post._embedded['wp:term'][0].length - 1">,&nbsp;</span>
        </div>
      </template>
    </div>
    <div v-if="post.hasOwnProperty('_embedded') && post._embedded['wp:term'][1].length" class="c-meta-list">
      <font-awesome-icon icon="tag" />
      <template v-for="(post_tag, index) in post._embedded['wp:term'][1]">
        <div :key="index" class="meta-item">
          <nuxt-link :to="'/tags/' + post_tag.slug">{{ post_tag.name }}</nuxt-link
          ><span v-if="index !== post._embedded['wp:term'][1].length - 1">,&nbsp;</span>
        </div>
      </template>
    </div>
  </aside>
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
