<template>
  <article class="post">
    <header class="c-title">
      <h1 class="title-main">{{ post.title.rendered }}</h1>
      <PostMeta/>
    </header>
    <PostAds/>
    <div class="post-content" v-html="post.content.rendered"/>
    <PostShare/>
    <PostAds/>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import PostMeta from '~/components/PostMeta.vue';
const PostShare = () => import('~/components/PostShare.vue');
const PostAds = () => import('~/components/PostAds.vue');

export default {
  name: 'PostData',
  head() {
    return {
      style: [{ cssText: this.post.attach.custom.style, type: 'text/css' }],
    };
  },
  components: {
    PostMeta,
    PostShare,
    PostAds,
  },
  data() {
    return {
      elPostContent: null,
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
      this.elPostContent = document.querySelector('.post-content');
      this.initCustomScript();
      this.addExternalLinkIcon();
      this.addTableContainer();
      this.initHighlight();
      this.initMokuji();
    });
  },
  destroyed() {
    this.toggleMokuji(false);
  },
  methods: {
    initCustomScript() {
      if (this.post.attach.custom.script) {
        try {
          eval(this.post.attach.custom.script);
        } catch (e) {
          console.log(e);
        }
      }
    },
    initMokuji() {
      if (!process.client) return;
      this.elMokuji.title = document.querySelector('.mokuji-title');
      this.elMokuji.content = document.querySelector('.mokuji-content');
      this.appendMokuji();
      this.toggleMokuji();
    },
    appendMokuji() {
      if (!this.elMokuji.content) return;

      const mokujiData = new this.$mokuji(this.elPostContent, {
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
    addExternalLinkIcon() {
      const links = this.elPostContent.querySelectorAll('a');
      if (links.length === 0) return;
      Array.from(links, element => {
        var href = element.getAttribute('href');
        // exclude javascript and anchor
        if (href.substring(0, 10).toLowerCase() === 'javascript' || href.substring(0, 1) === '#') {
          return;
        }

        // check hostname
        if (element.hostname === location.hostname) {
          return;
        }

        // set target and rel
        element.setAttribute('target', '_blank');
        element.setAttribute('rel', 'nofollow');
        element.setAttribute('rel', 'noopener');

        // set icon when childNode is text
        if (element.hasChildNodes()) {
          if (element.childNodes[0].nodeType === 3) {
            // add icon class
            element.classList.add('is-external_link');
          }
        }
      });
    },
    addTableContainer() {
      const tables = this.elPostContent.querySelectorAll('table');
      if (tables.length === 0) return;

      let div = document.createElement('div');
      div.classList.add('table-container', 'u-scroll-x');

      for (let i = 0; i < tables.length; i += 1) {
        let wrapper = div.cloneNode(false);
        tables[i].parentNode.insertBefore(wrapper, tables[i]);
        wrapper.appendChild(tables[i]);
      }
    },
    initHighlight() {
      Array.from(this.$el.querySelectorAll('pre code'), elm => {
        this.$hljs.highlightBlock(elm);
      });
    },
  },
};
</script>

<style lang="scss">
.post {
  max-width: $tablet;
  margin-right: auto;
  margin-left: auto;

  > .c-title {
    margin-bottom: 4rem;
    .title-main {
      margin-bottom: 0.5em;
      font-size: 2rem;
    }
  }
  .c-alert {
    margin-bottom: 1rem;
  }
}

.post-content {
  margin-bottom: 2rem;

  a {
    &:hover {
      opacity: 0.6;
    }

    &.is-external_link {
      &::after {
        display: inline-block;
        width: 1em;
        height: 1em;
        content: '';
        background: url('~assets/image/open_in_new.svg') center / 1em 1em no-repeat;
      }
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    position: relative;
    .anchor {
      position: absolute;
      right: calc(100% + 0.25em);
      top: 0;
      bottom: 0;
      margin: auto;
      border: 0;
      color: map-get($light-color, 1);
      user-select: none;
      @include until($desktop) {
        position: static;
        margin-left: 0.25em;
      }
    }
  }

  h1,
  h2,
  h3 {
    margin-top: 3em;
  }

  h4,
  h5,
  h6 {
    margin-top: 2.5em;
  }

  ul,
  ol {
    li {
      margin-bottom: 0.625rem;
    }
  }

  // mokuji
  .mokuji-container {
    margin: 2rem 0;
    padding: 1rem 1.5rem;
    border-left: 0.2rem solid map-get($light-color, 1);
  }
  .mokuji-title {
    display: inline-flex;
    align-items: center;
    font-size: 1rem;
    font-weight: bold;
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

    a {
      color: $base-color;
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
        margin: 0.5rem 0;
        padding-left: 1rem;
        list-style: none;
      }
    }

    > ol > li > a {
      font-weight: bold;
    }
  }

  // sandbox
  .sandbox {
    position: relative;
    margin-bottom: 2rem;
    padding: 2rem;
    border: 2px solid map-get($light-color, 3);
    background: #fff;
    & + pre {
      margin-top: -(2rem + 0.15rem) !important;
    }
  }

  hr {
    height: 2rem;
    margin: 2rem 0;
    border: 0;
    color: $tertiary-color;
    text-align: center;

    &::before {
      content: '***';
      font-size: 1.5rem;
    }
  }
}
</style>
