<template>
  <div class="sns-list">
    <a
      :href="'https://twitter.com/intent/tweet?url=' + post_link + '&text=' + encodeURIComponent(post_title)"
      class="sns-item is-twitter"
      title="Share Twitter"
      target="_blank"
      rel="noopener"
      v-html="svgTwitter"
    >
      <svgTwitter />
    </a>
    <a
      :href="'https://www.facebook.com/sharer/sharer.php?u=' + post_link"
      class="sns-item is-facebook"
      title="Share Facebook"
      target="_blank"
      rel="noopener"
      v-html="svgFacebook"
    />
    <a
      :href="'http://b.hatena.ne.jp/add?url=' + post_link"
      class="sns-item is-hatenabookmark"
      title="Share HatenaBookmark"
      target="_blank"
      rel="noopener"
      v-html="svgHatena"
    />
    <a
      :href="'https://lineit.line.me/share/ui?url=' + post_link"
      class="sns-item is-line"
      title="Share LINE"
      target="_blank"
      rel="noopener"
      v-html="svgLine"
    />
  </div>
</template>

<script>
import svgLine from '~/assets/image/sns_line.svg?raw';
import svgHatena from '~/assets/image/sns_hatenabookmark.svg?raw';
import svgTwitter from '~/assets/image/sns_twitter.svg?raw';
import svgFacebook from '~/assets/image/sns_facebook.svg?raw';

export default {
  name: 'PostShare',
  data() {
    return {
      svgLine,
      svgHatena,
      svgTwitter,
      svgFacebook,
    };
  },
  computed: {
    post_title: () => document.title,
    post_link: () => location.href,
  },
};
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
