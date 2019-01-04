<template>
  <section v-if="category_id > 0">
    <h1>{{ category_name }}</h1>
    <PostList :category-id="category_id" mode="categories"/>
  </section>
</template>

<script>
import PostList from '~/components/PostList.vue';

export default {
  name: 'CategoryPostList',
  components: {
    PostList,
  },
  data() {
    return {
      category_name: '',
      category_id: 0,
    };
  },
  async mounted() {
    await this.$axios
      .get('categories', {
        params: {
          slug: this.$route.params.slug,
        },
      })
      .then(res => {
        this.category_id = res.data[0].id;
        this.category_name = res.data[0].name;
      });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('posts/resetList');
    next();
  },
};
</script>

<style>
</style>
