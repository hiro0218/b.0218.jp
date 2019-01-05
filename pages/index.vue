<template>
  <section>
    <h1>home</h1>
    <PostsList/>
  </section>
</template>

<script>
import PostsList from '~/components/PostsList.vue';

export default {
  components: {
    PostsList,
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('posts/resetList');
    next();
  },
};
</script>

<style>
</style>
