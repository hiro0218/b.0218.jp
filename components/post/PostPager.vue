<template>
  <nav v-if="Object.keys(pager).length !== 0">
    <div class="c-pager">
      <router-link v-if="pager.prev" :to="pager.prev.url" :title="pager.prev.title" class="c-pager__item--prev">
        <div class="c-pager__icon--prev">
          <font-awesome-icon icon="arrow-left" />
        </div>
        <div class="c-pager__title--prev">
          {{ pager.prev.title }}
        </div>
      </router-link>
      <router-link v-if="pager.next" :to="pager.next.url" :title="pager.next.title" class="c-pager__item--next">
        <div class="c-pager__icon--next">
          <font-awesome-icon icon="arrow-right" />
        </div>
        <div class="c-pager__title--next">
          {{ pager.next.title }}
        </div>
      </router-link>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PostPager',
  computed: {
    ...mapState('post', {
      pager: state => state.data.attach.pager,
    }),
  },
};
</script>
