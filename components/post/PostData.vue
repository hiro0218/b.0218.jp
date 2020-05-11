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
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$nextTick(() => {
        const elPostContent = document.querySelector('.js-post-content');
        externalLink(elPostContent);
        wrapTable(elPostContent);
        highlight(elPostContent);
        this.initMokuji(elPostContent);
      });
    },
    initMokuji(elPostContent) {
      if (!process.client) return;

      // js-separateを取得できない場合はコンテンツを挿入先とする
      let separate = document.querySelector('.js-separate');
      if (!separate) {
        separate = elPostContent;
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
      const mokujiData = new this.$mokuji(elPostContent, {
        anchorType: true,
        anchorLink: true,
        anchorLinkSymbol: '#',
        anchorLinkBefore: false,
        anchorLinkClassName: 'anchor',
      });

      // 要素を追加
      details.appendChild(mokujiData);
      container.appendChild(details);
      separate.insertBefore(container, separate.firstChild);
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
