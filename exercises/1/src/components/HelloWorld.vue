<template>
  <div class="hello">
    <h1>News List</h1>
    <ul id="example-1">
      <li v-for="item in items">
        {{ item }}
      </li>
    </ul>
    <div id="news-input">
      <input v-model="newnews" placeholder="edit me">
      <button v-on:click="createNewsItem">create</button>
    </div>
  </div>
</template>

<script>
import NewsItem from './NewsItem.vue';
export default {
  name: 'HelloWorld',
  components: { NewsItem },
  data () {
    return {
      newnews: '',
      items: [
      ]
    }
  },
  methods: {
    createNewsItem: function (event) {
      var instance = new NewsItem(msg = this.newnews);
      this.items.push(instance);
      // `this` inside methods point to the Vue instance
      //alert('Hello ')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
