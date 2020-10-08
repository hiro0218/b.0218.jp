import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'PostsCategoryList',
  props: {
    list: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  render() {
    return (
      <div class="u-scroll-x c-category-list">
        <router-link to="/" exact class="c-category-list__link">
          <div class="c-category-list__item">
            <div class="c-category-list__logo">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div class="c-category-list__name">HOME</div>
          </div>
        </router-link>
        {this.list
          .filter((item) => item.pickup === true)
          .map((item) => (
            <router-link to={'/' + item.path} class="c-category-list__link">
              <div key={item.id} class="c-category-list__item">
                <div class="c-category-list__logo">
                  <img src={item.logo} loading="lazy" />
                </div>
                <div class="c-category-list__name">{item.name}</div>
              </div>
            </router-link>
          ))}
      </div>
    );
  },
});
