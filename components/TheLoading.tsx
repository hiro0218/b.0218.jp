import { defineComponent, ref, onMounted } from '@vue/composition-api';

export default defineComponent({
  name: 'Loading',
  setup(_, { root }) {
    const loading = ref(true);

    onMounted(() => {
      root.$nextTick(() => {
        loading.value = false;
      });
    });

    function start() {
      loading.value = true;
    }

    function finish() {
      loading.value = false;
    }

    return {
      loading,
      start,
      finish,
    };
  },
  render() {
    return <div v-show={this.loading} class="c-loading is-active" />;
  },
});
