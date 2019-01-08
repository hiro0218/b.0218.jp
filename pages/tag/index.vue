<template>
  <section>
    <h1>{{ pageTitle }}</h1>
    <ul>
      <li v-for="(tag, index) in tagList" :key="index">
        <nuxt-link :to="'/tag/' + tag.slug">{{ tag.name }}</nuxt-link>
        {{ tag.count }}
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
    pageTitle: () => 'Tag',
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

<style>
</style>
