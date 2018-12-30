<template>
  <div>
    <ul>
      <li v-for="(post, index) in postList" :key="index">
        {{ post.date }}
        <nuxt-link :to="{ path: post.slug }">{{ post.title.rendered }}</nuxt-link>
      </li>
    </ul>
    <paginate
      :page-count="postHeaders.totalpages"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :click-handler="changePage"
      initial-page="1"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('posts', {
      postHeaders: state => state.headers,
      postList: state => state.list,
    }),
  },
  methods: {
    async changePage(pageNum) {
      let params = pageNum > 1 ? `?page=${pageNum}` : '';
      await this.$axios.get(`posts${params}`).then(res => {
        this.$store.dispatch('posts/setList', res.data);
      });
    },
  },
};
</script>

<style>
</style>
