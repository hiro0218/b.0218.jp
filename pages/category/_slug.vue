<template>
  <section v-if="category_id > 0">
    <h1>{{ category_name }}</h1>
    <PostsList :category-id="category_id" mode="categories"/>
  </section>
</template>

<script>
import PostsList from '~/components/PostsList.vue';

export default {
  name: 'CategoryPostsList',
  components: {
    PostsList,
  },
  head() {
    return {
      title: this.category_name,
    };
  },
  data() {
    return {
      category_name: '',
      category_id: 0,
    };
  },
  async mounted() {
    await this.$axios
      .get('wp/v2/categories', {
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
