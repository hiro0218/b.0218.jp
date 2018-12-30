<template>
  <section class="container">
    <list/>
  </section>
</template>

<script>
import List from '~/components/List.vue';

export default {
  components: {
    List,
  },
  async asyncData({ $axios, store, params }) {
    await $axios.get('posts').then(res => {
      store.dispatch('posts/setHeaders', res.headers);
      store.dispatch('posts/setList', res.data);
    });
  },
};
</script>

<style>
</style>
