<template>
  <v-app dark>
    <AppBar></AppBar>

    <v-img height="200" src="/banner.jpg">
      <h1 class="banner-text">
          Lorem Ipsum
      </h1>
    </v-img>

    <v-main>
      <v-container>
        <nuxt/>
      </v-container>
    </v-main>

    <v-footer
      :absolute="!fixed"
      app
    >
      <div class="d-flex flex-column mb-6">
        <v-btn
          v-for="item in footer_buttons"
          :to="item.to"
          flat
        >{{ item.title }}
        </v-btn>
        &copy; {{ new Date().getFullYear() }}
      </div>
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
      footer_buttons: [
        {
          title: "Imprint",
          to: "/"
        },
        {
          title: "Data Privacy",
          to: "/"
        }
      ]
    }
  }
}
</script>

<style>
.banner-text {
  position: absolute;
  top: 50%;
  left: 10%
}
</style>
