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
      container.classList.add('c-mokuji');

      // details/summary要素を作成
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      details.appendChild(summary);
      details.setAttribute('open', 'true');

      // 目次一覧を作成
      const mokujiList = new this.$mokuji(elPostContent, {
        anchorType: true,
        anchorLink: true,
        anchorLinkSymbol: '#',
        anchorLinkBefore: false,
        anchorLinkClassName: 'anchor',
      });
      mokujiList.classList.add('c-mokuji__list');

      window.requestAnimationFrame(() => {
        // 要素を追加
        details.appendChild(mokujiList);
        container.appendChild(details);
        separate.insertBefore(container, separate.firstChild);
      });
    },
  },
};
</script>

<style lang="scss">
.post__content {
  margin: 2rem 0;

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
