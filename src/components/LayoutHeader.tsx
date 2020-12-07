import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'LayoutHeader',
  props: {
    heading: {
      type: String,
    },
    description: {
      type: String,
      required: false,
      default: '',
    },
  },
  render() {
    return (
      <header class="o-heading-block">
        <div class="c-heading">
          <h1 class="c-heading__title">{this.heading}</h1>
          {this.description && <div class="c-heading__description">{this.description}</div>}
        </div>
        {this.$slots.default}
      </header>
    );
  },
});
