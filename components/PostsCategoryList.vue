<template>
  <ul v-if="categoryList.length !== 0" class="u-list-unstyled u-scroll-x category-list">
    <li class="category-item">
      <nuxt-link to="/" exact :class="{ 'nuxt-link-active': this.$route.path == '/' }">すべて</nuxt-link>
    </li>
    <template v-for="(item, index) in categoryList">
      <li v-if="index <= 10" :key="item.id" class="category-item">
        <nuxt-link :to="'/category/' + item.slug">{{ item.name }}</nuxt-link>
      </li>
    </template>
  </ul>
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
  margin: 3rem auto;
  padding: 0 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  white-space: nowrap;
  font-size: $font-size-sm;
}

.category-item {
  &:hover {
    opacity: 0.6;
  }
  & + .category-item {
    margin-left: 1rem;
  }
}

.nuxt-link-active {
  font-weight: bold;
}
</style>
