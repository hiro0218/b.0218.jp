import { defineComponent, onMounted } from '@nuxtjs/composition-api';

import { mokuji } from '~/utils/mokuji';

export default defineComponent({
  name: 'PostContent',
  props: {
    content: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(_, { root }) {
    onMounted(() => {
      root.$nextTick(() => {
        const elPostContent = document.querySelector('.js-post-content') as HTMLElement;
        mokuji(elPostContent);
      });
    });

    return {};
  },
  render() {
    return <div class="post__content js-post-content" domPropsInnerHTML={this.content} />;
  },
});
