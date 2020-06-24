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
        <div class="c-category-list__item">
          <router-link to="/" exact class="c-category-list__link">
            /
          </router-link>
        </div>
        {this.list.map((item) => (
          <div key={item.id} class="c-category-list__item">
            <router-link to={'/' + item.path} class="c-category-list__link">
              {item.name}
            </router-link>
          </div>
        ))}
      </div>
    );
  },
});
