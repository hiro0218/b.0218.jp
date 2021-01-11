import { defineComponent } from '@nuxtjs/composition-api';
import { Fragment } from 'vue-fragment';

import ScrollButton from '~/components/ScrollButton';
import TheFooter from '~/components/TheFooter';
import TheHeader from '~/components/TheHeader';

export default defineComponent({
  render() {
    return (
      <Fragment>
        <TheHeader />
        <main class="l-main o-container">
          <nuxt />
        </main>
        <ScrollButton />
        <TheFooter />
      </Fragment>
    );
  },
});
