<template>
  <section>
    <h1>tag</h1>
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
  data() {
    return {
      tagList: {},
    };
  },
  async mounted() {
    this.tagList = (await this.$axios.get('tags', {
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
