<template>
  <div class="sns-list">
    <a
      :href="'https://twitter.com/intent/tweet?url='+ post_link + '&text='+ encodeURIComponent(post_title)"
      class="sns-item"
      title="Share Twitter"
      target="_blank"
    >
      <svgTwitter/>
    </a>
    <a
      :href="'https://www.facebook.com/sharer/sharer.php?u=' + post_link"
      class="sns-item"
      title="Share Facebook"
      target="_blank"
    >
      <svgFacebook/>
    </a>
    <a
      :href="'http://b.hatena.ne.jp/add?url=' + post_link"
      class="sns-item"
      title="Share HatenaBookmark"
      target="_blank"
    >
      <svgHatena/>
    </a>
    <a
      :href="'https://lineit.line.me/share/ui?url=' + post_link"
      class="sns-item"
      title="Share LINE"
      target="_blank"
    >
      <svgLine/>
    </a>
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
.sns-list {
  display: inline-flex;
  position: absolute;
  right: 0;
  bottom: 0;
  @include mobile {
    position: static;
    display: flex;
    justify-content: flex-end;
    margin: 0.5rem 0;
  }
  // @include mobile {
  //   position: fixed;
  //   bottom: 1rem;
  //   padding-right: 5vw;
  //   padding-left: 5vw;
  //   z-index: 10;
  // }
}
.sns-item {
  width: 2rem;
  height: 2rem;

  &:hover {
    opacity: 0.6;
  }
  & + & {
    margin-left: 0.5rem;
  }
  svg {
    width: inherit;
    height: inherit;
  }

  // @include mobile {
  //   width: 2.5rem;
  //   height: 2.5rem;

  //   & + & {
  //     margin-left: 1rem;
  //   }
  //   svg {
  //     width: inherit;
  //     height: inherit;
  //   }
  // }
}
</style>
