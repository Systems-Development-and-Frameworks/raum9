<template>
  <div class="news-item">
    <h3>{{ msg }} ({{ votecount }})</h3>
    <span>
      <button v-on:click="upvote">upvote</button>
      <button v-on:click="downvote">downvote</button>
      <button v-on:click="remove">remove</button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'NewsItem',
  props: [ 'msg' ],
  data () {
    return {
      msg: "",
      votecount: 0
    }
  },
  methods: {
    upvote: function (event) {
      // `this` inside methods point to the Vue instance
      this.votecount += 1;
    },
    downvote: function (event) {
      // `this` inside methods point to the Vue instance
      this.votecount -= 1;
    },
    remove: function (event) {
      // `this` inside methods point to the Vue instance
      alert('test')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
