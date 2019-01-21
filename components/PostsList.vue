<template>
  <div>
    <div v-if="postsHeaders.totalpages === 0" class="c-alert is-warning">No results found.</div>
    <template v-if="postsList.length !== 0">
      <div class="post-list">
        <template v-for="(post, index) in postsList">
          <nuxt-link :to="{ path: '/' + post.slug }" :key="index" class="post-item">
            <div class="post-image">
              <img v-if="post.thumbnail" :src="post.thumbnail">
              <svgPhoto v-else class="no-image"/>
            </div>
            <div class="post-body">
              <div class="post-title">{{ post.title.rendered }}</div>
              <div class="post-excerpt">{{ post.excerpt.rendered }}</div>
              <ul class="c-meta-list">
                <li class="meta-item">
                  <svgTime/>
                  <time
                    :datetime="post.date"
                    itemprop="datePublished"
                  >{{ post.date | dateToISOString }}</time>
                </li>
              </ul>
            </div>
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
        container-class="pagination-container"
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
import svgTime from '~/assets/image/time.svg?inline';
import svgPhoto from '~/assets/image/photo.svg?inline';

export default {
  name: 'PostsList',
  components: {
    svgTime,
    svgPhoto,
  },
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
  flex-direction: column;
  list-style: none;
  margin: 0 0 2rem 0;
  padding: 0;
}

.post-item {
  display: flex;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 0.15rem;
  color: $oc-gray-8;

  &:hover {
    background: $oc-gray-1;
    opacity: 1;
  }
}

.post-image {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
  width: 5rem;
  height: 5rem;
  background-color: $oc-gray-2;
  border-radius: 0.15rem;

  img {
    width: 5rem;
    height: 5rem;
    object-fit: contain;
  }
  .no-image {
    fill: $oc-gray-6;
    width: 2rem;
    height: 2rem;
  }
}

.post-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;

  .post-title {
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  .post-excerpt {
    margin-bottom: 1rem;
    color: $oc-gray-6;
    font-size: map-get($size, sm) * 1rem;
  }

  .c-meta-list {
    justify-content: flex-end;
  }
}

// pagination
.pagination-container {
  display: flex;
  justify-content: center;
  margin: 0 0 2rem 0;
  padding: 0;
  list-style: none;

  .pagination-item {
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
      &:focus {
        outline: none;
      }
    }
  }

  .pagination-item + .pagination-item {
    margin-left: 1rem;
  }

  .pagination-separate {
    pointer-events: none;
  }

  .pagination-prev.disabled,
  .pagination-next.disabled {
    opacity: 0.3;
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
