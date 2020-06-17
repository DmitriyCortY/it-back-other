<template>
  <v-content v-if="skeletonData.data">
    <UpdateForm
      @resolve="onResolve"
      v-if="parseInt(skeletonData.data[0].id) === parseInt($route.params.id)"
      :_imageFront="skeletonData.data[0].image_front"
      :_imageBack="skeletonData.data[0].image_back"
      :_name="skeletonData.data[0].name"
      :_weight="skeletonData.data[0].weight"
    ></UpdateForm>

    <!--  -->
    <PointConfigurator
      :width="1000"
      :id="$route.params.id"
      :urlFrontImage="skeletonData.data[0].image_front"
      :urlBackImage="skeletonData.data[0].image_back"
      :related="'skeleton'"
    ></PointConfigurator>
  </v-content>
</template>

<script>
import UpdateForm from "@/components/SkeletonBuilder/UpdateForm.vue";
import PointConfigurator from "@/components/PointConfigurator/Index.vue";

export default {
  components: {
    UpdateForm,
    PointConfigurator
  },
  data() {
    return {};
  },
  created() {
    this.$store.dispatch(
      "sb_load_skeleton_data_by_id",
      parseInt(this.$route.params.id)
    );
  },
  destroyed() {
    this.$store.dispatch("sb_clear_all_data");
  },
  mounted() {},
  methods: {
    onResolve(data) {
      this.name = data.name;
      this.weight = data.weight;
      //
      this.saveSkeleton();
    },
    saveSkeleton() {
      const data = {
        id: parseInt(this.skeletonData.data[0].id),
        name: this.name,
        weight: this.weight
      };
      this.$store.dispatch("sb_update_skeleton", data);
    }
  },
  computed: {
    skeletonData() {
      return this.$store.getters.sb_skeleton_data_by_id;
    }
  }
};
</script>