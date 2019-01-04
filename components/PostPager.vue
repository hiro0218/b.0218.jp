<template>
  <nav>
    <ul>
      <li>
        <router-link v-if="pager.prev" :to="pager.prev.url" :title="pager.prev.title">
          {{ pager.prev.title }}
        </router-link>
      </li>
      <li>
        <router-link v-if="pager.next" :to="pager.next.url" :title="pager.next.title">
          {{ pager.next.title }}
        </router-link>
      </li>
    </ul>
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

<style>
</style>
