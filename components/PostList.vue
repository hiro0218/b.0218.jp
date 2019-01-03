<template>
  <div v-if="postHeaders.totalpages">
    <ul>
      <li v-for="(post, index) in postList" :key="index">
        <time :datetime="post.date" itemprop="datePublished">{{ post.date }}</time>
        <nuxt-link :to="{ path: '/' + post.slug }">{{ post.title.rendered }}</nuxt-link>
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
    tagId: {
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
    this.fetchList(this.$route.query.page);
  },
  methods: {
    async fetchList(pageNumber = 1) {
      this.page = Number(pageNumber);

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
      if (this.mode !== 'posts') {
        return {
          [this.mode]: this.categoryId || this.tagId,
        };
      }
    },
    changePage(pageNumber) {
      this.$router.push({
        query: { page: pageNumber },
      });
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.path !== from.path) {
      this.$store.dispatch('posts/resetList');
    }
    next();
  },
};
</script>

<style>
.active {
  font-weight: bold;
}
</style>
