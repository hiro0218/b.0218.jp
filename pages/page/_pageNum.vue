<template>
  <section class="container">
    <list/>
  </section>
</template>

<script>
import List from '~/components/List.vue';

export default {
  name: 'Page',
  components: {
    List,
  },
  async asyncData({ $axios, store, params }) {
    await $axios.get(`posts?page=${params.pageNum}`).then(res => {
      store.dispatch('posts/setList', res.data);
    });
  },
};
</script>

<style>
</style>
