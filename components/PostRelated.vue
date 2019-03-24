<template>
  <nav v-if="related.length !== 0" class="post-related">
    <div class="c-title is-center is-normal">
      <h2 class="title-main">Related Posts</h2>
    </div>
    <ul class="u-list-unstyled u-scroll-x related-list">
      <li v-for="post in related" :key="post.id" class="related-item">
        <router-link :to="post.url">
          <div class="related-image">
            <img v-if="post.image != ''" :data-src="post.image" :alt="post.title">
            <svgPhoto v-else class="no-image"/>
          </div>
          <div class="related-title">{{ post.title }}</div>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapState } from 'vuex';
import lazyload from '~/assets/script/lazyload.js';
import svgPhoto from '~/assets/image/photo.svg?inline';

export default {
  name: 'PostRelated',
  components: {
    svgPhoto,
  },
  computed: {
    ...mapState('post', {
      related: state => state.data.attach.related,
    }),
  },
  mounted() {
    if (this.related.length === 0) return;
    this.$nextTick(() => {
      const images = this.$el.querySelectorAll('[data-src]');
      lazyload(images);
    });
  },
};
</script>

<style lang="scss">
.post-related {
  margin: 2rem 0;
}

.related-list {
  display: flex;
  margin: 1rem 0;
  white-space: nowrap;
}

.related-item {
  text-align: center;

  & + & {
    margin-left: 2rem;
  }

  a {
    width: calc(#{$tablet} / 3);
    display: block;
    &:hover {
      opacity: 0.6;
    }
  }
}

.related-image {
  display: flex;
  align-items: center;
  height: 8rem;
  margin-bottom: 1rem;
  background: map-get($light-color, 3);
  overflow: hidden;

  img {
    max-width: 80%;
    max-height: 80%;
    margin: auto;
  }

  .no-image {
    fill: $tertiary-color;
    width: 4rem;
    height: 4rem;
    margin: auto;
  }
}

.related-title {
  font-size: $font-size-sm;
  color: $base-color;
  white-space: normal;
}
</style>
