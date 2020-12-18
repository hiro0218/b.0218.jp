import { defineComponent } from '@nuxtjs/composition-api';

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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );
  },
});
