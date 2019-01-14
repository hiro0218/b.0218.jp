<template>
  <div>
    <div v-if="postsHeaders.totalpages === 0" class="alert">No results found.</div>
    <div v-if="postsList.length !== 0">
      <ul>
        <li v-for="(post, index) in postsList" :key="index">
          <time :datetime="post.date" itemprop="datePublished">{{ post.date | dateToISOString }}</time>
          <nuxt-link :to="{ path: '/' + post.slug }">{{ post.title.rendered }}</nuxt-link>
        </li>
      </ul>
      <paginate
        v-model="page"
        :page-count="postsHeaders.totalpages"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :click-handler="changePage"
        initial-page="1"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PostsList',
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
      postsHeaders: state => state.headers,
      postsList: state => state.list,
    }),
  },
  watch: {
    '$route.query'(query) {
      this.fetchList(query.page);
    },
  },
  mounted() {
    this.fetchList(this.$route.query.page);
  },
  methods: {
    async fetchList(pageNumber = 1) {
      this.page = Number(pageNumber);

      await this.$axios
        .get('wp/v2/posts', {
          params: {
            page: pageNumber,
            search: this.$route.query.search,
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
        query: {
          page: pageNumber,
          search: this.$route.query.search,
        },
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
