<template>
  <div>
    <nuxt-link to="/login" v-if="!loggedIn">Login</nuxt-link>
    <button @click="logout" id="logout" v-if="loggedIn">Logout</button>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "LoginForm",
  computed: {
    ...mapGetters('auth', ['loggedIn'])
  },
  methods: {
    ...mapActions('auth', ['logout'])
  }
};
</script>
