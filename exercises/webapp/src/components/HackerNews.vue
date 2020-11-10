<template>
  <div class="hacker-news">
    <h1>News List</h1>
    <div v-if="sortedItems.length">
      <div v-for="item in sortedItems" :key="item.id">
        <NewsItem v-bind:news-item="item" v-on:news-remove="onNewsRemove" v-on:update="onVoteChange"/>
      </div>
    </div>
    <div v-else id="news-placeholder">
      The list is empty :(
    </div>
    <NewsForm v-on:news-add="onNewsAdd" v-on:switch="onSwitch"></NewsForm>
  </div>
</template>

<script>
import NewsItem from './NewsItem.vue';
import NewsForm from './NewsForm.vue';

export default {
  name: 'HackerNews',
  components: {NewsItem, NewsForm},
  props: ['initialNews'],
  data() {
    return {
      ascending: false,
      items: [...this.initialNews],
      id: 1
    };
  },
  computed: {
    sortedItems() {
      let sortedArray;
      if (this.ascending) {
        sortedArray = [...this.items].sort((o2, o1) => o2.voteCount - o1.voteCount);
      } else {
        sortedArray = [...this.items].sort((o1, o2) => o2.voteCount - o1.voteCount);
      }
      return sortedArray;
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
