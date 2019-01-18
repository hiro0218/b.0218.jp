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
        :click-handler="changePage"
        prev-text
        next-text
        initial-page="1"
        container-class="pagination-container"
        page-class="pagination-item"
        prev-class="pagination-item pagination-prev"
        next-class="pagination-item pagination-next"
        break-view-class="pagination-separate"
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

<style lang="scss">
.pagination-container {
  display: flex;
  justify-content: center;
  margin: 0 0 1rem 0;
  padding: 0;
  list-style: none;

  .pagination-item {
    &:focus {
      outline: none;
    }

    &.active {
      a {
        background: $oc-gray-2;
        &:hover {
          background-color: $oc-gray-2;
        }
      }
    }

    a {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 2.5rem;
      min-width: 2.5rem;
      border-radius: 50%;
      font-size: map-get($size, sm) * 1rem;

      &:hover {
        background-color: $oc-gray-1;
        opacity: 1;
      }
    }
  }

  .pagination-item + .pagination-item {
    margin-left: 1rem;
  }

  .pagination-separate {
    pointer-events: none;
  }

  .pagination-prev a {
    background: url('~assets/image/arrow_left.svg') center / 1rem 1rem no-repeat;
  }
  .pagination-next a {
    background: url('~assets/image/arrow_right.svg') center / 1rem 1rem no-repeat;
  }
}
</style>
