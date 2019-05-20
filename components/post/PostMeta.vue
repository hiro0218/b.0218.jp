<template>
  <aside class="post-meta">
    <ul class="c-meta-list">
      <li class="meta-item">
        <svgTime />
        <time :datetime="post.date" itemprop="datePublished">{{ post.date | formatDateString }}</time>
      </li>
      <li v-if="!isDateSameDay(post.date, post.modified)" class="meta-item">
        <svgArrowRight />
        <time :datetime="post.modified" itemprop="dateModified">{{ post.modified | formatDateString }}</time>
      </li>
    </ul>
    <ul v-if="post.hasOwnProperty('_embedded')" class="c-meta-list">
      <li v-for="(category, index) in post._embedded['wp:term'][0]" :key="index" class="meta-item">
        <svgFolder v-if="index === 0" />
        <nuxt-link :to="'/categories/' + category.slug">
          {{ category.name }}
        </nuxt-link>
        <span v-if="index !== post._embedded['wp:term'][0].length - 1">,&nbsp;</span>
      </li>
    </ul>
    <ul v-if="post.hasOwnProperty('_embedded')" class="c-meta-list">
      <li v-for="(post_tag, index) in post._embedded['wp:term'][1]" :key="index" class="meta-item">
        <svgTag v-if="index === 0" />
        <nuxt-link :to="'/tags/' + post_tag.slug">
          {{ post_tag.name }}
        </nuxt-link>
        <span v-if="index !== post._embedded['wp:term'][1].length - 1">,&nbsp;</span>
      </li>
    </ul>
  </aside>
</template>

<script>
import { mapState } from 'vuex';
import svgTime from '~/assets/image/time.svg?inline';
import svgFolder from '~/assets/image/folder.svg?inline';
import svgTag from '~/assets/image/tag.svg?inline';
import svgArrowRight from '~/assets/image/arrow_right.svg?inline';

export default {
  name: 'PostMeta',
  components: {
    svgTime,
    svgArrowRight,
    svgFolder,
    svgTag,
  },
  computed: {
    ...mapState('post', {
      post: state => state.data,
    }),
  },
};
</script>
