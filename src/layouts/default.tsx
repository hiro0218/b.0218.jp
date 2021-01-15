import { defineComponent } from '@nuxtjs/composition-api';

import TheFooter from '~/components/TheFooter';
import TheHeader from '~/components/TheHeader';

export default defineComponent({
  render() {
    return (
      <div>
        <TheHeader />
        <main class="l-main o-container">
          <nuxt />
        </main>
        <TheFooter />
      </div>
    );
  },
});
