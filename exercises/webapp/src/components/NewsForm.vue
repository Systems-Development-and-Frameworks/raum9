<template>
  <form @submit.prevent="createNewsItem" id="news-input">
    <input v-model="news_input" placeholder="edit me">
    <input type="submit" value="create" name="createbtn" id="create-button">
    <button @click="switchSortOrder" id="switch-order-button">switch sort order</button>
  </form>
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
