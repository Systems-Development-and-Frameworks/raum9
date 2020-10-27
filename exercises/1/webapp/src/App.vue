<template>
  <div id="app">
    <HackerNews/>
  </div>
</template>

<script>
import HackerNews from './components/HackerNews'

export default {
  name: 'App',
  components: {
    HackerNews
  }
}
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
