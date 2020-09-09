import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ScrollTop',
  setup() {
    function scrollTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    return {
      scrollTop,
    };
  },
  render() {
    return (
      <button aria-label="scrollButton" class="c-scroll-button" onClick={() => this.scrollTop()}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    );
  },
});
