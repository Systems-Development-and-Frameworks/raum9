<template>
  <div>
    <v-card
      :class="$vuetify.breakpoint.mdAndDown ? 'd-flex flex-column' : 'd-flex flex-row justify-space-around flex-wrap'"
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'"
      flat
      tile
    >
      <v-card
        v-for="n in 4"
        :key="n"
        :class="$vuetify.breakpoint.mdAndDown ? 'py-4 my-4 flex-grow-1' : 'py-4 my-4 flex-grow-1 content-item'"
        outlined
        tile
      >
        <div
          :class="$vuetify.breakpoint.mdAndDown ? 'd-flex flex-row align-center' : 'd-flex flex-column align-center'"
        >
          <v-img width="100" src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img>
          <div>
            <v-card-title>Title {{ n }}</v-card-title>
            <v-card-text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
              ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et
              ea gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </v-card-text>
          </div>
        </div>
      </v-card>
    </v-card>
  </div>
</template>

<script>
export default {}
</script>

<style>
.content-item {
  flex-basis: 33%;
  max-width: 33%;
}
</style>
