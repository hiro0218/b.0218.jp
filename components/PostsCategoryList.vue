<template functional>
  <div v-if="props.list.length !== 0" class="u-scroll-x c-category-list">
    <div class="c-category-list__item">
      <nuxt-link to="/" exact :class="{ 'nuxt-link-active': props.currentPath == '/' }" class="c-category-list__link">
        /
      </nuxt-link>
    </div>
    <template v-for="(item, index) in props.list">
      <div v-if="index <= 5" :key="item.id" class="c-category-list__item">
        <nuxt-link :to="'/' + item.path" class="c-category-list__link">{{ item.name }}</nuxt-link>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PostsCategoryList',
  props: {
    currentPath: {
      type: String,
      required: true,
    },
    list: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
};
</script>
