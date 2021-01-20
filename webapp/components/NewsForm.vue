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
import {MUTATE_WRITE, QUERY_POSTS} from "~/graphql/mutations";

export default {
  name: 'NewsForm',
  data() {
    return {
      news_input: '',
    };C
  },
  methods: {
    async createNewsItem() {
      await this.$apollo.mutate({
        mutation: MUTATE_WRITE,
        variables: {
          title: this.news_input
        },
        update: (store, {data: {write}}) => {
          const data = store.readQuery({query: QUERY_POSTS});
          data.posts.push(write);
          store.writeQuery({query: QUERY_POSTS, data});
        }
      });
      this.news_input = '';
    },
  }
};
</script>

<style scoped>

</style>
