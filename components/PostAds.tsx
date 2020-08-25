import { defineComponent, computed } from '@vue/composition-api';
import CONSTANT from '~/constant';

export default defineComponent({
  name: 'PostAds',
  setup() {
    const { ADSENSE } = CONSTANT;
    const layout = computed(() => ADSENSE.LAYOUT);
    const format = computed(() => ADSENSE.FORMAT);
    const client = computed(() => ADSENSE.CLIENT);
    const slot = computed(() => ADSENSE.SLOT);

    return {
      layout,
      format,
      client,
      slot,
    };
  },
  render() {
    return (
      <div class="c-adsense post-ads">
        <ins
          class="adsbygoogle"
          style="display: block; text-align: center;"
          data-ad-layout={this.layout}
          data-ad-format={this.format}
          data-ad-client={this.client}
          data-ad-slot={this.slot}
        />
      </div>
    );
  },
});
