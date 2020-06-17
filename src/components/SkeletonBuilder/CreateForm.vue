<template>
  <v-content>
    <v-row>
      <v-col>
        <v-text-field
          v-model="name"
          :error-messages="nameErrors"
          required
          @input="$v.name.$touch()"
          @blur="$v.name.$touch()"
          label="Enter skeleton name: *"
        ></v-text-field>
      </v-col>
      <!--  -->
      <v-col>
        <v-text-field
          v-model="weight"
          :error-messages="weightErrors"
          required
          @input="$v.weight.$touch()"
          @blur="$v.weight.$touch()"
          type="number"
          label="Enter skeleton weight (gram): *"
        ></v-text-field>
      </v-col>
    </v-row>
    <!--  -->
    <v-row>
      <v-col>
        <v-file-input
          v-if="!imageSrc.front"
          v-model="imageFront"
          :error-messages="imageFrontErrors"
          required
          @input="$v.imageFront.$touch()"
          @blur="$v.imageFront.$touch()"
          label="Choose a PNG image front part"
        ></v-file-input>
      </v-col>
      <!--  -->
      <v-col>
        <v-file-input
          v-if="!imageSrc.back"
          v-model="imageBack"
          :error-messages="imageBackErrors"
          required
          @input="$v.imageBack.$touch()"
          @blur="$v.imageBack.$touch()"
          label="Choose a PNG image back part"
        ></v-file-input>
      </v-col>
    </v-row>

    <v-row v-if="imageSrc.front && imageSrc.back">
      <v-col cols="6">
        <v-img :src="imageSrc.front" max-width="100%"></v-img>
      </v-col>
      <!--  -->
      <v-col cols="6">
        <v-img :src="imageSrc.back" max-width="100%"></v-img>
      </v-col>
    </v-row>
    <!--  -->
    <!--  -->
    <v-row>
      <v-col cols="9"></v-col>
      <!--  -->
      <v-col cols="3">
        <v-btn block color="primary" @click="validForm">Next</v-btn>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, numeric } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  validations: {
    name: { required },
    weight: { required, numeric },
    imageFront: { required },
    imageBack: { required }
  },
  data() {
    return {
      name: null,
      weight: null,
      imageFront: null,
      imageBack: null,
      form: false,
      imageSrc: {
        front: null,
        back: null
      }
    };
  },
  methods: {
    validForm() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const data = {
          name: this.name,
          weight: this.weight,
          imageFront: this.imageFront,
          imageBack: this.imageBack
        };
        this.$emit("resolve", { isValid: !this.$v.$invalid, data: data });
        this.imageFrontSrc();
        this.imageBackSrc();
      } else {
        this.$emit("reject", { isValid: !this.$v.$invalid });
      }
    },
    imageFrontSrc() {
      this.imageSrc.front = URL.createObjectURL(this.imageFront);
    },
    imageBackSrc() {
      this.imageSrc.back = URL.createObjectURL(this.imageBack);
    }
  },
  computed: {
    // validations
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },
    weightErrors() {
      const errors = [];
      if (!this.$v.weight.$dirty) return errors;
      !this.$v.weight.numeric && errors.push("Accepts only numerics.");
      !this.$v.weight.required && errors.push("Weight is required.");
      return errors;
    },
    imageFrontErrors() {
      const errors = [];
      if (!this.$v.imageFront.$dirty) return errors;
      !this.$v.imageFront.required && errors.push("Image front is required.");
      return errors;
    },
    imageBackErrors() {
      const errors = [];
      if (!this.$v.imageBack.$dirty) return errors;
      !this.$v.imageBack.required && errors.push("Image back is required.");
      return errors;
    }
  }
};
</script>