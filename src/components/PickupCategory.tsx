import { defineComponent } from '@nuxtjs/composition-api';

import { Terms } from '~/types/source';
const categories: Array<Terms> = require('~/_source/categories.json');

export default defineComponent({
  name: 'PickupCategory',
  setup(_) {
    return {
      categories,
    };
  },
  render() {
    return (
      <div class="u-scroll-x c-pickup-category">
        <router-link to="/" exact class="c-pickup-category__link">
          <div class="c-pickup-category__item">
            <div class="c-pickup-category__name">HOME</div>
          </div>
        </router-link>
        {this.categories
          .filter((item) => item.count >= 10)
          .map((item, index) => (
            <router-link to={'/' + item.path} class="c-pickup-category__link">
              <div key={index} class="c-pickup-category__item">
                <div class="c-pickup-category__name">{item.name}</div>
              </div>
            </router-link>
          ))}
      </div>
    );
  },
});
