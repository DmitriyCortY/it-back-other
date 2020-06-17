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
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-card>
          <img class="b-preview-image" :src="imageFront" />
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <img class="b-preview-image" :src="imageBack" />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8"></v-col>
      <v-col cols="4">
        <v-btn color="primary" block @click="validForm">Save</v-btn>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  validations: {
    name: { required },
    imageFront: { required },
    imageBack: { required }
  },
  props: ["_name", "imageFront", "imageBack"],
  data() {
    return {
      name: this._name,
    };
  },
  created() {
  },
  updated() {
      this.name = this._name
  },
  methods: {
    validForm() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        // const data = {
        //   name: this.name,
        // };
        // this.$emit("resolve", { isValid: !this.$v.$invalid, data: data });
      } else {
        // this.$emit("reject", { isValid: !this.$v.$invalid });
      }
    }
  },
  computed: {
    // validations
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    }
  }
};
</script>

<style lang="scss" scope>
.b-preview-image {
  width: 100%;
  display: block;
  padding: 15px;
}
</style>