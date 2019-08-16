<template>
  <div v-if="categoryList.length !== 0" class="u-scroll-x category-list">
    <div class="category-item">
      <nuxt-link to="/" exact :class="{ 'nuxt-link-active': this.$route.path == '/' }">All</nuxt-link>
    </div>
    <template v-for="(item, index) in categoryList">
      <div v-if="index <= 5" :key="item.id" class="category-item">
        <nuxt-link :to="'/categories/' + item.slug">{{ item.name }}</nuxt-link>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PostsCategoryList',
  computed: {
    ...mapState('posts', {
      categoryList: state => state.categoryList,
    }),
  },
};
</script>

<style lang="scss" scoped>
.category-list {
  display: flex;
  align-items: center;
  margin: 3rem auto;
  font-size: $font-size-sm;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.category-item {
  text-align: center;

  & + .category-item {
    margin-left: 1rem;
  }

  a {
    display: block;
    padding: 0.5rem 0;
    transition: opacity 0.3s, border 0.8s;
    border-bottom: 2px solid transparent;
    opacity: 0.4;

    &:hover {
      border-bottom-color: $base-color;
      opacity: 1;
    }

    &.nuxt-link-active {
      border-bottom-color: $base-color;
      opacity: 1;
    }
  }
}
</style>
