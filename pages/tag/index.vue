<template>
  <section class="tag-list">
    <div class="c-title is-center">
      <h1 class="title-main">{{ pageTitle }}</h1>
    </div>
    <ul class="u-list-unstyled c-term-list">
      <li v-for="(tag, index) in tagList" :key="index" class="term-item">
        <nuxt-link :to="'/tag/' + tag.slug">{{ tag.name }}</nuxt-link>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'TagList',
  head() {
    return {
      title: this.pageTitle,
    };
  },
  data() {
    return {
      tagList: {},
    };
  },
  computed: {
    pageTitle: () => 'Tag List',
  },
  async mounted() {
    this.tagList = (await this.$axios.get('wp/v2/tags', {
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
.tag-list {
  margin-bottom: 2rem;
}
</style>
