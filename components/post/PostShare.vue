<template>
  <div class="post-share">
    <div class="sns-list">
      <a
        :href="'https://twitter.com/intent/tweet?url=' + post_link + '&text=' + encodeURIComponent(post_title)"
        class="sns-item is-twitter"
        title="Share Twitter"
        target="_blank"
        rel="noopener"
      >
        <svgTwitter />
      </a>
      <a
        :href="'https://www.facebook.com/sharer/sharer.php?u=' + post_link"
        class="sns-item is-facebook"
        title="Share Facebook"
        target="_blank"
        rel="noopener"
      >
        <svgFacebook />
      </a>
      <a
        :href="'http://b.hatena.ne.jp/add?url=' + post_link"
        class="sns-item is-hatenabookmark"
        title="Share HatenaBookmark"
        target="_blank"
        rel="noopener"
      >
        <svgHatena />
      </a>
      <a
        :href="'https://lineit.line.me/share/ui?url=' + post_link"
        class="sns-item is-line"
        title="Share LINE"
        target="_blank"
        rel="noopener"
      >
        <svgLine />
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import svgLine from '~/assets/image/sns_line.svg?inline';
import svgHatena from '~/assets/image/sns_hatenabookmark.svg?inline';
import svgTwitter from '~/assets/image/sns_twitter.svg?inline';
import svgFacebook from '~/assets/image/sns_facebook.svg?inline';

export default {
  name: 'PostShare',
  components: {
    svgLine,
    svgHatena,
    svgTwitter,
    svgFacebook,
  },
  computed: {
    ...mapState('post', {
      post_title: state => state.data.title.rendered,
      post_link: state => {
        return `${process.env.SITE_URL}${state.data.slug}`;
      },
    }),
  },
};
</script>

<style lang="scss">
.post-share {
  margin: 3rem 0;
  text-align: center;
}

.sns-list {
  display: flex;
  justify-content: center;
}

.sns-item {
  width: 2rem;
  height: 2rem;
  fill: $tertiary-color;

  &.is-twitter {
    fill: map-get($social-color, 'twitter');
  }
  &.is-facebook {
    fill: map-get($social-color, 'facebook');
  }
  &.is-hatenabookmark {
    fill: map-get($social-color, 'hatenabookmark');
  }
  &.is-line {
    fill: map-get($social-color, 'line');
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
