<template>
  <v-content>
    <CreateForm @resolve="onResolve" @reject="onReject"></CreateForm>
    
    <!--  -->
    <PointConfigurator
      v-if="formValid && sb_create_skeleton.id"
      :width="1000"
      :id="parseInt(sb_create_skeleton.id)"
      :urlFrontImage="imageFrontSrc"
      :urlBackImage="imageBackSrc"
      :related="'skeleton'"
    ></PointConfigurator>
  </v-content>
</template>

<script>
import CreateForm from "@/components/SkeletonBuilder/CreateForm.vue";
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
      weight: null,
      imageFront: null,
      imageBack: null
    };
  },
  destroyed() {
    this.$store.dispatch("sb_clear_all_data");
  },
  created() {},
  mounted() {},
  update(){
  },
  methods: {
    onResolve({ isValid, data }) {
      if (
        this.imageFront != data.imageFront ||
        this.imageBack != data.imageBack
      ) {
        this.imageFront = data.imageFront;
        this.imageBack = data.imageBack;
      }
      this.name = data.name;
      this.weight = data.weight;
      //
      this.formValid = isValid;
      this.saveSkeleton();
    },
    onReject({ isValid }) {
      this.formValid = isValid;
    },
    saveSkeleton() {
      if (this.sb_create_skeleton.id === undefined) {
        const data = {
          name: this.name,
          weight: this.weight,
          image_front: this.imageFront,
          image_back: this.imageBack
        };
        this.$store.dispatch("sb_create_skeleton", data);
      } else{
        
        const data = {
          id: parseInt(this.sb_create_skeleton.id),
          name: this.name,
          weight: this.weight
        };
        this.$store.dispatch("sb_update_skeleton", data);
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
    sb_create_skeleton() {
      return this.$store.getters.sb_create_skeleton;
    }
  }
};
</script>