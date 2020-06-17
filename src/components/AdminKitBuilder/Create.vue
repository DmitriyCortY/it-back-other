<template>
  <v-content>
    <ChooseSkelet 
      @resolve="onResolve" 
      :update="false" 
      @reject="onReject"
    ></ChooseSkelet>

    <v-divider></v-divider>

    <ChooseProduct 
      v-if="akb_load_kit_relation_all_loaded && formValid" 
      :side="side" 
      :akb_load_kit_relation="akb_load_kit_relation"
      @data_transfer="on_data_transfer"
    ></ChooseProduct>

    <v-divider></v-divider>
  
    <v-row v-if="akb_load_kit_relation_all_loaded && formValid">
      <v-col cols="6">
        <v-btn color="blue" style="color:#fff;" block @click="flip_side">Flip side</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn color="primary" style="color:#fff;" block @click="save_data">Save data</v-btn>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
import ChooseSkelet from "@/components/AdminKitBuilder/help/ChooseSkelet.vue";
import ChooseProduct from "@/components/AdminKitBuilder/help/ChooseProduct.vue";
export default {
  components: {
    ChooseSkelet,
    ChooseProduct
  },
  data() {
    return {
      formValid: false,
      list_selected_attach: {
        front: [],
        back: []
      },
      side: 'front'
    };
  },
  destroyed() {
    this.$store.dispatch('akb_drop_all_data')
  },
  methods: {
    // Обработка коректного ответа
    onResolve({ isValid, data }) {
      this.formValid = isValid;
      
      // Загружаем данныех всех связей со скелетом
      this.$store.dispatch('akb_load_kit_relation', parseInt(data.skeleton_id))

      // Создаем базу
      if(this.akb_create_kit.id === undefined){
        this.$store.dispatch('akb_create_kit', data)
      }else {
        this.$store.dispatch('akb_update_kit', {id:this.akb_create_kit.id, ...data})
      }
    },
    //  Обработка ошибачного ответа
    onReject({ isValid }) {
      this.formValid = isValid;
    },
    // переворот сторон
    flip_side(){
      if(this.side === 'front'){
        this.side = 'back'
      }else if (this.side === 'back'){
        this.side = 'front'
      }else {
        console.error('Has error in side')
      }
      
    },
    // Прием данных
    on_data_transfer(data){
      this.$set(this.list_selected_attach, 'front', data.front)
      this.$set(this.list_selected_attach, 'back', data.back)
    },
    save_data(){
      let saved_data = []
      for(let i = 0; i < this.list_selected_attach.front.length; i++){
        saved_data.push(
          {
            product_id: parseInt(this.list_selected_attach.front[i].product_id),
            product_point_id: parseInt(this.list_selected_attach.front[i].product_point_id),
            parent_skeleton_point_id: this.list_selected_attach.front[i].parent_skeleton_point_id ? parseInt(this.list_selected_attach.front[i].parent_skeleton_point_id) : undefined,
            parent_product_point_id: this.list_selected_attach.front[i].parent_product_point_id ? parseInt(this.list_selected_attach.front[i].parent_product_point_id) : undefined,
            kit_id: parseInt(this.akb_create_kit.id)
          }
        )
      }
      for(let j = 0; j < this.list_selected_attach.back.length; j++){
        saved_data.push(
          {
            product_id: parseInt(this.list_selected_attach.back[j].product_id),
            product_point_id: parseInt(this.list_selected_attach.back[j].product_point_id),
            parent_skeleton_point_id: this.list_selected_attach.back[j].parent_skeleton_point_id ? parseInt(this.list_selected_attach.back[j].parent_skeleton_point_id) : undefined,
            parent_product_point_id: this.list_selected_attach.back[j].parent_product_point_id ? parseInt(this.list_selected_attach.back[j].parent_product_point_id) : undefined,
            kit_id: parseInt(this.akb_create_kit.id)
          }
        )
      }
      this.$store.dispatch('akb_save_kit_products', saved_data)
    }
  },
  computed: {
    // получаем данные с сервера после создания кита
    akb_create_kit(){
      return this.$store.getters.akb_create_kit
    },
    // загружаем все связи кита
    akb_load_kit_relation(){
      return this.$store.getters.akb_load_kit_relation
    },
    // статус загрузки связей кита
    akb_load_kit_relation_all_loaded(){
      return this.$store.getters.akb_load_kit_relation_all_loaded
    },
  }
};
</script>