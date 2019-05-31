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
  </LayoutArticle>
</template>

<script>
import { mapState } from 'vuex';
import LayoutArticle from '~/components/LayoutArticle.vue';
import PostMeta from '~/components/post/PostMeta.vue';
import PostShare from '~/components/post/PostShare.vue';
import PostAds from '~/components/post/PostAds.vue';
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
        content: null,
      },
    };
  },
  computed: {
    ...mapState('post', {
      post: state => state.data,
    }),
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
      if (!process.client && !window.CSS) return;

      const container = document.querySelector('.mokuji-container');
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = 'INDEX';
      details.appendChild(summary);

      this.elMokuji.content = container.querySelector('.mokuji-content');
      details.appendChild(this.elMokuji.content);

      this.appendMokuji();
      container.appendChild(details);
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

      // workaround: scroll
      Array.from(mokujiData.querySelectorAll('a'), anchor => {
        // inside mokuji
        this.handleAnchorScroll(anchor);

        // inside post-content
        try {
          let escaped_hash = this.escapedSelector(anchor.hash);
          let heading = this.$el.querySelector(`${escaped_hash} > a`);
          this.handleAnchorScroll(heading);
        } catch (e) {
          console.error(e);
        }
      });

      // loaded
      this.scrollTo(this.$route.hash);
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
    handleAnchorScroll(element) {
      if (!element) return;

      element.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        this.scrollTo(element.hash);
        this.$router.push({ hash: element.hash });
      });
    },
    scrollTo(hash) {
      if (!hash) return;

      try {
        let escaped_hash = this.escapedSelector(hash);
        let target = this.$el.querySelector(escaped_hash);
        if (target) {
          setTimeout(() => {
            window.scrollTo({ left: 0, top: target.offsetTop, behavior: 'smooth' });
          }, 0);
        }
      } catch (e) {
        console.error(e);
      }
    },
    escapedSelector(selector) {
      let hash = selector.slice(1);
      return '#' + CSS.escape(hash);
    },
  },
};
</script>

<style lang="scss" scoped>
.post {
  > .c-title {
    margin-bottom: 4rem;
  }
  .c-alert {
    margin-bottom: 1rem;
  }
}

.post-content /deep/ {
  margin-bottom: 2rem;

  // mokuji
  .mokuji-container {
    margin: 2rem 0;
    border-radius: 0.15rem;
    background: map-get($light-color, 4);
    color: $secondary-color;
    font-size: $font-size-sm;
    details {
      padding: 1rem 1.5rem;
    }
  }

  .mokuji-content {
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
