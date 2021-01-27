<template>
  <div>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-toolbar-title v-text="title"/>
      <v-spacer/>

      <div v-if="!$vuetify.breakpoint.mdAndDown">
        <v-btn
          v-for="item in items"
          :key="item.icon"
          :to="item.to"
          flat
        >{{ item.title }}
        </v-btn>
      </div>

      <v-btn
        icon
        @click.stop="showDrawer = !showDrawer"
        v-if="$vuetify.breakpoint.mdAndDown"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="showDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item v-for="item in items">
          <v-btn
            :key="item.icon"
            :to="item.to"
            flat
          >{{ item.title }}
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Start',
          to: '/'
        },
        {
          icon: 'mdi-apps',
          title: 'Service',
          to: '/'
        },
        {
          icon: 'mdi-apps',
          title: 'About',
          to: '/'
        },
        {
          icon: 'mdi-apps',
          title: 'Contact',
          to: '/'
        }
      ],
      right: true,
      showDrawer: false,
      title: 'Vuetify.js'
    }
  }
}
</script>
