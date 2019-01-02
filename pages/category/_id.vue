<template>
  <section>
    <PostList mode="categories"/>
  </section>
</template>

<script>
import PostList from '~/components/PostList.vue';

export default {
  name: 'CategoryPostList',
  components: {
    PostList,
  },
};
</script>

<style>
</style>
