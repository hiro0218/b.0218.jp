import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'LayoutHeader',
  render() {
    return (
      <header class="o-heading-block">
        <div class="c-heading">
          {Object.prototype.hasOwnProperty.call(this.$slots, 'header-title') && (
            <h1 class="c-heading__title">
              {this.$slots['header-title'] && this.$slots['header-title'].map((slot) => slot.text)}
            </h1>
          )}
          {Object.prototype.hasOwnProperty.call(this.$slots, 'header-description') && (
            <div class="c-heading__description">
              {this.$slots['header-description'] && this.$slots['header-description'].map((slot) => slot.text)}
            </div>
          )}
        </div>
        {this.$slots.default}
      </header>
    );
  },
});
