import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'PickupCategory',
  props: {
    list: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  render() {
    return (
      <div class="u-scroll-x c-pickup-category">
        <router-link to="/" exact class="c-pickup-category__link">
          <div class="c-pickup-category__item">
            <div class="c-pickup-category__name">HOME</div>
          </div>
        </router-link>
        {this.list
          .filter((item) => item.pickup === true)
          .map((item) => (
            <router-link to={'/' + item.path} class="c-pickup-category__link">
              <div key={item.id} class="c-pickup-category__item">
                <div class="c-pickup-category__name">{item.name}</div>
              </div>
            </router-link>
          ))}
      </div>
    );
  },
});
