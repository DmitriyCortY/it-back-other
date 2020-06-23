<template>
  <v-app style="max-width: 1170px; margin: auto; margin-top: 25px;">
     <v-container>
      <router-view></router-view>
    </v-container>
    
    <notifications group="foo" style="top: 50px;"/>
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
