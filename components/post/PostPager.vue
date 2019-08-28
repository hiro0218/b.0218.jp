<template>
  <nav v-if="Object.keys(pager).length !== 0" class="post-pager">
    <div class="pager-list">
      <router-link v-if="pager.prev" :to="pager.prev.url" :title="pager.prev.title" class="pager-item prev">
        <div class="pager-icon">
          <font-awesome-icon icon="arrow-left" />
        </div>
        <div class="pager-title">
          {{ pager.prev.title }}
        </div>
      </router-link>
      <router-link v-if="pager.next" :to="pager.next.url" :title="pager.next.title" class="pager-item next">
        <div class="pager-icon">
          <font-awesome-icon icon="arrow-right" />
        </div>
        <div class="pager-title">
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

<style lang="scss">
.post-pager {
  margin: 2rem 0;
}

.pager-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  font-size: $font-size-sm;
}

.pager-item {
  display: grid;
  grid-column-gap: 0.5rem;
  width: 48%;
  padding: 1rem 0;
  border-radius: 0.15rem;
  color: $base-color;
  line-height: 1.8;
  word-break: break-all;

  &:hover {
    opacity: 0.6;
  }

  &:only-child {
    flex-grow: 1;
  }

  @include mobile {
    width: 100%;
  }

  &.prev {
    grid-template-columns: 1.5rem 1fr;
    text-align: left;
    .pager-icon {
      grid-column-start: 1;
      grid-row-start: 1;
    }
    .pager-title::before {
      content: 'Prev';
    }
  }
  &.next {
    grid-template-columns: 1fr 1.5rem;
    text-align: right;
    .pager-icon {
      grid-column-start: 2;
      grid-row-start: 1;
    }
    .pager-title::before {
      content: 'Next';
    }
  }

  .pager-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      fill: $base-color;
    }
  }

  .pager-title {
    color: $base-color;
    &::before {
      display: block;
      color: $tertiary-color;
      font-weight: bold;
    }
  }
}
</style>
