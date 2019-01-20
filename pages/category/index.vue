<template>
  <section>
    <div class="c-title">
      <h1 class="title-main">{{ pageTitle }}</h1>
    </div>
    <ul>
      <li v-for="(category, index) in categoryList" :key="index">
        <nuxt-link :to="'/category/' + category.slug">{{ category.name }}</nuxt-link>
        {{ category.count }}
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'CategoryList',
  head() {
    return {
      title: this.pageTitle,
    };
  },
  data() {
    return {
      categoryList: {},
    };
  },
  computed: {
    pageTitle: () => 'Category',
  },
  async mounted() {
    this.categoryList = (await this.$axios.get('wp/v2/categories', {
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
