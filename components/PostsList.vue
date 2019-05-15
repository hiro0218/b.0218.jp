<template>
  <div>
    <div v-if="postsHeaders.totalpages === 0" class="c-alert is-danger">
      No results found.
    </div>
    <template v-if="postsList.length !== 0">
      <div class="u-list-unstyled post-list">
        <template v-for="post in postsList">
          <nuxt-link :key="post.id" :to="{ path: '/' + post.slug }" class="post-item">
            <div class="post-image">
              <img
                v-if="post.thumbnail"
                :data-src="post.thumbnail"
                :alt="post.title.rendered"
                src="~assets/image/space.gif"
              />
              <svgPhoto v-else class="no-image" />
            </div>
            <div class="post-body">
              <div class="post-title">
                {{ post.title.rendered }}
              </div>
              <div class="post-excerpt">
                {{ post.excerpt.rendered }}
              </div>
              <ul class="c-meta-list">
                <li class="meta-item">
                  <svgTime />
                  <time :datetime="post.date" itemprop="datePublished">{{ post.date | dateToISOString }}</time>
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
import lazyload from '~/assets/script/lazyload.js';
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
  mounted() {
    this.loadImages();
  },
  methods: {
    async fetchList(pageNumber = 1) {
      this.page = Number(pageNumber);

      this.$store
        .dispatch('posts/fetch', {
          page: pageNumber,
          search: this.$route.query.search,
          archiveParams: this.archiveParams,
        })
        .then(() => {
          this.loadImages();
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
    loadImages() {
      this.$nextTick(() => {
        const images = this.$el.querySelectorAll('[data-src]');
        lazyload(images);
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
  margin: 0 0 3rem 0;
}

.post-item {
  display: flex;
  flex-basis: 50%;
  flex-grow: 1;
  margin-bottom: 1rem;
  padding: 1rem;
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

.post-image {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
  width: 5rem;
  height: 5rem;
  background-color: map-get($light-color, 3);
  border-radius: 0.15rem;
  overflow: hidden;

  img {
    width: 5rem;
    height: 5rem;
    object-fit: contain;
  }
  .no-image {
    fill: $tertiary-color;
    width: 2rem;
    height: 2rem;
  }
}

.post-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  font-size: $font-size-sm;

  .post-title {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.8;
  }

  .post-excerpt {
    flex: 1;
    margin-bottom: 1rem;
    color: $secondary-color;
    letter-spacing: 0.02em;
    line-height: 1.8;
  }

  .c-meta-list {
    justify-content: flex-end;
    line-height: 1;
  }
}

// pagination
.pagination-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 0 2rem 0;

  .pagination-item {
    &.active {
      a {
        background: $tertiary-color;
        color: #fff;
        cursor: default;
        &:hover {
          background: $tertiary-color;
          color: #fff;
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
      color: $base-color;
      font-size: $font-size-sm;

      &:hover {
        background-color: map-get($light-color, 2);
      }
      &:focus {
        outline: none;
      }
    }
  }

  .pagination-item + .pagination-item {
    margin-left: 1rem;
    @include mobile {
      margin-left: 0.25rem;
    }
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
