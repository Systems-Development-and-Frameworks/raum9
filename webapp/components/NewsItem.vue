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
import {MUTATE_DELETE, MUTATE_DOWNVOTE, MUTATE_UPVOTE, MUTATE_WRITE, QUERY_POSTS} from "~/graphql/mutations";

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
    async upvote() {
      await this.$apollo.mutate({
        mutation: MUTATE_UPVOTE,
        variables: {
          id: this.newsItem.id
        }
      });
    },
    async downvote() {
      await this.$apollo.mutate({
        mutation: MUTATE_DOWNVOTE,
        variables: {
          id: this.newsItem.id
        }
      });
    },
    async remove() {
      await this.$apollo.mutate({
        mutation: MUTATE_DELETE,
        variables: {
          id: this.newsItem.id
        },
        update: (store, {data}) => {
          const dataCache = store.readQuery({query: QUERY_POSTS});
          dataCache.posts = dataCache.posts.filter(post => post.id !== data.delete.id);
          store.writeQuery({query: QUERY_POSTS, data: dataCache});
        }
      });
    }
  }
};
</script>

<style scoped>

</style>
