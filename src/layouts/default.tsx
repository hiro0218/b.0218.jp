import { defineComponent } from '@nuxtjs/composition-api';

import ScrollButton from '~/components/ScrollButton';
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
        <ScrollButton />
        <TheFooter />
      </div>
    );
  },
});
