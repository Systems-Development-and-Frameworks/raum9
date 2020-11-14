<template>
  <div>
    <form @submit.prevent="createNewsItem" id="news-input">
      <input id="news-input-txt" name="news-input-txt" v-model="news_input" placeholder="edit me"
             aria-label="News Message">
      <input type="submit" value="create" name="create-button" id="create-button" aria-label="Create">
    </form>
    <button @click="switchSortOrder" id="switch-order-button">switch sort order</button>
  </div>
</template>

<script>
export default {
  name: 'NewsForm',
  data() {
    return {
      news_input: '',
    };
  },
  methods: {
    createNewsItem() {
      this.$emit('news-add', this.news_input);
      this.news_input = '';
    },
    switchSortOrder() {
      this.$emit('switch');
    }
  }
};
</script>

<style scoped>

</style>
