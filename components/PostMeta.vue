<template functional>
  <div class="post-meta">
    <div class="c-post-meta">
      <font-awesome-icon icon="clock" class="c-post-meta__icon" />
      <div class="c-post-meta__item--date">
        <time :datetime="props.date" itemprop="datePublished">{{ props.date | formatDateString }}</time>
      </div>
      <div
        v-if="!(new Date(props.date).toDateString() === new Date(props.updated).toDateString())"
        class="c-post-meta__item--date"
      >
        <time :datetime="props.updated" itemprop="dateModified">{{ props.updated | formatDateString }}</time>
      </div>
    </div>
    <div v-if="props.postCategory.length !== 0" class="c-post-meta">
      <font-awesome-icon icon="folder" class="c-post-meta__icon" />
      <template v-for="(category, index) in props.postCategory">
        <div :key="index" class="c-post-meta__item--separator">
          <nuxt-link :to="'/' + category.path" class="c-post-meta__link">{{ category.name }}</nuxt-link>
        </div>
      </template>
    </div>
    <div v-if="props.postTag.length !== 0" class="c-post-meta">
      <font-awesome-icon icon="tag" class="c-post-meta__icon" />
      <template v-for="(tag, index) in props.postTag">
        <div :key="index" class="c-post-meta__item--separator">
          <nuxt-link :to="'/' + tag.path" class="c-post-meta__link">{{ tag.name }}</nuxt-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'PostMeta',
  props: {
    date: {
      type: String,
      required: false,
      default: '',
    },
    updated: {
      type: String,
      required: false,
      default: '',
    },
    postCategory: {
      type: Array,
      required: false,
      default: () => [],
    },
    postTag: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
});
</script>
