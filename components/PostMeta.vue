<template>
  <div class="post-meta">
    <div class="c-post-meta">
      <div class="c-post-meta__item--date">
        <div class="c-post-meta__icon" v-html="$icon.clock.toSVG()" />
        <time :datetime="date" itemprop="datePublished">{{ stringPublishDate }}</time>
      </div>
      <div v-if="!isModified" class="c-post-meta__item--date">
        <time :datetime="updated" itemprop="dateModified">{{ stringModifiyDate }}</time>
      </div>
    </div>
    <div v-if="postCategory.length !== 0" class="c-post-meta">
      <div class="c-post-meta__icon" v-html="$icon.archive.toSVG()" />
      <template v-for="(category, index) in postCategory">
        <div :key="index" class="c-post-meta__item--separator">
          <nuxt-link :to="'/' + category.path" class="c-post-meta__link">{{ category.name }}</nuxt-link>
        </div>
      </template>
    </div>
    <div v-if="postTag.length !== 0" class="c-post-meta">
      <div class="c-post-meta__icon" v-html="$icon.tag.toSVG()" />
      <template v-for="(tag, index) in postTag">
        <div :key="index" class="c-post-meta__item--separator">
          <nuxt-link :to="'/' + tag.path" class="c-post-meta__link">{{ tag.name }}</nuxt-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import { convertDateToSimpleFormat, isSameDate } from '~/assets/script/utils/date.ts';

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
  setup({ date, updated }) {
    const stringPublishDate = computed(() => {
      return convertDateToSimpleFormat(date);
    });
    const stringModifiyDate = computed(() => {
      return convertDateToSimpleFormat(updated);
    });
    const isModified = computed(() => {
      return isSameDate(date, updated);
    });

    return {
      stringPublishDate,
      stringModifiyDate,
      isModified,
    };
  },
});
</script>
