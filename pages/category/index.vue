<template>
  <section class="category-list">
    <div class="c-title is-center">
      <h1 class="title-main">
        {{ pageTitle }}
      </h1>
    </div>
    <ul class="u-list-unstyled c-term-list">
      <li v-for="(category, index) in categoryList" :key="index" class="term-item">
        <nuxt-link :to="'/category/' + category.slug">
          {{ category.name }}
        </nuxt-link>
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

<style scoped>
.category-list {
  margin-bottom: 2rem;
}
</style>
