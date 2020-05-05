<template>
  <div class="p-post-list">
    <template v-for="(post, key) in posts">
      <nuxt-link :key="key" :to="{ path: '/' + post.path }" class="c-card">
        <div class="c-card-image">
          <div class="c-card-image__container">
            <img
              v-if="post.thumbnail"
              class="c-card-image__item"
              :src="post.thumbnail"
              :alt="post.title"
              loading="lazy"
            />
            <font-awesome-icon v-else class="c-card-image__no-item" icon="image" />
          </div>
        </div>
        <div class="c-card-body">
          <div class="c-card-body__title">
            {{ post.title }}
          </div>
          <div v-if="post.excerpt" class="c-card-body__description">
            {{ post.excerpt }}
          </div>
        </div>
      </nuxt-link>
    </template>
  </div>
</template>

<script>
export default {
  name: 'PostsList',
  props: {
    posts: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      page: Number(this.$route.query.page),
    };
  },
};
</script>

<style lang="scss" scoped>
.c-card {
  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
}

.p-post-list-pagination {
  margin-top: 2rem;
}
</style>
