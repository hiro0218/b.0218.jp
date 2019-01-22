<template>
  <section>
    <div class="c-title">
      <h1 class="title-main">{{ pageTitle }}</h1>
    </div>
    <ul class="u-list-unstyled tag-list">
      <li v-for="(tag, index) in tagList" :key="index" class="tag-item">
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

<style lang="scss">
.tag-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 2rem 0.25rem;
}

.tag-item {
  margin-left: 0.25rem;
  margin-bottom: 0.5rem;
  flex: 1 1 auto;
  align-items: center;
  align-self: flex-start;
  white-space: nowrap;
  text-align: center;

  a {
    display: block;
    padding: 0.5em 1em;
    border-radius: 0.15rem;
    line-height: 1.5;
    background-color: $oc-gray-1;
    color: $oc-gray-8;
    font-size: map-get($size, sm) * 1rem;

    &:hover {
      background-color: $oc-gray-2;
      opacity: 1;
    }
  }
}
</style>
