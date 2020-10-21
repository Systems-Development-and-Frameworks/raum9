<template>
  <div class="hacker-news">
    <h1>News List</h1>
    <div v-for="item in items" :key="item.title">
      <NewsItem v-bind:news-item="item" v-on:news_remove="onNewsRemove" v-on:update="onNewsVote"/>
    </div>
    <NewsForm v-on:news_add="onNewsAdd"></NewsForm>
  </div>
</template>

<script>
import NewsItem from './NewsItem.vue';
import NewsForm from './NewsForm.vue';

export default {
  name: 'HackerNews',
  components: {NewsItem, NewsForm},
  data() {
    return {
      items: [{
        title: "Start Message",
        vote_count: 0
      }]
    }
  },
  methods: {
    onNewsAdd(newsItem) {
      this.items.push(newsItem);
    },
    onNewsRemove(newsItem) {
      let index = this.items.findIndex((element) => element.title === newsItem.title);
      if (index > -1) {
        this.items.splice(index, 1);
      }
    },
    onNewsVote() {
      this.items.sort((o1, o2) => o2.vote_count - o1.vote_count)
    }
  }
}
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
