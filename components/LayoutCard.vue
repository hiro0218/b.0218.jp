<template>
  <div class="c-card">
    <div class="c-card-image">
      <img v-if="thumbnail" class="c-card-image__item" :src="thumbnail" :alt="title" loading="lazy" />
      <font-awesome-icon v-else class="c-card-image__no-item" icon="image" />
    </div>
    <div class="c-card-body">
      <div class="c-card-body__title">
        {{ title }}
      </div>
      <div class="c-card-body__description">
        {{ description }}
      </div>
    </div>
    <footer class="c-card-footer">
      <slot name="card-footer" />
    </footer>
  </div>
</template>

<script>
export default {
  name: 'LayoutCard',
  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },
    description: {
      type: String,
      required: false,
      default: '',
    },
    thumbnail: {
      type: String,
      required: false,
      default: '',
    },
  },
};
</script>
