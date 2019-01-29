<template>
  <aside v-if="post_amazon !== null" class="post-amazon">
    <div class="c-title">
      <h2 class="title-main">Related Product</h2>
    </div>
    <a :href="post_amazon.DetailPageURL" class="product-container" target="_blank">
      <div class="product-image">
        <img :src="post_amazon.LargeImage">
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
  border: 1px solid $oc-gray-1;
  border-radius: 0.15rem;
  color: $oc-gray-8;

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
  background-color: $oc-gray-1;

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
    color: $oc-gray-6;
    font-size: map-get($size, sm) * 1rem;
  }
}
</style>
