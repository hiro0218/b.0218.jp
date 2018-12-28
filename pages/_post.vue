<template>
  <section class="container">
    <h1>posts</h1>
    <h2>{{ post }}</h2>
  </section>
</template>

<script>
export default {
  async asyncData({ $axios, params }) {
    await $axios.get(`https://demo.wp-api.org/wp-json/wp/v2/posts?slug=${params.post}`).then(res => {
      console.log(res.data);
      return { post: res.data };
    });
  },
  data() {
    return {
      post: null,
    };
  },
  mounted() {
    // console.log(this.$route);
  },
};
</script>

<style>
</style>
