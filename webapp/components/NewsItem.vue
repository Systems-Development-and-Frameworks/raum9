<template>
  <div class="news-item">
    <h2><span class="news-message">{{ newsItem.title }}</span> ({{ newsItem.voteCount }})</h2>
    <span>
      <button @click="upvote" v-if="loggedIn">upvote</button>
      <button @click="downvote" v-if="loggedIn">downvote</button>
      <button @click="remove" v-if="loggedIn && newsItem.author === currentUser" class="remove-button">remove</button>
    </span>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

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
    upvote() {
      this.$emit('update', {
        newsItem: this.newsItem,
        voteChange: 1
      });
    },
    downvote() {
      this.$emit('update', {
        newsItem: this.newsItem,
        voteChange: -1
      });
    },
    remove() {
      this.$emit('news-remove', this.newsItem);
    }
  }
};
</script>

<style scoped>

</style>
