<template>
  <div>
    <div v-if="postsHeaders.totalpages === 0" class="c-alert is-danger">
      No results found.
    </div>
    <template v-if="postsList.length !== 0">
      <div class="o-post-list">
        <template v-for="post in postsList">
          <div :key="post.id" class="o-post-list__item">
            <nuxt-link :to="{ path: '/' + post.slug }">
              <LayoutCard :title="post.title.rendered" :description="post.excerpt.rendered" :thumbnail="post.thumbnail">
                <template v-slot:card-footer>
                  <time :datetime="post.date" itemprop="datePublished">{{ post.date | formatDateString }}</time>
                </template>
              </LayoutCard>
            </nuxt-link>
          </div>
        </template>
      </div>
      <paginate
        v-model="page"
        :page-count="postsHeaders.totalpages"
        :click-handler="changePage"
        prev-text
        next-text
        initial-page="1"
        no-li-surround="true"
        container-class="c-pagination u-list-unstyled"
        page-link-class="c-pagination__link"
        prev-link-class="c-pagination__link--prev"
        next-link-class="c-pagination__link--next"
        active-class="c-pagination__link--active"
        disabled-class="c-pagination__disabled"
        break-view-class="c-pagination__separate"
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
