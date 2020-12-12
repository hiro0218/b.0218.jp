import { defineComponent, onMounted } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'PostData',
  props: {
    content: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(_, { root }) {
    function initMokuji(elPostContent: HTMLElement) {
      if (!process.client) return;

      // js-separateを取得できない場合はコンテンツを挿入先とする
      let separate = document.querySelector('.js-separate');
      if (!separate) {
        separate = elPostContent;
      }

      // 目次一覧を作成
      // @ts-ignore
      const mokujiList = new root.context.$Mokuji(elPostContent, {
        anchorType: true,
        anchorLink: true,
        anchorLinkSymbol: '#',
        anchorLinkBefore: false,
        anchorLinkClassName: 'anchor',
      });

      // 目次要素が存在しない場合
      if (mokujiList.childNodes.length === 0) return;
      mokujiList.classList.add('c-mokuji__list');

      const container = document.createElement('div');
      container.classList.add('c-mokuji');

      // details/summary要素を作成
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      details.appendChild(summary);
      details.setAttribute('open', 'true');

      window.requestAnimationFrame(() => {
        // 要素を追加
        details.appendChild(mokujiList);
        container.appendChild(details);
        // @ts-ignore
        separate.insertBefore(container, separate.firstChild);
      });
    }

    onMounted(() => {
      root.$nextTick(() => {
        const elPostContent = document.querySelector('.js-post-content');
        // @ts-ignore
        initMokuji(elPostContent);
      });
    });

    return {};
  },
  render() {
    return <div class="post__content js-post-content" domPropsInnerHTML={this.content} />;
  },
});
