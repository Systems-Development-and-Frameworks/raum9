<template>
  <div>
    <form id="news-input" @submit.prevent="createNewsItem">
      <input id="news-input-txt" name="news-input-txt" v-model="news_input" placeholder="edit me"
             aria-label="News Message">
      <input type="submit" value="create" name="create-button" id="create-button" aria-label="Create">
    </form>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: 'NewsForm',
  data() {
    return {
      news_input: '',
    };
  },
  methods: {
    ...mapActions('post', ['write']),
    async createNewsItem() {
      await this.write({title: this.news_input});
      this.news_input = '';
    },
  }
};
</script>

<style scoped>

</style>
