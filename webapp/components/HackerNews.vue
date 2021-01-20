<template>
  <div class="hacker-news">
    <h1>News List</h1>
    <div v-if="sortedItems.length">
      <div v-for="item in sortedItems" :key="item.id">
        <NewsItem :news-item="item" @news-remove="onNewsRemove"/>
      </div>
    </div>
    <div v-else id="news-placeholder">
      The list is empty :(
    </div>
    <NewsForm v-if="loggedIn"></NewsForm>
    <NewsOrder @switch="onSwitch"></NewsOrder>
  </div>
</template>

<script>
import NewsItem from './NewsItem.vue';
import NewsForm from './NewsForm.vue';
import NewsOrder from './NewsOrder.vue';
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'HackerNews',
  components: {NewsItem, NewsForm, NewsOrder},
  props: {
    initialNews: {type: Array, required: false}
  },
  data() {
    return {
      ascending: false,
    };
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
    ...mapGetters('post', ['getPosts']),
    sortedItems() {
      let sortedArray;
      if (this.ascending) {
        sortedArray = [...this.getPosts].sort((o2, o1) => o2.voteCount - o1.voteCount);
      } else {
        sortedArray = [...this.getPosts].sort((o1, o2) => o2.voteCount - o1.voteCount);
      }
      return sortedArray;
    },
  },
  async beforeMount() {
    await this.fetchPosts();
  },
  methods: {
    ...mapActions('post', ['fetchPosts']),
    onNewsRemove(newsItem) {
      this.items = this.items.filter(element => element.id !== newsItem.id);
    },
    onSwitch() {
      this.ascending = !this.ascending;
    }
  }
};
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
