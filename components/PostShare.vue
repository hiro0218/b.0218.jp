<template>
  <div class="sns-list">
    <a
      :href="'https://twitter.com/intent/tweet?url=' + postLink + '&text=' + encodeURIComponent(postTitle)"
      class="sns-item is-twitter"
      title="Share Twitter"
      target="_blank"
      rel="noopener"
      v-html="svgTwitter"
    />
    <a
      :href="'https://www.facebook.com/sharer/sharer.php?u=' + postLink"
      class="sns-item is-facebook"
      title="Share Facebook"
      target="_blank"
      rel="noopener"
      v-html="svgFacebook"
    />
    <a
      :href="'http://b.hatena.ne.jp/add?url=' + postLink"
      class="sns-item is-hatenabookmark"
      title="Share HatenaBookmark"
      target="_blank"
      rel="noopener"
      v-html="svgHatena"
    />
    <a
      :href="'https://lineit.line.me/share/ui?url=' + postLink"
      class="sns-item is-line"
      title="Share LINE"
      target="_blank"
      rel="noopener"
      v-html="svgLine"
    />
  </div>
</template>

<script type="ts">
import { defineComponent, computed } from '@vue/composition-api';

import svgLine from '~/assets/image/sns_line.svg?raw';
import svgHatena from '~/assets/image/sns_hatenabookmark.svg?raw';
import svgTwitter from '~/assets/image/sns_twitter.svg?raw';
import svgFacebook from '~/assets/image/sns_facebook.svg?raw';

export default defineComponent({
  name: 'PostShare',
  setup() {
    const postTitle = computed(() => document.title);
    const postLink = computed(() => location.href);

    return {
      postTitle,
      postLink,
      svgLine,
      svgHatena,
      svgTwitter,
      svgFacebook,
    };
  },
});
</script>

<style lang="scss">
.sns-list {
  display: flex;
  justify-content: center;
}

.sns-item {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;

  &.is-twitter {
    background: map-get($social-color, 'twitter');
  }
  &.is-facebook {
    background: map-get($social-color, 'facebook');
  }
  &.is-hatenabookmark {
    background: map-get($social-color, 'hatenabookmark');
  }
  &.is-line {
    background: map-get($social-color, 'line');
  }

  &:hover {
    opacity: 0.6;
  }

  & + & {
    margin-left: 1rem;
  }

  svg {
    width: inherit;
    height: inherit;
  }
}
</style>
