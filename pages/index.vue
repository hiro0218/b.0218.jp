<template>
  <section>
    <h1>home</h1>
    <PostList/>
  </section>
</template>

<script>
import PostList from '~/components/PostList.vue';

export default {
  components: {
    PostList,
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('posts/resetList');
    next();
  },
};
</script>

<style>
</style>
