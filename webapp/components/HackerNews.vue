<template>
  <div class="hacker-news">
    <h1>News List</h1>
    <div v-if="sortedItems.length">
      <div v-for="item in sortedItems" :key="item.id">
        <NewsItem :news-item="item"/>
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
import {QUERY_POSTS} from '@/graphql/mutations';

export default {
  name: 'HackerNews',
  components: {NewsItem, NewsForm, NewsOrder},
  props: {
    initialNews: {type: Array, required: false}
  },
  data() {
    return {
      ascending: false,
      posts: [...this.initialNews ?? []]
    };
  },
  apollo: {
    posts: QUERY_POSTS
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
    sortedItems() {
      let sortedArray;
      if (this.ascending) {
        sortedArray = [...this.posts].sort((o2, o1) => o2.votes - o1.votes);
      } else {
        sortedArray = [...this.posts].sort((o1, o2) => o2.votes - o1.votes);
      }
      return sortedArray;
    },
  },
  methods: {
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
