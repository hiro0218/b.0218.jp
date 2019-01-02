<template>
  <div>
    <ul>
      <li v-for="(post, index) in postList" :key="index">
        {{ post.date }}
        <nuxt-link :to="{ path: post.slug }">{{ post.title.rendered }}</nuxt-link>
      </li>
    </ul>
    <paginate
      v-model="page"
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
  data() {
    return {
      page: Number(this.$route.params.pageNum),
    };
  },
  computed: {
    ...mapState('posts', {
      postHeaders: state => state.headers,
      postList: state => state.list,
    }),
  },
  methods: {
    async changePage(pageNum) {
      this.$router.push({
        path: `/page/${pageNum}`,
      });
    },
  },
};
</script>

<style>
</style>
