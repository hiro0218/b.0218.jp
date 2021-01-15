import { defineComponent } from '@nuxtjs/composition-api';

import { ADSENSE } from '~~/constant';

export default defineComponent({
  name: 'PostAds',
  setup() {
    return {};
  },
  render() {
    return (
      <div class="c-adsense post-ads">
        <ins
          class="adsbygoogle"
          style="display: block; text-align: center;"
          data-ad-layout={ADSENSE.LAYOUT}
          data-ad-format={ADSENSE.FORMAT}
          data-ad-client={ADSENSE.CLIENT}
          data-ad-slot={ADSENSE.SLOT}
        />
      </div>
    );
  },
});
