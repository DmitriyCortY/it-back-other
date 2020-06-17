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
      <v-col cols="6">
        <v-img :src="_imageFront" max-width="100%"></v-img>
      </v-col>
      <!--  -->
      <v-col cols="6">
        <v-img :src="_imageBack" max-width="100%"></v-img>
      </v-col>
    </v-row>
    <!--  -->
    <v-row>
      <v-col cols="9"></v-col>
      <!--  -->
      <v-col cols="3">
        <v-btn block color="primary" @click="validForm">update</v-btn>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
// import Vue from 'vue'
import { validationMixin } from "vuelidate";
import { required, numeric } from "vuelidate/lib/validators";
export default {
  props: ["_name", "_weight", "_imageFront", "_imageBack"],
  mixins: [validationMixin],
  validations: {
    name: { required },
    weight: { required, numeric }
  },
  data() {
    return {
      name: this._name,
      weight: this._weight,
      form: false
    };
  },
  methods: {
    validForm() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const data = {
          name: this.name,
          weight: this.weight
        };

        this.$emit("resolve", data);
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
    },
    weightErrors() {
      const errors = [];
      if (!this.$v.weight.$dirty) return errors;
      !this.$v.weight.numeric && errors.push("Accepts only numerics.");
      !this.$v.weight.required && errors.push("Weight is required.");
      return errors;
    }
  }
};
</script>