<template>
  <LayoutArticle @mounted="init">
    <template v-slot:postTitle>
      {{ post.title.rendered }}
    </template>
    <template v-slot:postMeta>
      <PostMeta />
    </template>
    <PostAds />
    <div class="post-content" v-html="post.content.rendered" />
    <PostShare />
    <PostAds />
  </LayoutArticle>
</template>

<script>
import { mapState } from 'vuex';
const LayoutArticle = () => import('~/components/LayoutArticle.vue');
import PostMeta from '~/components/PostMeta.vue';
const PostShare = () => import('~/components/PostShare.vue');
const PostAds = () => import('~/components/PostAds.vue');
import externalLink from '~/assets/script/externalLink.js';

export default {
  name: 'PostData',
  head() {
    return {
      style: [{ cssText: this.post.attach.custom.style, type: 'text/css' }],
    };
  },
  components: {
    LayoutArticle,
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
  destroyed() {
    this.toggleMokuji(false);
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.elPostContent = this.$el.querySelector('.post-content');
        externalLink(this.elPostContent);
        this.initCustomScript();
        this.addTableContainer();
        this.initHighlight();
        this.initMokuji();
      });
    },
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
  > .c-title {
    margin-bottom: 4rem;
  }
  .c-alert {
    margin-bottom: 1rem;
  }
}

.post-content {
  margin-bottom: 2rem;

  // mokuji
  .mokuji-container {
    margin: 2rem 0;
    padding: 1rem 1.5rem;
    border-radius: 0.15rem;
    background: map-get($light-color, 4);
    color: $secondary-color;
    font-size: $font-size-sm;
  }

  .mokuji-title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-lg;
    font-weight: bold;
    line-height: 1;
    user-select: none;
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
      color: inherit;
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
        padding-left: 1.25em;
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
