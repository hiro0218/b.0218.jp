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
  props: {
    mode: {
      type: String,
      required: false,
      default: 'posts',
    },
    categoryId: {
      type: Number,
      required: false,
      default: 0,
    },
  },
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
    async fetchList(pageNumber = 1) {
      this.page = pageNumber;

      await this.$axios
        .get('posts', {
          params: {
            page: pageNumber,
            ...this.createParams(),
          },
        })
        .then(res => {
          this.$store.dispatch('posts/setHeaders', res.headers);
          this.$store.dispatch('posts/setList', res.data);
        });
    },
    createParams() {
      if (this.mode === 'categories' && this.categoryId !== 0) {
        return {
          categories: this.categoryId,
        };
      }
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
