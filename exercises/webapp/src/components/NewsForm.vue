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
      this.$emit('news_add', this.news_input);
      this.news_input = '';
    }
  }
}
</script>

<style scoped>

</style>
