<template functional>
  <div class="c-card">
    <div class="c-card-image">
      <div class="c-card-image__container">
        <img v-if="props.thumbnail" class="c-card-image__item" :src="props.thumbnail" :alt="title" loading="lazy" />
        <font-awesome-icon v-else class="c-card-image__no-item" icon="image" />
      </div>
    </div>
    <div class="c-card-body">
      <div class="c-card-body__title">
        {{ props.title }}
      </div>
      <div v-if="props.description" class="c-card-body__description">
        {{ props.description }}
      </div>
    </div>
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
