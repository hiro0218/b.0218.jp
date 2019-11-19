<template>
  <div>
    <div v-if="postsHeaders.totalpages === 0" class="c-alert is-danger">
      No results found.
    </div>
    <template v-if="postsList.length !== 0">
      <div class="u-list-unstyled post-list">
        <template v-for="post in postsList">
          <nuxt-link :key="post.id" :to="{ path: '/' + post.slug }" class="post-item">
            <LayoutCard :title="post.title.rendered" :description="post.excerpt.rendered" :thumbnail="post.thumbnail">
              <template v-slot:card-footer>
                <time :datetime="post.date" itemprop="datePublished">{{ post.date | formatDateString }}</time>
              </template>
            </LayoutCard>
          </nuxt-link>
        </template>
      </div>
      <paginate
        v-model="page"
        :page-count="postsHeaders.totalpages"
        :click-handler="changePage"
        prev-text
        next-text
        initial-page="1"
        container-class="u-list-unstyled pagination-container"
        page-class="pagination-item"
        prev-class="pagination-item pagination-prev"
        next-class="pagination-item pagination-next"
        break-view-class="pagination-separate"
      />
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

<style lang="scss">
// postlist
.post-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 0 3rem 0;
}

.post-item {
  display: flex;
  flex-basis: calc(50% - 1rem);
  margin-bottom: 1rem;
  padding: 1rem 0;
  border-radius: 0.15rem;
  color: $base-color;

  @include mobile {
    flex-basis: 100%;
  }

  &:hover {
    opacity: 0.6;
  }

  &:visited {
    color: $base-color;
  }
}
</style>
