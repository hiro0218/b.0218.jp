<template>
  <div class="post__content js-post-content" v-html="content" />
</template>

<script>
import externalLink from '~/assets/script/externalLink.js';
import Highlightjs from '~/assets/script/highlightjs.worker.js';

export default {
  name: 'PostData',
  props: {
    content: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      elPostContent: null,
      elMokuji: {
        content: null,
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.elPostContent = document.querySelector('.js-post-content');
        externalLink(this.elPostContent);
        this.addTableContainer();
        this.initHighlight();
        this.initMokuji();
      });
    },
    initMokuji() {
      if (!process.client && !window.CSS) return;

      // js-separateを取得できない場合はコンテンツを挿入先とする
      let separate = document.querySelector('.js-separate');
      if (!separate) {
        separate = document.querySelector('.js-post-content');
      }

      const container = document.createElement('div');
      container.classList.add('mokuji-container');

      // details/summary要素を作成
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = 'INDEX';
      details.appendChild(summary);
      details.classList.add('mokuji-content');

      // 目次一覧を作成
      const mokujiData = new this.$mokuji(this.elPostContent, {
        anchorType: true,
        anchorLink: true,
        anchorLinkSymbol: '#',
        anchorLinkBefore: false,
        anchorLinkClassName: 'anchor',
      });

      // アンカーへの効果を付与
      this.addMokujiAnchorScrollEffects(mokujiData);

      // 要素を追加
      details.appendChild(mokujiData);
      container.appendChild(details);
      separate.insertBefore(container, separate.firstChild);
    },
    addMokujiAnchorScrollEffects(element) {
      // workaround: scroll
      const anchorMokuji = element.querySelectorAll('a');
      for (let i = 0; i < anchorMokuji.length; i++) {
        const anchor = anchorMokuji[i];

        // inside mokuji
        this.handleAnchorScroll(anchor);

        // inside post-content
        try {
          const escaped_hash = this.escapedSelector(anchor.hash);
          const heading = this.$el.querySelector(`${escaped_hash} > a`);
          this.handleAnchorScroll(heading);
        } catch (e) {
          console.error(e);
        }
      }

      // loaded
      this.scrollTo(this.$route.hash);
    },
    addTableContainer() {
      const tables = this.elPostContent.querySelectorAll('table');
      if (tables.length === 0) return;

      const div = document.createElement('div');
      div.classList.add('table-container', 'u-scroll-x');

      for (let i = 0; i < tables.length; i += 1) {
        const wrapper = div.cloneNode(false);
        tables[i].parentNode.insertBefore(wrapper, tables[i]);
        wrapper.appendChild(tables[i]);
      }
    },
    initHighlight() {
      const elementCode = this.$el.querySelectorAll('pre code');

      for (let i = 0; i < elementCode.length; i++) {
        const worker = new Highlightjs();
        const element = elementCode[i];
        const className = element.className.replace('language-', '');

        // 送信
        worker.postMessage(
          JSON.stringify({
            languageSubset: [className],
            text: element.textContent,
          }),
        );
        // 受信
        worker.onmessage = event => {
          requestAnimationFrame(() => {
            if (className) {
              element.dataset.language = className;
            }
            element.classList.add('hljs');
            element.innerHTML = event.data;
          });
        };
      }
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
        const escaped_hash = this.escapedSelector(hash);
        const target = this.$el.querySelector(escaped_hash);
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
      const hash = selector.slice(1);
      return '#' + CSS.escape(hash);
    },
  },
  // head() {
  //   return {
  //     style: [{ cssText: this.post.attach.custom.style, type: 'text/css' }],
  //   };
  // },
};
</script>

<style lang="scss">
.post__content {
  margin: 2rem 0;

  // mokuji
  .mokuji-container {
    margin: 2rem 0;
    border-radius: 0.15rem;
    background: $bg-color--light;
    color: $color-text--light;
    font-size: $font-size-sm;
  }

  .mokuji-content {
    a {
      color: inherit;
    }

    ol {
      margin-bottom: 0;
      padding-left: 0;
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
    border: 2px solid $bg-color--lighter;
    background: #fff;
    & + pre {
      margin-top: -(2rem + 0.15rem) !important;
    }
  }
}
</style>
