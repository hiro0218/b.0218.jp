import { defineComponent } from '@nuxtjs/composition-api';
import { NextPrevPost } from '~/types/source';

export default defineComponent({
  name: 'PostPager',
  props: {
    next: {
      type: Object as () => NextPrevPost,
      required: false,
      default: () => {},
    },
    prev: {
      type: Object as () => NextPrevPost,
      required: false,
      default: () => {},
    },
  },
  render() {
    return (
      <nav class="c-pager">
        {Object.keys(this.prev).length !== 0 && (
          <router-link to={this.prev.path} title={this.prev.title} class="c-pager__item--prev">
            <div class="c-pager__title">{this.prev.title}</div>
          </router-link>
        )}
        {Object.keys(this.next).length !== 0 && (
          <router-link to={this.next.path} title={this.next.title} class="c-pager__item--next">
            <div class="c-pager__title">{this.next.title}</div>
          </router-link>
        )}
      </nav>
    );
  },
});
