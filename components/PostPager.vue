<template>
  <nav class="c-pager">
    <router-link v-if="Object.keys(prev).length !== 0" :to="prev.path" :title="prev.title" class="c-pager__item--prev">
      <div class="c-pager__icon--prev" v-html="$icon['arrow-left'].toSVG()" />
      <div class="c-pager__title--prev">
        {{ prev.title }}
      </div>
    </router-link>
    <router-link v-if="Object.keys(next).length !== 0" :to="next.path" :title="next.title" class="c-pager__item--next">
      <div class="c-pager__icon--next" v-html="$icon['arrow-right'].toSVG()" />
      <div class="c-pager__title--next">
        {{ next.title }}
      </div>
    </router-link>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
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
});
</script>
