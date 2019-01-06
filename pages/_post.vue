<template>
  <div v-if="Object.keys(post).length !== 0">
    <PostData/>
    <PostPager/>
    <PostRelated/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import PostData from '~/components/PostData.vue';
import PostPager from '~/components/PostPager.vue';
import PostRelated from '~/components/PostRelated.vue';

export default {
  name: 'Post',
  components: {
    PostData,
    PostPager,
    PostRelated,
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
      .then(async res => {
        // postsで見つからない場合はpagesを参照する
        if (res.data.length === 0) {
          return await this.$axios
            .get(`pages?slug=${this.$route.params.post}`, {
              params: {
                _embed: '',
              },
            })
            .then(res => {
              return res;
            });
        }

        return res;
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
