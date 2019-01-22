<template>
  <nav v-if="related.length !== 0" class=" post-related">
    <div class="c-title">
      <h2 class="title-main">Related Posts</h2>
    </div>
    <ul class="u-list-unstyled related-list">
      <li v-for="(post, index) in related" :key="index" class="related-item">
        <router-link :to="post.url">
          <div class="related-image">
            <img v-if="post.image != ''" :src="post.image">
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
};
</script>

<style lang="scss">
.related-list {
  display: flex;
  margin: 2rem 0;
  white-space: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.related-item {
  width: 15rem;
  text-align: center;

  & + & {
    margin-left: 2rem;
  }

  a {
    display: block;
    width: 15rem;
  }
}

.related-image {
  display: flex;
  align-items: center;
  height: 8rem;
  margin-bottom: 1rem;
  background: $oc-gray-1;
  overflow: hidden;

  img {
    max-width: 80%;
    max-height: 80%;
    margin: auto;
  }

  .no-image {
    fill: $oc-gray-6;
    width: 4rem;
    height: 4rem;
    margin: auto;
  }
}

.related-title {
  font-size: map-get($size, sm) * 1rem;
  color: $oc-gray-8;
  white-space: normal;
}
</style>
