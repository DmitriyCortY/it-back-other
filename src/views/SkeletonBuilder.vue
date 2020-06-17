<template>
  <v-content>
    <v-container>
        <router-link to="/">Back to main</router-link>
    </v-container>
    <!--  -->
    <v-container>
        <router-view></router-view>
    </v-container>
  </v-content>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  }
};
</script>