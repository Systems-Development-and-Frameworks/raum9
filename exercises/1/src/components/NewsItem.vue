<template>
  <div class="news-item">
    <h3>{{ newsItem.title }} ({{ newsItem.voteCount }})</h3>
    <span>
      <button @click="upvote">upvote</button>
      <button @click="downvote">downvote</button>
      <button @click="remove">remove</button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'NewsItem',
  props: ['newsItem'],
  data() {
    return {}
  },
  methods: {
    upvote() {
      this.newsItem.voteCount += 1;
    },
    downvote() {
      this.newsItem.voteCount -= 1;
    },
    remove() {
      this.$emit('news_remove', this.newsItem);
    }
  }
}
</script>

<style scoped>

</style>
