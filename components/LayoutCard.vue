<template>
  <div class="card">
    <div class="card-image">
      <img v-if="thumbnail" :src="thumbnail" :alt="title" />
      <svgPhoto v-else class="no-image" />
    </div>
    <div class="card-body">
      <div class="card-title">
        {{ title }}
      </div>
      <div class="card-description">
        {{ description }}
      </div>
    </div>
    <footer class="card-footer">
      <slot name="card-footer" />
    </footer>
  </div>
</template>

<script>
import svgPhoto from '~/assets/image/photo.svg?inline';

export default {
  name: 'LayoutCard',
  components: {
    svgPhoto,
  },
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

<style lang="scss" scoped>
.card {
  display: flex;
  flex-wrap: wrap;
}

.card-image {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
  background-color: map-get($light-color, 3);
  border-radius: 0.15rem;
  overflow: hidden;
  flex-basis: 5rem;
  width: 5rem;
  height: 5rem;

  img {
    width: 5rem;
    height: 5rem;
    object-fit: contain;
  }
  .no-image {
    fill: $tertiary-color;
    width: 2rem;
    height: 2rem;
  }

  @include mobile {
    flex-basis: 8rem;
    width: 8rem;
    height: 8rem;
    .no-image {
      width: 3rem;
      height: 3rem;
    }
  }
}

.card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  font-size: $font-size-sm;

  .card-title {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.8;
  }

  .card-description {
    flex: 1;
    margin-bottom: 1rem;
    color: $secondary-color;
    letter-spacing: 0.02em;
    line-height: 1.8;
    word-break: break-all;
  }
}

.card-footer {
  flex-basis: 100%;
  font-size: $font-size-xs;
  text-align: right;
}
</style>
