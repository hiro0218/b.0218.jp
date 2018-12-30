<template>
  <section class="container">
    <h1>{{ post.title.rendered }}</h1>
    <div v-html="post.content.rendered"/>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Post',
  computed: {
    ...mapState('post', {
      post: state => state.data,
    }),
  },
  async asyncData({ $axios, store, params }) {
    await $axios.get(`posts?slug=${params.post}`).then(res => {
      store.dispatch('post/setData', res.data[0]);
    });
  },
};
</script>

<style>
</style>
