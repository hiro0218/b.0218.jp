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
  async asyncData({ store, $axios, params, error }) {
    return $axios
      .get(`wp/v2/posts?slug=${params.post}`, {
        params: {
          _embed: '',
        },
      })
      .then(async res => {
        // postsで見つからない場合はpagesを参照する
        if (res.data.length === 0) {
          return await $axios
            .get(`wp/v2/pages?slug=${params.post}`, {
              params: {
                _embed: '',
              },
            })
            .then(res => {
              if (res.data.length === 0) {
                throw { statusCode: 404, message: 'Page not found' };
              }
              return res;
            });
        }

        return res;
      })
      .then(res => {
        store.dispatch('post/setData', res.data[0]);
      })
      .catch(e => {
        error(e);
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
