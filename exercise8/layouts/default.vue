<template>
  <v-app dark>
    <AppBar></AppBar>

    <v-main>
      <v-container>
        <nuxt/>
      </v-container>
    </v-main>

    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import AppBar from "~/components/AppBar";

export default {
  components: {AppBar},
  data() {
    return {
      fixed: false,
    }
  }
}
</script>
