<template>
  <section class="container">
    <h1>{{ post.title.rendered }}</h1>
    <div v-html="post.content.rendered"/>
  </section>
</template>

<script>
export default {
  name: 'Post',
  data() {
    return {
      post: '',
    };
  },
  async asyncData({ $axios, params }) {
    const post = await $axios.get(`https://demo.wp-api.org/wp-json/wp/v2/posts?slug=${params.post}`).then(res => {
      return res.data[0];
    });
    return { post };
  },
};
</script>

<style>
</style>
