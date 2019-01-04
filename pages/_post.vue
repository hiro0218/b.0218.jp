<template>
  <div v-if="Object.keys(post).length !== 0">
    <PostData/>
    <PostPager/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import PostData from '~/components/PostData.vue';
import PostPager from '~/components/PostPager.vue';

export default {
  name: 'Post',
  components: {
    PostData,
    PostPager,
  },
  computed: {
    ...mapState('post', {
      post: state => state.data,
    }),
  },
  async mounted() {
    await this.$axios
      .get(`posts?slug=${this.$route.params.post}`, {
        params: {
          _embed: '',
        },
      })
      .then(res => {
        this.$store.dispatch('post/setData', res.data[0]);
      });
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
