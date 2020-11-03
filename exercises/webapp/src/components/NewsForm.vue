<template>
  <div id="news-input">
    <label>
      <input v-model="news_input" placeholder="edit me">
    </label>
    <button @click="createNewsItem" id="create-button">create</button>
    <button @click="switchSortOrder" id="switch-order-button">switch sort order</button>
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
    switchSortOrder() {
      this.$emit("switch");
    }
  }
};
</script>

<style scoped>

</style>
