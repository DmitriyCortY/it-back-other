<template>
  <v-content>
    <v-row align="end">
      <v-col>
        <label>
          <strong>Choose skelet and set name</strong>
        </label>
        <v-text-field
          v-model="name"
          :error-messages="nameErrors"
          required
          @input="$v.name.$touch()"
          @blur="$v.name.$touch()"
          label="Enter base name: *"
        ></v-text-field>
        <v-select
          :items="skeletons"
          v-model="selectedSkelet"
          :error-messages="selectedSkeletErrors"
          item-value="id"
          item-text="name"
          required
          :disabled="update"
          @input="$v.selectedSkelet.$touch()"
          @blur="$v.selectedSkelet.$touch()"
          label="Select skeleton *"
        ></v-select>
        <v-select
          :items="categorys"
          v-model="selectedCategory"
          :error-messages="selectedCategoryErrors"
          item-value="id"
          item-text="name"
          required
          @input="$v.selectedCategory.$touch()"
          @blur="$v.selectedCategory.$touch()"
          label="Select category *"
        ></v-select>
      </v-col>
      <v-col cols="6">
        <v-textarea v-model="description" label="Enter base description"></v-textarea>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6"></v-col>
      <v-col cols="6">
        <v-btn color="primary" block @click="save">Save</v-btn>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
export default {
  props: ["baseData", "update"],
  mixins: [validationMixin],
  validations: {
    name: { required },
    selectedSkelet: { required },
    selectedCategory: { required }
  },
  data() {
    return {
      name: this.baseData ? this.baseData.name : null,
      selectedSkelet: this.baseData ? this.baseData.skeleton_id : null,
      selectedCategory: this.baseData ? this.baseData.category : null,
      description: this.baseData ? this.baseData.description : null
    };
  },
  created() {
    this.$store.dispatch("load_all_categoryes");
    this.$store.dispatch("sb_load_all_skeletons");
  },
  mounted() {},
  methods: {
    save() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const data = {
          name: this.name,
          skeleton_id: this.selectedSkelet,
          category: this.selectedCategory,
          description: this.description
        };
        this.$emit("resolve", { isValid: !this.$v.$invalid, data: data });
      } else {
        this.$emit("reject", { isValid: !this.$v.$invalid });
      }
    }
  },
  computed: {
    skeletons() {
      let list = []
      if(this.$store.getters.sb_all_skeletons_data.data){
        list = this.$store.getters.sb_all_skeletons_data.data;
      }
      return list
    },
    categorys() {
      return this.$store.getters.all_categoryes;
    },
    
    // валидация форм
    //
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },
    selectedSkeletErrors() {
      const errors = [];
      if (!this.$v.selectedSkelet.$dirty) return errors;
      !this.$v.selectedSkelet.required && errors.push("Skelet is required.");
      return errors;
    },
    selectedCategoryErrors() {
      const errors = [];
      if (!this.$v.selectedCategory.$dirty) return errors;
      !this.$v.selectedCategory.required &&
        errors.push("Category is required.");
      return errors;
    }
  }
};
</script>