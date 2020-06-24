import { defineComponent, computed } from '@vue/composition-api';

import svgLine from '~/assets/image/sns_line.svg?raw';
import svgHatena from '~/assets/image/sns_hatenabookmark.svg?raw';
import svgTwitter from '~/assets/image/sns_twitter.svg?raw';
import svgFacebook from '~/assets/image/sns_facebook.svg?raw';

export default defineComponent({
  name: 'PostShare',
  props: {
    postTitle: {
      type: String,
      required: true,
    },
  },
  setup() {
    const postLink = computed(() => location.href);

    return {
      postLink,
      svgLine,
      svgHatena,
      svgTwitter,
      svgFacebook,
    };
  },
  render() {
    return (
      <div class="c-sns-list">
        <a
          href={'https://twitter.com/intent/tweet?url=' + this.postLink + '&text=' + encodeURIComponent(this.postTitle)}
          domPropsInnerHTML={svgTwitter}
          class="c-sns-list__item--twitter"
          title="Share Twitter"
          target="_blank"
          rel="noopener"
        />
        <a
          href={'https://www.facebook.com/sharer/sharer.php?u=' + this.postLink}
          domPropsInnerHTML={svgFacebook}
          class="c-sns-list__item--facebook"
          title="Share Facebook"
          target="_blank"
          rel="noopener"
        />
        <a
          href={'http://b.hatena.ne.jp/add?url=' + this.postLink}
          domPropsInnerHTML={svgHatena}
          class="c-sns-list__item--hatenabookmark"
          title="Share HatenaBookmark"
          target="_blank"
          rel="noopener"
        />
        <a
          href={'https://lineit.line.me/share/ui?url=' + this.postLink}
          domPropsInnerHTML={svgLine}
          class="c-sns-list__item--line"
          title="Share LINE"
          target="_blank"
          rel="noopener"
        />
      </div>
    );
  },
});
