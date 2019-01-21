<template>
  <nav class="post-pager">
    <ul class="pager-list">
      <li v-if="pager.prev" class="pager-item prev">
        <router-link :to="pager.prev.url" :title="pager.prev.title">{{ pager.prev.title }}</router-link>
      </li>
      <li v-if="pager.next" class="pager-item next">
        <router-link :to="pager.next.url" :title="pager.next.title">{{ pager.next.title }}</router-link>
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

<style lang="scss">
.pager-list {
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
  padding: 0;
  list-style: none;
  font-size: map-get($size, sm) * 1rem;
}

.pager-item {
  width: 50%;
  line-height: 1.8;
  word-break: break-all;

  &:only-child {
    flex-grow: 1;
  }

  &.prev,
  &.next {
    a::before {
      display: block;
      margin-bottom: 0.25rem;
      font-weight: bold;
      color: $oc-gray-6;
    }
  }

  &.prev {
    text-align: left;
    a::before {
      content: 'Prev';
    }
  }
  &.next {
    text-align: right;
    a::before {
      content: 'Next';
    }
  }

  a {
    display: block;
    height: 100%;
    padding: 1rem;
    color: $oc-gray-8;
    &:hover {
      background: $oc-gray-1;
      opacity: 1;
    }
  }
}
</style>
