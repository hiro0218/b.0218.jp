<template>
  <div class="post__content js-post-content" v-html="content" />
</template>

<script>
import externalLink from '~/assets/script/externalLink.js';
import highlight from '~/assets/script/highlight.js';
import wrapTable from '~/assets/script/wrapTable.js';

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
        wrapTable(this.elPostContent);
        highlight(this.elPostContent);
        this.initMokuji();
      });
    },
    initMokuji() {
      if (!process.client && !window.CSS) return;

      // js-separateを取得できない場合はコンテンツを挿入先とする
      let separate = document.querySelector('.js-separate');
      if (!separate) {
        separate = this.elPostContent;
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
    handleAnchorScroll(element) {
      if (!element) return;

      element.addEventListener('click', (e) => {
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
