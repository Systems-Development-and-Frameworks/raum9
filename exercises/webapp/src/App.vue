<template>
  <div id="app">
    <HackerNews :initial-news="news"/>
  </div>
</template>

<script>
import HackerNews from "./components/HackerNews";

export default {
  name: "App",
  data() {
    return {
      news: [{
        id: 0,
        title: "Start Message",
        voteCount: 0,
      }]
    };
  },
  components: {
    HackerNews
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
