import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'PickupCategory',
  setup(_, { root }) {
    // @ts-ignore
    const categories = root.context.$source.categories;

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
          .filter((item: any) => item.pickup === true)
          .map((item: any) => (
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
