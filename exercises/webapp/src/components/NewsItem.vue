<template>
  <div class="news-item">
    <h2>{{ newsItem.title }} ({{ newsItem.voteCount }})</h2>
    <span>
      <button @click="upvote">upvote</button>
      <button @click="downvote">downvote</button>
      <button @click="remove" class="remove-button">remove</button>
    </span>
  </div>
</template>

<script>
export default {
  name: "NewsItem",
  props: ["newsItem"],
  data() {
    return {};
  },
  methods: {
    upvote() {
      this.$emit("update", {
        newsItem: this.newsItem,
        voteChange: 1
      });
    },
    downvote() {
      this.$emit("update", {
        newsItem: this.newsItem,
        voteChange: -1
      });
    },
    remove() {
      this.$emit("news-remove", this.newsItem);
    }
  }
};
</script>

<style scoped>

</style>
