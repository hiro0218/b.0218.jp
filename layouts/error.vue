<template>
  <section>
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.message }}</p>
  </section>
</template>

<script>
export default {
  props: ['error'], // eslint-disable-line
};
</script>
