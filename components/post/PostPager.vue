<template functional>
  <nav class="c-pager">
    <router-link
      v-if="props.pager.prev"
      :to="props.pager.prev.url"
      :title="props.pager.prev.title"
      class="c-pager__item--prev"
    >
      <div class="c-pager__icon--prev">
        <font-awesome-icon icon="arrow-left" />
      </div>
      <div class="c-pager__title--prev">
        {{ props.pager.prev.title }}
      </div>
    </router-link>
    <router-link
      v-if="props.pager.next"
      :to="props.pager.next.url"
      :title="props.pager.next.title"
      class="c-pager__item--next"
    >
      <div class="c-pager__icon--next">
        <font-awesome-icon icon="arrow-right" />
      </div>
      <div class="c-pager__title--next">
        {{ props.pager.next.title }}
      </div>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'PostPager',
  props: {
    pager: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
};
</script>
