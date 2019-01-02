<template>
  <section>
    <h1>category</h1>
    <ul>
      <li v-for="(category, index) in categoryList" :key="index">
        <nuxt-link :to="'/category/' + category.id">{{ category.name }}</nuxt-link>
        {{ category.count }}
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'CategoryList',
  data() {
    return {
      categoryList: {},
    };
  },
  async mounted() {
    this.categoryList = (await this.$axios.get('categories', {
      params: {
        order: 'desc',
        orderby: 'count',
        per_page: 100,
      },
    })).data;
  },
};
</script>

<style>
</style>
