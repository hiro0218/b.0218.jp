import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'PostPager',
  props: {
    next: {
      type: Object,
      required: false,
      default: () => {},
    },
    prev: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  render() {
    return (
      <nav class="c-pager">
        {Object.keys(this.prev).length !== 0 && (
          <router-link to={this.prev.path} title={this.prev.title} class="c-pager__item--prev">
            <div class="c-pager__icon--prev" domPropsInnerHTML={this.$icon['arrow-left']} />
            <div class="c-pager__title--prev">{this.prev.title}</div>
          </router-link>
        )}
        {Object.keys(this.next).length !== 0 && (
          <router-link to={this.next.path} title={this.next.title} class="c-pager__item--next">
            <div class="c-pager__icon--next" domPropsInnerHTML={this.$icon['arrow-right']} />
            <div class="c-pager__title--next">{this.next.title}</div>
          </router-link>
        )}
      </nav>
    );
  },
});
