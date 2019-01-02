<template>
  <div v-if="postHeaders.totalpages">
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
  name: 'PostList',
  data() {
    return {
      page: Number(this.$route.query.page),
    };
  },
  computed: {
    ...mapState('posts', {
      postHeaders: state => state.headers,
      postList: state => state.list,
    }),
  },
  watch: {
    '$route.query.page'(pageNumber) {
      this.fetchList(pageNumber);
    },
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    async fetchList(pageNumber) {
      let number = pageNumber ? pageNumber : 1;
      this.page = number;
      await this.$axios.get(`posts?page=${number}`).then(res => {
        this.$store.dispatch('posts/setHeaders', res.headers);
        this.$store.dispatch('posts/setList', res.data);
      });
    },
    changePage(pageNumber) {
      this.$router.push({
        query: { page: pageNumber },
      });
    },
  },
};
</script>

<style>
.active {
  font-weight: bold;
}
</style>
