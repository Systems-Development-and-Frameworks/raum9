<template>
  <nuxt-link to="/login" v-if="!loggedIn">Login({{ loggedIn }})</nuxt-link>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "LoginForm",
  computed: {
    ...mapGetters('auth', ['loggedIn'])
  }
};
</script>
