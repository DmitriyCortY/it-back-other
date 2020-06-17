<template>
  <v-content>
    <CreateForm @resolve="onResolve" @reject="onReject"></CreateForm>
    <!--  -->
    <PointConfigurator
      v-if="formValid && pb_create_part.data.id"
      :width="400"
      :id="parseInt(pb_create_part.data.id)"
      :urlFrontImage="imageFrontSrc"
      :urlBackImage="imageBackSrc"
      :related="'part'"
    ></PointConfigurator>
  </v-content>
</template>

<script>
import CreateForm from "@/components/PartBuilder/CreateForm.vue";
import PointConfigurator from "@/components/PointConfigurator/Index.vue";
export default {
  components: {
    CreateForm,
    PointConfigurator
  },
  data() {
    return {
      formValid: false,
      name: null,
      imageFront: null,
      imageBack: null
    };
  },
  destroyed() {
    this.$store.dispatch("pb_clear_all_data");
  },
  created() {},
  mounted() {},
  methods: {
    onResolve({ isValid, data }) {
      this.name = data.name;
      this.imageFront = data.imageFront;
      this.imageBack = data.imageBack;
      //
      this.formValid = isValid;
      this.savePart();
    },
    onReject({ isValid }) {
      this.formValid = isValid;
    },
    savePart() {
      if (this.pb_create_part.status === undefined) {
        const data = {
          name: this.name,
          image_front: this.imageFront,
          image_back: this.imageBack
        };
        this.$store.dispatch("pb_create_part", data);
      } else if (this.pb_create_part.status === "success"){
        const data = {
          id: parseInt(this.pb_create_part.data.id),
          name: this.name,
        };
        this.$store.dispatch("pb_update_part", data);
      }
    }
  },
  computed: {
    imageFrontSrc() {
      return URL.createObjectURL(this.imageFront);
    },
    imageBackSrc() {
      return URL.createObjectURL(this.imageBack);
    },
    pb_create_part() {
      return this.$store.getters.pb_create_part;
    }
  }
};
</script>