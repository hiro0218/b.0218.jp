<template>
  <PostData/>
</template>

<script>
import PostData from '~/components/PostData.vue';

export default {
  name: 'Post',
  components: {
    PostData,
  },
  beforeRouteLeave(to, from, next) {
    if (to.path !== from.path) {
      this.$store.dispatch('post/restData');
    }
    next();
  },
};
</script>

<style>
</style>
