<template>
  <v-content>
    <ChooseSkelet 
      v-if="Object.keys(akb_load_kit_by_id).length > 0"
      @resolve="onResolve" 
      :update="true" 
      @reject="onReject"
      :baseData="akb_load_kit_by_id"
    ></ChooseSkelet>

    <ChooseProduct 
      v-if="akb_load_kit_relation_all_loaded && formValid && akb_load_kit_products_loaded" 
      :side="side" 
      :akb_load_kit_relation="akb_load_kit_relation"
      :selected_products="selected_products"
      @data_transfer="on_data_transfer"
    ></ChooseProduct>

    <v-divider></v-divider>
  
    <v-row v-if="akb_load_kit_relation_all_loaded && formValid && akb_load_kit_products_loaded">
      <v-col cols="6">
        <v-btn color="blue" style="color:#fff;" block @click="flip_side">Flip side</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn color="primary" style="color:#fff;" block @click="save_data">Save data</v-btn>
      </v-col>
    </v-row>

    <v-row  v-if="akb_load_kit_relation_all_loaded && formValid && akb_load_kit_products_loaded">
      <v-col cols="12">
        <v-simple-table >
          <tbody>
            <tr>
              <td align="left" style="font-size: 18px;">
                <strong>Total price: </strong>
                <span>
                  {{total_price + '$'}}
                </span>
              </td>
              <td align="left" style="font-size: 18px;">
                <strong>Total weight: </strong>
                <span>
                  {{total_weight + 'g'}}
                </span>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
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
      formValid: true,
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
  created(){
    // Загружаем данные кита
    this.$store.dispatch('akb_load_kit_by_id', parseInt(this.$route.params.id))
    // Загружаем данныех всех связей со скелетом
      
    
    let interval1 = setInterval(() => {
      if(this.akb_load_kit_by_id.id){
        this.$store.dispatch('akb_load_kit_products', parseInt(this.akb_load_kit_by_id.id))
        clearInterval(interval1)
      }
    }, 100);

    let interval2 = setInterval(() => {
      if(this.akb_load_kit_by_id.skeleton_id){
        this.$store.dispatch('akb_load_kit_relation', parseInt(this.akb_load_kit_by_id.skeleton_id))
        clearInterval(interval2)
      }
    }, 100);
  },
  methods: {
    // Обработка коректного ответа
    onResolve({ isValid, data }) {
      this.formValid = isValid;
      
      

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
            kit_id: parseInt(this.$route.params.id)
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
            kit_id: parseInt(this.$route.params.id)
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
    akb_load_kit_by_id(){
        return this.$store.getters.akb_load_kit_by_id
    },
    akb_load_kit_products(){
      return this.$store.getters.akb_load_kit_products
    },
    akb_load_kit_products_loaded(){
      return this.$store.getters.akb_load_kit_products_loaded
    },
    selected_products(){
      let list = {
        front: [],
        back: [],
      }
      if(this.akb_load_kit_products_loaded && this.akb_load_kit_relation_all_loaded){
        for(let i=0;i<this.akb_load_kit_products.length;i++){
          if( this.akb_load_kit_relation.products_points_data.filter( item=>parseInt(item.id)===parseInt(this.akb_load_kit_products[i].product_point_id) )[0].side === 'front'){
            list.front.push(this.akb_load_kit_products[i])
          }else if(this.akb_load_kit_relation.products_points_data.filter( item=>parseInt(item.id)===parseInt(this.akb_load_kit_products[i].product_point_id) )[0].side === 'back'){
            list.back.push(this.akb_load_kit_products[i])
          }
        }
      }
      
      return list
    },
    selected_products_ids(){
      let list = []
      if(this.akb_load_kit_relation_all_loaded){
        this.list_selected_attach.front.forEach(item=>list.push(parseInt(item.product_id)))
        this.list_selected_attach.back.forEach(item=>list.push(parseInt(item.product_id)))
      }
      return Array.from(new Set(list))
    },
    total_price(){
      let price = 0
      if(this.akb_load_kit_relation_all_loaded){
        this.akb_load_kit_relation.products_data.forEach(item => {
          if(this.selected_products_ids.includes(parseInt(item.id))){
            price += parseInt(item.price)
          }
        })
      }
      return price
    },
    total_weight(){
      let skeleton_weight = parseInt(this.akb_load_kit_relation.skeleton_data.weight)
      let weight = skeleton_weight
      // 
      if(this.akb_load_kit_relation_all_loaded){
        this.akb_load_kit_relation.products_data.forEach(item => {
          if(this.selected_products_ids.includes(parseInt(item.id))){
            weight += parseInt(item.weight)
          }
        })
      }
      return weight
    }
  }
};
</script>