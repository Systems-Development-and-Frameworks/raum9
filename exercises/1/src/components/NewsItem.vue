<template>
  <div class="news-item">
    <h3>{{ newsItem.title }} ({{ newsItem.vote_count }})</h3>
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
      this.newsItem.vote_count += 1;
      this.$emit('update');
    },
    downvote() {
      this.newsItem.vote_count -= 1;
      this.$emit('update');
    },
    remove() {
      this.$emit('news_remove', this.newsItem);
    }
  }
}
</script>

<style scoped>

</style>
