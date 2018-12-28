<template>
  <div>
    <ul>
      <li v-for="(post, index) in posts" :key="index">
        <nuxt-link :to="{ path: post.slug }">{{ post.title.rendered }}</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      posts: null,
    };
  },
  async mounted() {
    this.posts = (await this.$axios.get('https://demo.wp-api.org/wp-json/wp/v2/posts')).data;
  },
};
</script>

<style>
</style>
