import { defineComponent } from '@nuxtjs/composition-api';

import CONSTANT from '~~/constant';

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
          data-ad-layout={CONSTANT.ADSENSE.LAYOUT}
          data-ad-format={CONSTANT.ADSENSE.FORMAT}
          data-ad-client={CONSTANT.ADSENSE.CLIENT}
          data-ad-slot={CONSTANT.ADSENSE.SLOT}
        />
      </div>
    );
  },
});
