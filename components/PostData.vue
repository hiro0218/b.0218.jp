<template>
  <article class="post">
    <header class="c-title">
      <h1 class="title-main">{{ post.title.rendered }}</h1>
      <ul class="c-meta-list">
        <li class="meta-item">
          <svgTime/>
          <time :datetime="post.date" itemprop="datePublished">{{ post.date | dateToISOString }}</time>
        </li>
        <li v-if="!isDateSameDay(post.date, post.modified)" class="meta-item">
          <svgArrowRight/>
          <time
            :datetime="post.modified"
            itemprop="dateModified"
          >{{ post.modified | dateToISOString }}</time>
        </li>
      </ul>
    </header>
    <div class="post-content" v-html="post.content.rendered"/>
    <footer>
      <ul v-if="post.hasOwnProperty('_embedded')">
        <li v-for="(category, index) in post._embedded['wp:term'][0]" :key="index">
          <nuxt-link :to="'/category/' + category.slug">{{ category.name }}</nuxt-link>
        </li>
      </ul>
      <ul v-if="post.hasOwnProperty('_embedded')">
        <li v-for="(post_tag, index) in post._embedded['wp:term'][1]" :key="index">
          <nuxt-link :to="'/tag/' + post_tag.slug">{{ post_tag.name }}</nuxt-link>
        </li>
      </ul>
    </footer>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import svgTime from '~/assets/image/time.svg?inline';
import svgArrowRight from '~/assets/image/arrow_right.svg?inline';

export default {
  name: 'PostData',
  components: {
    svgTime,
    svgArrowRight,
  },
  data() {
    return {
      elMokuji: {
        title: null,
        content: null,
      },
    };
  },
  computed: {
    ...mapState('post', {
      post: state => state.data,
    }),
  },
  mounted() {
    this.$nextTick(() => {
      this.initMokuji();
    });
  },
  destroyed() {
    this.toggleMokuji(false);
  },
  methods: {
    initMokuji() {
      if (!process.client) return;
      this.elMokuji.title = document.querySelector('.mokuji-title');
      this.elMokuji.content = document.querySelector('.mokuji-content');
      this.appendMokuji();
      this.toggleMokuji();
    },
    appendMokuji() {
      if (!this.elMokuji.content) return;

      const mokujiData = new this.$mokuji(document.querySelector('.post-content'), {
        anchorType: true,
        anchorLink: true,
        anchorLinkSymbol: '#',
        anchorLinkBefore: false,
        anchorLinkClassName: 'anchor',
      });

      this.elMokuji.content.appendChild(mokujiData);
    },
    toggleMokuji(init = true) {
      if (!this.elMokuji.title) return;

      if (init) {
        this.elMokuji.title.addEventListener('click', () => this.toggleMokujiContent());
      } else {
        this.elMokuji.title.removeEventListener('click', () => this.toggleMokujiContent());
      }
    },
    toggleMokujiContent() {
      this.elMokuji.title.classList.toggle('open');
      this.elMokuji.content.classList.toggle('open');
    },
  },
};
</script>

<style lang="scss">
.post {
  .c-title {
    margin-bottom: 2rem;
  }
  .c-meta-list {
    justify-content: center;
  }
}

.post-content {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    position: relative;
  }

  .anchor {
    position: absolute;
    right: calc(100% + 0.25em);
    top: 0;
    bottom: 0;
    margin: auto;
    border: 0;
    color: $oc-gray-4;
    user-select: none;
    @include until($desktop) {
      position: static;
      margin-left: 0.25em;
    }
  }

  // mokuji
  .mokuji-container {
    margin: 2rem 0;
  }
  .mokuji-title {
    display: inline-flex;
    align-items: center;
    font-size: $h3-font-size;
    cursor: pointer;
    &::after {
      display: inline-block;
      width: 1em;
      height: 1em;
      content: '';
      background: url('~assets/image/arrow_up.svg') center / 1em 1em no-repeat;
    }
    &.open::after {
      background-image: url('~assets/image/arrow_down.svg');
    }
  }
  .mokuji-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;

    &.open {
      max-height: 200vh;
    }

    ol {
      margin-bottom: 0;
      padding-left: 0;
      list-style: none;
      list-style-position: inside;
      counter-reset: number;

      li {
        list-style: none;
        &::before {
          content: counters(number, '-') '. ';
          counter-increment: number;
        }
      }

      ol {
        margin-bottom: 0.5rem;
        padding-left: 1rem;
        list-style: none;
      }
    }

    > ol > li > a {
      font-weight: bold;
    }
  }

  hr {
    height: 2rem;
    margin: 2rem 0;
    border: 0;
    color: $oc-gray-6;
    text-align: center;

    &::before {
      content: '***';
      font-size: 1.5rem;
    }
  }
}
</style>
