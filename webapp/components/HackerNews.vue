<template>
  <div class="hacker-news">
    <Menu></Menu>
    <h1>News List</h1>
    <div v-if="sortedItems.length">
      <div v-for="item in sortedItems" :key="item.id">
        <NewsItem :news-item="item" @news-remove="onNewsRemove" @update="onVoteChange"/>
      </div>
    </div>
    <div v-else id="news-placeholder">
      The list is empty :(
    </div>
    <NewsForm @news-add="onNewsAdd" @switch="onSwitch"></NewsForm>
  </div>
</template>

<script>
import NewsItem from './NewsItem.vue';
import NewsForm from './NewsForm.vue';
import Menu from './Menu.vue';

export default {
  name: 'HackerNews',
  components: {NewsItem, NewsForm, Menu},
  props: {
    initialNews: {type: Array, required: false}
  },
  data() {
    return {
      ascending: false,
      items: [...this.initialNews ?? []],
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
    },
    nextId() {
      return Math.max(...this.items.map(item => item.id), 0) + 1;
    }
  },
  methods: {
    onNewsAdd(newsTitle) {
      const newsItem = {
        id: this.nextId,
        title: newsTitle,
        voteCount: 0
      };
      this.items.push(newsItem);
    },
    onNewsRemove(newsItem) {
      this.items = this.items.filter(element => element.id !== newsItem.id);
    },
    onVoteChange(args) {
      const item = this.items.find(element => element.id === args.newsItem.id);
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
