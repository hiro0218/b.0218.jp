<template functional>
  <nav class="c-pager">
    <router-link
      v-if="Object.keys(props.prev).length !== 0"
      :to="props.prev.path"
      :title="props.prev.title"
      class="c-pager__item--prev"
    >
      <div class="c-pager__icon--prev">
        <font-awesome-icon icon="arrow-left" />
      </div>
      <div class="c-pager__title--prev">
        {{ props.prev.title }}
      </div>
    </router-link>
    <router-link
      v-if="Object.keys(props.next).length !== 0"
      :to="props.next.path"
      :title="props.next.title"
      class="c-pager__item--next"
    >
      <div class="c-pager__icon--next">
        <font-awesome-icon icon="arrow-right" />
      </div>
      <div class="c-pager__title--next">
        {{ props.next.title }}
      </div>
    </router-link>
  </nav>
</template>

<script lang="ts">
export default {
  name: 'PostPager',
  props: {
    next: {
      type: Object,
      required: false,
      default: () => {},
    },
    prev: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
};
</script>
