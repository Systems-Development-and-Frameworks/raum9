<template>
  <div class="hacker-news">
    <h1>News List</h1>
    <div v-for="item in sortedItems" :key="item.id">
      <NewsItem v-bind:news-item="item" v-on:news-remove="onNewsRemove" v-on:update="onVoteChange"/>
    </div>
    <NewsForm v-on:news-add="onNewsAdd"></NewsForm>
  </div>
</template>

<script>
import NewsItem from "./NewsItem.vue";
import NewsForm from "./NewsForm.vue";

export default {
  name: "HackerNews",
  components: {NewsItem, NewsForm},
  data() {
    return {
      items: [{
        id: 0,
        title: "Start Message",
        voteCount: 0,
      }],
      id: 1
    };
  },
  computed: {
    sortedItems() {
      return [...this.items].sort((o1, o2) => o2.voteCount - o1.voteCount);
    }
  },
  methods: {
    onNewsAdd(newsTitle) {
      let newsItem = {
        id: this.id++,
        title: newsTitle,
        voteCount: 0
      };
      this.items.push(newsItem);
    },
    onNewsRemove(newsItem) {
      this.items = this.items.filter((element) => element.id !== newsItem.id);
    },
    onVoteChange(args) {
      let item = this.items.find((element) => element.id === args.newsItem.id);
      item.voteCount += args.voteChange;
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
