<template>
  <div>
    <v-content>
      <v-row justify="end">
        <v-col cols="4">
          <v-btn block color="primary" :to="{ name: 'SkeletonBuilderCreate'}">
            <v-icon>mdi-plus-thick</v-icon>Create New Skeleton
          </v-btn>
        </v-col>
      </v-row>
    </v-content>

    <v-content>
      <v-simple-table>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in skeletsList.data" :key="index">
            <td>
              <router-link
                :to="{ name: 'SkeletonBuilderUpdate', params: { id: item.id }}"
              >{{item.name}}</router-link>
            </td>
            <td align="right">
              <v-btn
                text
                icon
                color="blue"
                :to="{ name: 'SkeletonBuilderUpdate', params: { id: item.id }}"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn text icon color="pink" @click="delete_skeleton(item.id)">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-content>

    <!-- <v-alert
      class="_b-alert"
      outlined
      type="success"
      v-if="skeletsList.status === 'success'"
      text
      dismissible
    >{{skeletsList.message}}</v-alert>

    <v-alert
      class="_b-alert"
      outlined
      type="error"
      v-if="skeletsList.status === 'error'"
      text
      dismissible
    >{{skeletsList.message}}</v-alert>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      alert: true
    };
  },
  created() {
    this.$store.dispatch("sb_load_all_skeletons");
  },
  methods: {
    delete_skeleton(id) {
      this.$store.dispatch("sb_delete_skeleton", parseInt(id));
    }
  },
  computed: {
    skeletsList() {
      return this.$store.getters.sb_all_skeletons_data;
    }
  }
};
</script>

<style lang="scss">
._b-alert {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  width: 1000px;
  max-width: 90%;
}
</style>