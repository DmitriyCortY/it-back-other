<template>
  <v-content>
    <v-row justify="end">
      <v-col cols="4">
        <v-btn block color="primary" :to="{ name: 'AdminKitBuilderCreate'}">
          <v-icon>mdi-plus-thick</v-icon>Create New Skeleton
        </v-btn>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="12">
        <v-simple-table>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in akb_all_kits" :key="index">
              <td>
                <router-link
                  :to="{ name: 'AdminKitBuilderUpdate', params: { id: item.id }}"
                >{{item.name}}</router-link>
              </td>
              <td align="right">
                <v-btn
                  text
                  icon
                  color="blue"
                  :to="{ name: 'AdminKitBuilderUpdate', params: { id: item.id }}"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>

                <v-btn 
                  text 
                  icon 
                  color="pink"
                  @click="delete_kit(item.id)"
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-content>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    created(){
      this.$store.dispatch('akb_load_all_kits')
    },
    methods: {
      delete_kit(id){
        this.$store.dispatch('akb_delete_kit_by_id', parseInt(id))
      }
    },
    computed:{
      akb_all_kits(){
        return this.$store.getters.akb_all_kits
      }
    }
}
</script>