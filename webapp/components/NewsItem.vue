<template>
  <div class="news-item">
    <h2><span class="news-message">{{ newsItem.title }}</span> ({{ newsItem.votes }})</h2>
    <span>
      <button @click="upvote" v-if="loggedIn">upvote</button>
      <button @click="downvote" v-if="loggedIn">downvote</button>
      <button @click="remove" v-if="loggedIn && parseInt(newsItem.author.id) === currentUser" class="remove-button">remove</button>
    </span>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'NewsItem',
  props: ['newsItem'],
  data() {
    return {};
  },
  computed: {
    ...mapGetters('auth', ['loggedIn', 'currentUser'])
  },
  methods: {
    ...mapActions('post', ['upvotePost', 'downvotePost', 'deletePost']),
    upvote() {
      this.upvotePost({id: this.newsItem.id})
    },
    downvote() {
      this.downvotePost({id: this.newsItem.id})
    },
    remove() {
      this.deletePost({id: this.newsItem.id});
    }
  }
};
</script>

<style scoped>

</style>
