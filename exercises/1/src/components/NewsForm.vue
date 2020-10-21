<template>
  <div id="news-input">
    <label>
      <input v-model="news_input" placeholder="edit me">
    </label>
    <button @click="createNewsItem">create</button>
  </div>
</template>

<script>
export default {
  name: 'NewsForm',
  data() {
    return {
      news_input: '',
    }
  },
  methods: {
    createNewsItem() {
      this.$emit('news_add', {
        title: this.news_input,
        vote_count: 0
      });
      this.news_input = '';
    }
  }
}
</script>

<style scoped>

</style>
