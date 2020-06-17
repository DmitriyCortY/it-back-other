<template>
  <v-content>
    <v-row justify="end">
      <v-col cols="4">
        <v-btn block color="primary" :to="{ name: 'BaseBuilderCreate'}">
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
            <tr v-for="(item, index) in skeletsList" :key="index">
              <td>
                <router-link
                  :to="{ name: 'BaseBuilderUpdate', params: { id: item.id }}"
                >{{item.name}}</router-link>
              </td>
              <td align="right">
                <v-btn
                  text
                  icon
                  color="blue"
                  :to="{ name: 'BaseBuilderUpdate', params: { id: item.id }}"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>

                <v-btn text icon color="pink" @click="delete_base(item.id)">
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
  data() {
    return {};
  },
  created() {
    this.$store.dispatch("bb_load_all_bases");
  },
  methods: {
    delete_base(id){
      this.$store.dispatch('bb_delete_base', parseInt(id))
    }
  },
  computed: {
    skeletsList() {
      return this.$store.getters.bb_all_bases;
    }
  }
};
</script>