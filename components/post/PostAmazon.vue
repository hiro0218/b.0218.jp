<template>
  <aside v-if="post_amazon" class="post-amazon">
    <div class="c-title is-center is-normal">
      <h2 class="title-main">Related Product</h2>
    </div>
    <a :href="post_amazon.DetailPageURL" class="product-container" target="_blank">
      <div class="product-image">
        <img :src="post_amazon.LargeImage" />
      </div>
      <div class="product-info">
        <span class="title">{{ post_amazon.Title }}</span>
        <span class="url">{{ getProductDomain() }}</span>
      </div>
    </a>
  </aside>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PostAmazon',
  computed: {
    ...mapState('post', {
      post_amazon: state => state.data.amazon_product,
    }),
  },
  methods: {
    getProductDomain: function() {
      return this.post_amazon.DetailPageURL.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1];
    },
  },
};
</script>

<style lang="scss">
.post-amazon {
  margin: 2rem 0;
}

.product-container {
  display: flex;
  align-items: center;
  height: 8rem;
  border: 1px solid map-get($light-color, 3);
  border-radius: 0.15rem;
  color: $base-color;

  @include mobile {
    flex-direction: column;
    height: auto;
  }

  &:hover {
    opacity: 0.6;
  }
}

.product-image {
  display: flex;
  width: 15rem;
  height: 100%;
  background-color: map-get($light-color, 3);

  @include mobile {
    width: 100%;
    height: 12rem;
  }

  img {
    margin: auto;
    max-width: 80%;
    max-height: 80%;
    height: auto;
  }
}

.product-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 1rem;

  .title {
    margin-bottom: 0.25rem;
  }
  .url {
    color: $tertiary-color;
    font-size: $font-size-sm;
  }
}
</style>
