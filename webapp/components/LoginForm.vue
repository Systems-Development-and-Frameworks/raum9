<template>
  <div>
    <form id="login-form" @submit.prevent="loginAction">
      <div>
        <input id="username" name="username" v-model="username" type="text" aria-label="Username">
      </div>
      <div>
        <input id="password" name="password" v-model="password" type="password" aria-label="Password">
      </div>
      <div>
        <input type="submit" value="Login" name="login" id="login" aria-label="Login">
      </div>
    </form>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "LoginForm",
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    ...mapActions('auth', ['login']),
    loginAction() {
      this.login({email: this.username, password: this.password});
    }
  }
};
</script>

<style>
</style>
