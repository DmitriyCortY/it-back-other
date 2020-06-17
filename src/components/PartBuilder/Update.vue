<template>
  <v-content v-if="partData.data">
    <UpdateForm
      :_name="partData.data[0].name"
      :imageFront="partData.data[0].image_front"
      :imageBack="partData.data[0].image_back"
    ></UpdateForm>
    <!--  -->
    <PointConfigurator
      :width="400"
      :id="$route.params.id"
      :urlFrontImage="partData.data[0].image_front"
      :urlBackImage="partData.data[0].image_back"
      :related="'part'"
    ></PointConfigurator>
  </v-content>
</template>

<script>
import PointConfigurator from "@/components/PointConfigurator/Index.vue";
import UpdateForm from "@/components/PartBuilder/UpdateForm.vue";
export default {
  components: {
    PointConfigurator,
    UpdateForm
  },
  data() {
    return {};
  },
  destroyed() {
    this.$store.dispatch("pb_clear_all_data");
  },
  created() {
    this.$store.dispatch("pb_load_part_data_by_id", this.$route.params.id);
  },
  methods: {
    // onResolve({ isValid, data }) {
    //   this.name = data.name;
    //   this.category = data.category;
    //   //
    //   this.formValid = isValid;
    //   this.savePart();
    // },
    // onReject({ isValid }) {
    //   this.formValid = isValid;
    // }
  },
  computed: {
    partData() {
      return this.$store.getters.pb_part_data_by_id;
    }
  }
};
</script>