<template>
  <v-app style="max-width: 1170px; margin: auto;">
     <v-container>
      <router-view></router-view>
    </v-container>
    
    <notifications group="foo" />
  </v-app>
</template>

<script>
export default {
  components: {},
  data(){
    return { }
  },
  updated(){
  }
};
</script>
