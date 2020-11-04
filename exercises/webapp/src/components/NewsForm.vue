<template>
  <form @submit.prevent="createNewsItem" id="news-input">
    <label for="news-input-txt">Entry: </label>
    <input id="news-input-txt" name="news-input-txt" v-model="news_input" placeholder="edit me">
    <label for="create-button"></label>
    <input type="submit" value="create" name="create-button" id="create-button">
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
