<template>
  <div v-if="categoryList.length !== 0" class="u-scroll-x category-list">
    <div class="category-item">
      <nuxt-link to="/" exact :class="{ 'nuxt-link-active': this.$route.path == '/' }">すべて</nuxt-link>
    </div>
    <template v-for="(item, index) in categoryList">
      <div v-if="index <= 10" :key="item.id" class="category-item">
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
  margin: 3rem auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: $font-size-sm;
}

.category-item {
  text-align: center;

  & + .category-item {
    margin-left: 0.5rem;
  }

  a {
    display: block;
    width: 10em;
    padding: 0 0.5rem 1rem;
    border-bottom: 1px solid $base-color;
    font-weight: bold;
    opacity: 0.4;

    &:hover {
      opacity: 1;
    }

    &.nuxt-link-active {
      opacity: 1;
    }
  }
}
</style>
