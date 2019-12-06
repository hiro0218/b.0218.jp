<template>
  <div v-if="list.length !== 0" class="u-scroll-x c-category-list">
    <div class="c-category-list__item">
      <nuxt-link to="/" exact :class="{ 'nuxt-link-active': this.$route.path == '/' }" class="c-category-list__link">
        All
      </nuxt-link>
    </div>
    <template v-for="(item, index) in list">
      <div v-if="index <= 5" :key="item.id" class="c-category-list__item">
        <nuxt-link :to="'/categories/' + item.slug" class="c-category-list__link">{{ item.name }}</nuxt-link>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'PostsCategoryList',
  props: {
    list: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
};
</script>
