<template>
  <div id="news-input">
    <label>
      <input v-model="news_input" placeholder="edit me">
    </label>
    <button @click="createNewsItem">create</button>
    <button @click="switchOrder" id="switch-order-button">Switch Order</button>
  </div>
</template>

<script>
export default {
  name: "NewsForm",
  data() {
    return {
      news_input: "",
    };
  },
  methods: {
    createNewsItem() {
      this.$emit("news-add", this.news_input);
      this.news_input = "";
    },
    switchOrder() {
      this.$emit("switch")
    }
  }
};
</script>

<style scoped>

</style>
