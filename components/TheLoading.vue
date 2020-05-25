<template>
  <div v-show="loading" class="c-loading is-active" />
</template>

<script type="ts">
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
    }
  },
});
</script>
