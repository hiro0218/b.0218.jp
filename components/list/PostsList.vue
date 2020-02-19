<template>
  <div class="p-post-list">
    <div v-if="postsHeaders.totalpages === 0" class="c-alert is-danger">
      No results found.
    </div>
    <template v-if="postsList.length !== 0">
      <template v-for="post in postsList">
        <nuxt-link :key="post.id" class="o-post-list__item" :to="{ path: '/' + post.slug }">
          <LayoutCard :title="post.title.rendered" :description="post.excerpt.rendered" :thumbnail="post.thumbnail" />
        </nuxt-link>
      </template>

      <div class="p-post-list-pagination">
        <paginate
          v-model="page"
          :page-count="postsHeaders.totalpages"
          :click-handler="changePage"
          prev-text
          next-text
          initial-page="1"
          :no-li-surround="true"
          container-class="c-pagination u-list-unstyled"
          page-link-class="c-pagination__link"
          prev-link-class="c-pagination__link--prev"
          next-link-class="c-pagination__link--next"
          active-class="is-active"
          disabled-class="is-disabled"
          break-view-link-class="is-separate"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LayoutCard from '~/components/LayoutCard.vue';

export default {
  name: 'PostsList',
  components: {
    LayoutCard,
  },
  props: {
    mode: {
      type: String,
      required: false,
      default: 'posts',
    },
    termId: {
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
    archiveParams: function() {
      if (this.mode !== 'posts') {
        return {
          [this.mode]: this.termId,
        };
      }
      return {};
    },
  },
  watch: {
    '$route.query'(query) {
      this.fetchList(query.page);
    },
  },
  methods: {
    async fetchList(pageNumber = 1) {
      this.page = Number(pageNumber);

      this.$store.dispatch('posts/fetch', {
        page: pageNumber,
        search: this.$route.query.search,
        archiveParams: this.archiveParams,
      });
    },
    changePage(pageNumber) {
      this.$router.push({
        query: {
          page: pageNumber,
          search: this.$route.query.search,
        },
      });
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.p-post-list-pagination {
  margin-top: 2rem;
}
</style>
