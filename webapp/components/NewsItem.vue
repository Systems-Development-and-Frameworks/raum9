<template>
  <div class="news-item">
    <h2><span class="news-message">{{ newsItem.title }}</span> ({{ newsItem.votes }})</h2>
    <span>
      <button @click="upvote" v-if="loggedIn">upvote</button>
      <button @click="downvote" v-if="loggedIn">downvote</button>
      <button @click="remove" v-if="loggedIn && newsItem.author === currentUser" class="remove-button">remove</button>
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
    ...mapActions('post', ['upvotePost', 'downvotePost']),
    upvote() {
      this.upvotePost({id: this.newsItem.id})
    },
    downvote() {
      this.downvotePost({id: this.newsItem.id})
    },
    remove() {
      this.$emit('news-remove', this.newsItem);
    }
  }
};
</script>

<style scoped>

</style>
