<template>
  <div>
    <button @click="switchSortOrder" id="switch-order-button">switch sort order</button>
  </div>
</template>

<script>
export default {
  name: 'NewsForm',
  methods: {
    switchSortOrder() {
      this.$emit('switch');
    }
  }
};
</script>

<style scoped>

</style>
