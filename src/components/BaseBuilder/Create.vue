<template>
  <v-content>
    <ChooseSkelet @resolve="onResolve" :update="false" @reject="onReject" :bb_base_relations="bb_base_relations"></ChooseSkelet>

    <v-divider></v-divider>
    <br>
    <div v-if="formValid">
      <Conf
        v-if="bb_load_base_relations_status"
        :skeleton_data="bb_base_relations.skeleton_data"
        :attachments="list_selected_attach"
        :config="bb_base_relations"
        :side="side"
      ></Conf>

      <v-row v-if="merge_classes.length > 0">
        <v-col cols="12" md="3" sm="6" v-for="(item, index) in merge_classes" :key="'c-up'+index">
          <v-card class="pa-2" @click="select_category(item)">
            {{item.name}}
          </v-card>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="4" v-for="(item, index) in suitable_attachment" :key="'up' + index">
          <v-card class="pa-2">
            <v-row align="center" justify="center">
              <v-col cols="8">
                <h5 style="text-transform: uppercase">{{get_part_name_img(item).name}}</h5>
              </v-col>
              <v-col cols="4">
                <img :src="get_part_name_img(item).img" style="max-width: 80px;max-height: 80px; display: block; margin: auto;"> 
              </v-col>
                <v-btn color="primary" text style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" v-if="!detect_selected_attach(item)" @click="validation_selected_item(item)">
                  <v-icon>
                    mdi-plus-circle-outline
                  </v-icon>
                </v-btn>
                <v-btn color="red" text style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" v-if="detect_selected_attach(item)" @click="delete_of_the_selected_list(item)">
                  <v-icon>
                    mdi-minus-circle-outline
                  </v-icon>
                </v-btn>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      
      <v-row justify="end">
        <v-col cols="6">
          <v-btn block color="primary" @click="flip_side">Flip side</v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn block color="primary" @click="save_base_builder_data">Save Base Builder Data</v-btn>
        </v-col>
      </v-row>
      
      <v-dialog v-model="select_skeleton_point_dialog" persistent width="560">
        <v-card>
          <v-card-title class="grey lighten-2" primary-title>Need select a point on the skeleton</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-select 
                  :items="list_for_select_skeleton_point" 
                  item-text="skeleton_point_name" 
                  item-value="skeleton_point_id"
                  v-model="selected_point"
                  :error-messages="selected_point_error"
                  required
                  @input="$v.selected_point.$touch()"
                  @blur="$v.selected_point.$touch()"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-btn color="danger" block @click="cancel_form_skeleton">Cancel</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn color="primary" block @click="form_valid_skeleton">Select</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="select_parent_part_point_dialog" persistent width="560">
        <v-card>
          <v-card-title class="grey lighten-2" primary-title>Need select a point on the skeleton</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-select 
                  :items="list_for_select_skeleton_point" 
                  item-text="parent_part_point_name" 
                  item-value="parent_part_point_id"
                  v-model="selected_point"
                  :error-messages="selected_point_error"
                  required
                  @input="$v.selected_point.$touch()"
                  @blur="$v.selected_point.$touch()"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-btn color="danger" block @click="cancel_form_parent_part">Cancel</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn color="primary" block @click="form_valid_parent_part">Select</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="select_parent_part_or_skeleton" persistent width="560">
        <v-card>
          <v-card-title class="grey lighten-2" primary-title>Need to choose where to wear</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col  cols="12">
                <v-select
                  :items="[{name: 'Skeleton', value: 'skeleton'}, {name: 'Part', value: 'part'}]"
                  item-text="name" 
                  item-value="value"
                  v-model="part_or_skeleton"
                  :error-messages="part_or_skeleton_error"
                  required
                  @input="$v.part_or_skeleton.$touch()"
                  @blur="$v.part_or_skeleton.$touch()"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-btn color="danger" block @click="cancel_form_part_or_skeleton">Cancel</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn color="primary" block @click="form_valid_part_or_skeleton">Select</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </v-content>
</template>

<script>
import ChooseSkelet from "@/components/BaseBuilder/help/ChooseSkelet.vue";

import Conf from "@/components/OutputConf.vue";
import { required } from "vuelidate/lib/validators";
export default {
  validations: {
    selected_point: { required },
    part_or_skeleton: { required },
  },
  components: {
    ChooseSkelet,
    Conf
  },
  data() {
    return {
      formValid: false,
      suitable_attachment: [],
      list_selected_attach: {
        front: [],
        back: []
      },
      select_parent_part_point_dialog: false,
      select_skeleton_point_dialog: false,
      list_for_select_skeleton_point: [],
      selected_point_data: null,
      selected_point: null,
      side: 'front',
      select_parent_part_or_skeleton: false,
      part_or_skeleton: null,
      intermediate_attach_data: null
    };
  },
  created(){},
  destroyed() {
    this.$store.dispatch("bb_clear_all_data");
  },

  methods: {
    // Обработка коректного ответа
    onResolve({ isValid, data }) {
      this.formValid = isValid;
      // Загружаем данныех всех связей со скелетом
      this.$store.dispatch('bb_load_base_relations', parseInt(data.skeleton_id))

      // Создаем базу
      if(this.bb_base_by_id.id === undefined){
        this.$store.dispatch('bb_create_base', data)
      }else {
        this.$store.dispatch('bb_update_base', {id:this.bb_base_by_id.id, data})
      }
    },
    //  Обработка ошибачного ответа
    onReject({ isValid }) {
      this.formValid = isValid;
    },
    // переворот сторон
    flip_side(){
      this.suitable_attachment = []
      if(this.side === 'front'){
        this.side = 'back'
      }else if (this.side === 'back'){
        this.side = 'front'
      }else {
        console.error('Has error in side')
      }
      
    },
    // подготовка данных после выбора категории
    select_category(item){
      let suitable_skeleton_points_list = this.bb_base_relations.skeletons_points.filter(elem => (elem.class.includes(item.id) && elem.side === this.side && elem.type === 'Plus'))
      let suitable_parts_points_list = this.bb_base_relations.list_parts_points.filter(elem => (elem.class.includes(item.id) && elem.side === this.side && elem.type === 'Plus'))
      
      
      // if(item.parent === 'skeleton'){
      if(suitable_skeleton_points_list.length > 0 && suitable_parts_points_list.length === 0){
        // список подходящих точек скелета
        let list_ids_suitable_skeleton_points = []
        for(let i = 0; i < this.bb_base_relations.list_skeleton_point_id_and_their_classes_ids.length; i++){
          if(
            parseInt(this.bb_base_relations.list_skeleton_point_id_and_their_classes_ids[i].class_id) === parseInt(item.id) &&
            this.bb_base_relations.skeletons_points.filter(elem => parseInt(elem.id) === parseInt(this.bb_base_relations.list_skeleton_point_id_and_their_classes_ids[i].point_id))[0].side === this.side
          ){
            list_ids_suitable_skeleton_points.push(this.bb_base_relations.list_skeleton_point_id_and_their_classes_ids[i])
          }
        }

        if(list_ids_suitable_skeleton_points.length === 0) return
        
        // список данных для обвесов
        let list = []
        for(let i = 0; i < this.bb_base_relations.list_parts_points.length; i++){
          if(this.bb_base_relations.list_parts_points[i].class.includes(item.id) && this.bb_base_relations.list_parts_points[i].type === 'Minus' && this.bb_base_relations.list_parts_points[i].side === this.side){
            for(let j = 0; j < this.bb_base_relations.all_parts_data.length; j++){
              if(parseInt(this.bb_base_relations.all_parts_data[j].id) === parseInt(this.bb_base_relations.list_parts_points[i].part_id)){
                list.push({
                  part_id: parseInt(this.bb_base_relations.all_parts_data[j].id),
                  part_point_id: parseInt(this.bb_base_relations.list_parts_points[i].id),
                  skeleton_suitable_points: list_ids_suitable_skeleton_points
                })
              }
            }
          }
        }
        
        this.suitable_attachment = list
      // }else if(item.parent === 'part'){
      }else if(suitable_skeleton_points_list.length === 0 && suitable_parts_points_list.length > 0){
        // список подходящих точек обвесов
        let list_ids_suitable_parent_part_points = []
        for(let i = 0; i < this.bb_base_relations.list_parent_part_point_id_and_their_classes_ids.length; i++){
          if(
            parseInt(this.bb_base_relations.list_parent_part_point_id_and_their_classes_ids[i].class_id) === parseInt(item.id) &&
            this.bb_base_relations.list_parts_points.filter(elem => parseInt(elem.id) === parseInt(this.bb_base_relations.list_parent_part_point_id_and_their_classes_ids[i].point_id))[0].side === this.side
          ){
            list_ids_suitable_parent_part_points.push(this.bb_base_relations.list_parent_part_point_id_and_their_classes_ids[i])
          }
        }

        if(list_ids_suitable_parent_part_points.length === 0) return

        // список данных для обвесов
        let list = []
        for(let i = 0; i < this.bb_base_relations.list_parts_points.length; i++){
          if(this.bb_base_relations.list_parts_points[i].class.includes(item.id) && this.bb_base_relations.list_parts_points[i].type === "Minus" && this.bb_base_relations.list_parts_points[i].side === this.side){
            for(let j = 0; j < this.bb_base_relations.all_parts_data.length; j++){
              if(parseInt(this.bb_base_relations.all_parts_data[j].id) === parseInt(this.bb_base_relations.list_parts_points[i].part_id)){
                list.push({
                  part_id: parseInt(this.bb_base_relations.all_parts_data[j].id),
                  part_point_id: parseInt(this.bb_base_relations.list_parts_points[i].id),
                  parent_part_suitable_points: list_ids_suitable_parent_part_points
                })
              }
            }
          }
        }

        this.suitable_attachment = list
      }else{
        // список подходящих точек скелета
        let list_ids_suitable_skeleton_points = []
        for(let i = 0; i < this.bb_base_relations.list_skeleton_point_id_and_their_classes_ids.length; i++){
          if(
            parseInt(this.bb_base_relations.list_skeleton_point_id_and_their_classes_ids[i].class_id) === parseInt(item.id) &&
            this.bb_base_relations.skeletons_points.filter(elem => parseInt(elem.id) === parseInt(this.bb_base_relations.list_skeleton_point_id_and_their_classes_ids[i].point_id))[0].side === this.side
          ){
            list_ids_suitable_skeleton_points.push(this.bb_base_relations.list_skeleton_point_id_and_their_classes_ids[i])
          }
        }

        if(list_ids_suitable_skeleton_points.length === 0) return

        // список подходящих точек обвесов
        let list_ids_suitable_parent_part_points = []
        for(let i = 0; i < this.bb_base_relations.list_parent_part_point_id_and_their_classes_ids.length; i++){
          if(
            parseInt(this.bb_base_relations.list_parent_part_point_id_and_their_classes_ids[i].class_id) === parseInt(item.id) &&
            this.bb_base_relations.list_parts_points.filter(elem => parseInt(elem.id) === parseInt(this.bb_base_relations.list_parent_part_point_id_and_their_classes_ids[i].point_id))[0].side === this.side
          ){
            list_ids_suitable_parent_part_points.push(this.bb_base_relations.list_parent_part_point_id_and_their_classes_ids[i])
          }
        }

        if(list_ids_suitable_parent_part_points.length === 0) return

        // список данных для обвесов
        let list = []
        for(let i = 0; i < this.bb_base_relations.list_parts_points.length; i++){
          if(this.bb_base_relations.list_parts_points[i].class.includes(item.id) && this.bb_base_relations.list_parts_points[i].type === "Minus" && this.bb_base_relations.list_parts_points[i].side === this.side){
            for(let j = 0; j < this.bb_base_relations.all_parts_data.length; j++){
              if(parseInt(this.bb_base_relations.all_parts_data[j].id) === parseInt(this.bb_base_relations.list_parts_points[i].part_id)){
                list.push({
                  part_id: parseInt(this.bb_base_relations.all_parts_data[j].id),
                  part_point_id: parseInt(this.bb_base_relations.list_parts_points[i].id),
                  parent_part_suitable_points: list_ids_suitable_parent_part_points,
                  skeleton_suitable_points: list_ids_suitable_skeleton_points
                })
              }
            }
          }
        }
        
        this.suitable_attachment = list
      }
    },
    // получаем данные для вывода имени и изображения элемента выбора обвеса
    get_part_name_img(item){
      if(item.skeleton_suitable_points){
        let answ = {
          name: this.bb_base_relations.all_parts_data.filter(elem => parseInt(elem.id) === parseInt(item.part_id))[0].name,
          img: this.bb_base_relations.all_parts_data.filter(elem => parseInt(elem.id) === parseInt(item.part_id))[0].image_front,
          part_id: parseInt(item.part_id),
          part_point_id: parseInt(item.part_point_id),
          skeleton_suitable_points: item.skeleton_suitable_points
        }
        return answ
      }else if(item.parent_part_suitable_points){
        let answ = {
          name: this.bb_base_relations.all_parts_data.filter(elem => parseInt(elem.id) === parseInt(item.part_id))[0].name,
          img: this.bb_base_relations.all_parts_data.filter(elem => parseInt(elem.id) === parseInt(item.part_id))[0].image_front,
          part_id: parseInt(item.part_id),
          part_point_id: parseInt(item.part_point_id),
          part_suitable_points: item.part_suitable_points
        }
        return answ
      }
    },
    // валидчия выбора обвеса
    validation_selected_item(item){
      this.intermediate_attach_data = null
      if(item.skeleton_suitable_points && !item.parent_part_suitable_points){
        if(item.skeleton_suitable_points.length <= 1){
          this.push_to_selected_list({
            part_id: parseInt(item.part_id),
            part_point_id: parseInt(item.part_point_id),
            skeleton_point_id: parseInt(item.skeleton_suitable_points[0].point_id)
          })
        }else{
          this.select_skeleton_point_dialog = true
          this.list_for_select_skeleton_point = []
          this.selected_point_data = {
            part_id: parseInt(item.part_id),
            part_point_id: parseInt(item.part_point_id)
          }
            
          for(let i = 0; i < item.skeleton_suitable_points.length; i++){
            this.list_for_select_skeleton_point.push(
              {
                skeleton_point_id: item.skeleton_suitable_points[i].point_id,
                skeleton_point_name: this.bb_base_relations.skeletons_points.filter(elem => elem.id === item.skeleton_suitable_points[i].point_id)[0].name
              }
            )
          }
        }
      }else if(item.parent_part_suitable_points && !item.skeleton_suitable_points){
        if(item.parent_part_suitable_points.length <= 1){
          this.install_parent_attach(parseInt(item.parent_part_suitable_points[0].point_id))
          this.push_to_selected_list({
            part_id: parseInt(item.part_id),
            part_point_id: parseInt(item.part_point_id),
            parent_part_point_id: parseInt(item.parent_part_suitable_points[0].point_id)
          })
        }else{
          this.select_parent_part_point_dialog = true
          this.list_for_select_skeleton_point = []
          this.selected_point_data = {
            part_id: parseInt(item.part_id),
            part_point_id: parseInt(item.part_point_id)
          }
          
          for(let i = 0; i < item.parent_part_suitable_points.length; i++){
            this.list_for_select_skeleton_point.push(
              {
                parent_part_point_id: item.parent_part_suitable_points[i].point_id,
                parent_part_point_name: this.bb_base_relations.list_parts_points.filter(elem => elem.id === item.parent_part_suitable_points[i].point_id)[0].name
              }
            )
          }
        }
      }else if(item.parent_part_suitable_points && item.skeleton_suitable_points){
        this.select_parent_part_or_skeleton = true
        this.intermediate_attach_data = item
      }else{
        console.error('Error validation!!!')
      }
    },
    // добавление  элемента массива выбраных обвессов
    push_to_selected_list(item){
      for(let i = 0; i < this.list_selected_attach[this.side].length; i++){
        if(item.skeleton_point_id){
          if(this.list_selected_attach[this.side][i].skeleton_point_id === item.skeleton_point_id){
            this.delete_of_the_selected_list(this.list_selected_attach[this.side][i])
          }
        }
      }
      this.list_selected_attach[this.side].push(item)

      // Добавляем свЯзаные обвесы на другую
      this.install_related_attachment()
      
    },
    //  удаление элемента массива выбраных обвессов
    delete_of_the_selected_list(item){
      // Добавляем свЯзаные обвесы на другую
      this.install_related_attachment()
      
      if(this.side === 'front'){
        if((this.bb_base_relations.list_parts_points.filter(elem => (parseInt(elem.part_id) === parseInt(this.bb_base_relations.list_parts_points.filter(elem => parseInt(elem.id) === parseInt(item.part_point_id))[0].part_id) && elem.type === "Plus"))).length > 0){
          let children_id = this.bb_base_relations.list_parts_points.filter(elem => (parseInt(elem.part_id) === parseInt(this.bb_base_relations.list_parts_points.filter(elem => parseInt(elem.id) === parseInt(item.part_point_id))[0].part_id) && elem.type === "Plus" && elem.side === 'front'))[0].id

          for(let i = 0; i < this.list_selected_attach['front'].length; i++){
            if(
              parseInt(this.list_selected_attach['front'][i].parent_part_point_id) === parseInt(children_id)
            ){
              for(let j = 0; j < this.list_selected_attach['back'].length; j++){
                if(
                  parseInt(this.list_selected_attach['back'][j].part_point_id) === parseInt(this.bb_base_relations.list_parts_points.filter(item => parseInt(item.related_id) === parseInt(this.list_selected_attach['front'][i].part_point_id))[0].id)
                ){
                  this.list_selected_attach['back'].splice(j, 1)
                }
              }
              this.list_selected_attach['front'].splice(i, 1)
            }
          }
        }
        for(let i = 0; i < this.list_selected_attach['front'].length; i++){
          if(
            parseInt(this.list_selected_attach['front'][i].part_id) === parseInt(item.part_id) &&
            parseInt(this.list_selected_attach['front'][i].part_point_id) === parseInt(item.part_point_id)
          ){
            for(let j = 0; j < this.list_selected_attach['back'].length; j++){
              if(
                parseInt(this.list_selected_attach['back'][j].part_point_id) === parseInt(this.bb_base_relations.list_parts_points.filter(item => parseInt(item.related_id) === parseInt(this.list_selected_attach['front'][i].part_point_id))[0].id)
              ){
                this.list_selected_attach['back'].splice(j, 1)
              }
            }
            this.list_selected_attach['front'].splice(i, 1)
          }
        }
      }else if(this.side === 'back'){
        if((this.bb_base_relations.list_parts_points.filter(elem => (parseInt(elem.part_id) === parseInt(this.bb_base_relations.list_parts_points.filter(elem => parseInt(elem.id) === parseInt(item.part_point_id))[0].part_id) && elem.type === "Plus"))).length > 0){
          let children_id = this.bb_base_relations.list_parts_points.filter(elem => (parseInt(elem.part_id) === parseInt(this.bb_base_relations.list_parts_points.filter(elem => parseInt(elem.id) === parseInt(item.part_point_id))[0].part_id) && elem.type === "Plus" && elem.side === 'back'))[0].id
          
          for(let i = 0; i < this.list_selected_attach['back'].length; i++){
            if(
              parseInt(this.list_selected_attach['back'][i].parent_part_point_id) === parseInt(children_id)
            ){
              for(let j = 0; j < this.list_selected_attach['front'].length; j++){
                if(
                  parseInt(this.list_selected_attach['front'][j].part_point_id) === parseInt(this.bb_base_relations.list_parts_points.filter(item => parseInt(item.id) === parseInt(this.list_selected_attach['back'][i].part_point_id))[0].related_id)
                ){
                  this.list_selected_attach['front'].splice(j, 1)
                }
              }
              this.list_selected_attach['back'].splice(i, 1)
            }
          }
        }
        for(let i = 0; i < this.list_selected_attach['back'].length; i++){
          if(
            parseInt(this.list_selected_attach['back'][i].part_id) === parseInt(item.part_id) &&
            parseInt(this.list_selected_attach['back'][i].part_point_id) === parseInt(item.part_point_id)
          ){
            for(let j = 0; j < this.list_selected_attach['front'].length; j++){
              if(
                parseInt(this.list_selected_attach['front'][j].part_point_id) === parseInt(this.bb_base_relations.list_parts_points.filter(item => parseInt(item.id) === parseInt(this.list_selected_attach['back'][i].part_point_id))[0].related_id)
              ){
                this.list_selected_attach['front'].splice(j, 1)
              }
            }
            this.list_selected_attach['back'].splice(i, 1)
          }
        }
      }
      
    },
    // узнаем есть ли искомый элемент в массиве вырбаных обвесов
    detect_selected_attach(item){
      let answer = false
      for(let i = 0; i < this.list_selected_attach[this.side].length; i++){
        if(
          this.list_selected_attach[this.side][i].part_id === item.part_id &&
          this.list_selected_attach[this.side][i].part_point_id === item.part_point_id
        ){
          answer = true
        }
      }
      return answer
    },
    // обработка формы
    form_valid_skeleton(){
      this.$v.$touch();
      if (!this.$v.selected_point.$invalid) {
        this.select_skeleton_point_dialog = !this.select_skeleton_point_dialog
        this.selected_point_data['skeleton_point_id'] = this.selected_point //
      
        this.push_to_selected_list(this.selected_point_data)
        // 
        this.selected_point = null
        this.selected_point_data = null
      }
    },
    form_valid_parent_part(){
      this.$v.$touch();
      if (!this.$v.selected_point.$invalid) {
        this.select_parent_part_point_dialog = !this.select_parent_part_point_dialog
        this.selected_point_data['parent_part_point_id'] = this.selected_point
        
        this.install_parent_attach(this.selected_point_data.parent_part_point_id)

        this.push_to_selected_list(this.selected_point_data)
        
        // 
        this.selected_point = null
        this.selected_point_data = null
      }
    },
    form_valid_part_or_skeleton(){
      this.$v.$touch();
      if (!this.$v.part_or_skeleton.$invalid) {
        this.select_parent_part_or_skeleton = !this.select_parent_part_or_skeleton

        if(this.part_or_skeleton === 'skeleton'){
          let item = {
            part_id: parseInt(this.intermediate_attach_data.part_id),
            part_point_id: parseInt(this.intermediate_attach_data.part_point_id),
            skeleton_suitable_points: this.intermediate_attach_data.skeleton_suitable_points
          }
          this.validation_selected_item(item)
        }else if(this.part_or_skeleton === 'part'){
          let item = {
            part_id: parseInt(this.intermediate_attach_data.part_id),
            part_point_id: parseInt(this.intermediate_attach_data.part_point_id),
            parent_part_suitable_points: this.intermediate_attach_data.parent_part_suitable_points
          }
          this.validation_selected_item(item)
        }else{
          console.error('Error choosing between skeleton and part')
        }
      this.part_or_skeleton = null
      this.intermediate_attach_data = null
      }
    },
    // обнуление формы
    cancel_form_skeleton(){
      this.select_skeleton_point_dialog = false
      this.list_for_select_skeleton_point = []
      // 
      this.selected_point = null
      this.selected_point_data = null
    },
    // обнуление формы
    cancel_form_parent_part(){
      this.select_parent_part_point_dialog = false
      this.list_for_select_skeleton_point = []
      // 
      this.selected_point = null
      this.selected_point_data = null
    },
    cancel_form_part_or_skeleton(){
      this.select_parent_part_or_skeleton = false
      this.part_or_skeleton = null
    },
    // установка родительского обвеса
    install_parent_attach(child_id){
      let current_part_point_id = this.bb_base_relations.list_parts_points.filter(item => parseInt(item.part_id) === parseInt(this.bb_base_relations.list_parts_points.filter(item => parseInt(item.id) === parseInt(child_id))[0].part_id)).filter(item => (item.type === "Minus" && item.side === this.side))[0].id

      let curent_part_point_classes_list = this.bb_base_relations.list_parts_points.filter(item => parseInt(item.id) === parseInt(current_part_point_id))[0].class

      let list_ids_suitable_skeleton_points = []
      for(let i = 0; i < this.bb_base_relations.list_skeleton_point_id_and_their_classes_ids.length; i++){
        for(let j = 0; j < curent_part_point_classes_list.length; j++){
          if(
            this.bb_base_relations.skeletons_points.filter(elem => parseInt(elem.id) === parseInt(this.bb_base_relations.list_skeleton_point_id_and_their_classes_ids[i].point_id))[0].side === this.side &&
            parseInt(this.bb_base_relations.list_skeleton_point_id_and_their_classes_ids[i].class_id) === parseInt(curent_part_point_classes_list[j])
          ){
            list_ids_suitable_skeleton_points.push(this.bb_base_relations.list_skeleton_point_id_and_their_classes_ids[i])
          }
        }
      }
      
      let create_item = {
        part_point_id: current_part_point_id,
        part_id: this.bb_base_relations.list_parts_points.filter(item => parseInt(item.id) === parseInt(current_part_point_id))[0].part_id,
        skeleton_suitable_points: list_ids_suitable_skeleton_points
      }
      
      this.validation_selected_item(create_item)
    },
    install_related_attachment(){
      if(this.side === 'front'){
        for(let i = 0; i < this.list_selected_attach.front.length; i++){
          if(this.list_selected_attach.front[i].skeleton_point_id){
            let current_part_point = this.bb_base_relations.list_parts_points.filter(item => parseInt(item.related_id) === parseInt(this.list_selected_attach.front[i].part_point_id))[0]
            let current_skeleton_point = this.bb_base_relations.skeletons_points.filter(item => parseInt(item.related_id) === parseInt(this.list_selected_attach.front[i].skeleton_point_id))[0]

            let push_in_item = {
              part_id: parseInt(current_part_point.part_id),
              part_point_id: parseInt(current_part_point.id),
              skeleton_point_id: parseInt(current_skeleton_point.id)
            }

            if(this.list_selected_attach.back.length === 0){
              this.list_selected_attach.back.push(push_in_item)
            }else{
              if(
                this.list_selected_attach.back.map( 
                  item => (
                    parseInt(item.part_id) === parseInt(push_in_item.part_id) && 
                    parseInt(item.part_point_id) === parseInt(push_in_item.part_point_id) && 
                    parseInt(item.skeleton_point_id) === parseInt(push_in_item.skeleton_point_id) 
                  ) 
                ).includes(true)
              ){
                continue
              }else{
                this.list_selected_attach.back.push(push_in_item)
              }
            }
          }else if(this.list_selected_attach.front[i].parent_part_point_id){
            let current_part_point = this.bb_base_relations.list_parts_points.filter(item => parseInt(item.related_id) === parseInt(this.list_selected_attach.front[i].part_point_id))[0]
            let curent_parent_part_point = this.bb_base_relations.list_parts_points.filter(item => parseInt(item.related_id) === parseInt(this.list_selected_attach.front[i].parent_part_point_id))[0]

            let push_in_item = {
              part_id: parseInt(current_part_point.part_id),
              part_point_id: parseInt(current_part_point.id),
              parent_part_point_id: parseInt(curent_parent_part_point.id)
            }
            

            if(this.list_selected_attach.back.length === 0){
              this.list_selected_attach.back.push(push_in_item)
            }else{
              if(
                this.list_selected_attach.back.map( 
                  item => (
                    parseInt(item.part_id) === parseInt(push_in_item.part_id) && 
                    parseInt(item.part_point_id) === parseInt(push_in_item.part_point_id) && 
                    parseInt(item.parent_part_point_id) === parseInt(push_in_item.parent_part_point_id) 
                  ) 
                ).includes(true)
              ){
                continue
              }else{
                this.list_selected_attach.back.push(push_in_item)
              }
            }
          }
        }
      }else if(this.side === 'back'){
        for(let i = 0; i < this.list_selected_attach.back.length; i++){
          if(this.list_selected_attach.back[i].skeleton_point_id){
            let part_point = this.bb_base_relations.list_parts_points.filter(item => parseInt(item.id) === parseInt(this.list_selected_attach.back[i].part_point_id))[0]
            let skeleton_point = this.bb_base_relations.skeletons_points.filter(item => parseInt(item.id) === parseInt(this.list_selected_attach.back[i].skeleton_point_id))[0]

            let push_in_item = {
              part_id: parseInt(part_point.part_id),
              part_point_id: parseInt(part_point.related_id),
              skeleton_point_id: parseInt(skeleton_point.related_id)
            }
            
            if(this.list_selected_attach.front.length === 0){
              this.list_selected_attach.front.push(push_in_item)
            }else{
              if(
                this.list_selected_attach.front.map( 
                  item => (
                    parseInt(item.part_id) === parseInt(push_in_item.part_id) && 
                    parseInt(item.part_point_id) === parseInt(push_in_item.part_point_id) && 
                    parseInt(item.skeleton_point_id) === parseInt(push_in_item.skeleton_point_id) 
                  ) 
                ).includes(true)
              ){
                continue
              }else{
                this.list_selected_attach.front.push(push_in_item)
              }
            }

          }else if(this.list_selected_attach.back[i].parent_part_point_id){
            let part_point = this.bb_base_relations.list_parts_points.filter(item => parseInt(item.id) === parseInt(this.list_selected_attach.back[i].part_point_id))[0]
            let parent_part_point = this.bb_base_relations.list_parts_points.filter(item => parseInt(item.id) === parseInt(this.list_selected_attach.back[i].parent_part_point_id))[0]

            let push_in_item = {
              part_id: parseInt(part_point.part_id),
              part_point_id: parseInt(part_point.related_id),
              parent_part_point_id: parseInt(parent_part_point.related_id)
            }

            if(this.list_selected_attach.front.length === 0){
              this.list_selected_attach.front.push(push_in_item)
            }else{
              if(
                this.list_selected_attach.front.map( 
                  item => (
                    parseInt(item.part_id) === parseInt(push_in_item.part_id) && 
                    parseInt(item.part_point_id) === parseInt(push_in_item.part_point_id) && 
                    parseInt(item.parent_part_point_id) === parseInt(push_in_item.parent_part_point_id) 
                  ) 
                ).includes(true)
              ){
                continue
              }else{
                this.list_selected_attach.front.push(push_in_item)
              }
            }
          }
        }
      } 
    },
    // сохраняем данные на сервере
    save_base_builder_data(){
      let data = []
      for(let i = 0 ;i < this.list_selected_attach['front'].length; i++){
        data.push({
          base_id: parseInt(this.bb_base_by_id.id),
          ...this.list_selected_attach['front'][i]
        })
      }
      for(let i = 0 ;i < this.list_selected_attach['back'].length; i++){
        data.push({
          base_id: parseInt(this.bb_base_by_id.id),
          ...this.list_selected_attach['back'][i]
        })
      }
      
      this.$store.dispatch('bb_save_base_builder_attach', data)
    }
  },
  computed: {
    // получаем комплексные данные base builder
    bb_base_relations(){
      return this.$store.getters.bb_base_relations
    },
    // валидачия диалога
    selected_point_error() {
      const errors = [];
      if (!this.$v.selected_point.$dirty) return errors;
      !this.$v.selected_point.required && errors.push("Point is required.");
      return errors;
    },
    part_or_skeleton_error() {
      const errors = [];
      if (!this.$v.part_or_skeleton.$dirty) return errors;
      !this.$v.part_or_skeleton.required && errors.push("Required.");
      return errors;
    },
    bb_load_base_relations_status(){
      return this.$store.getters.bb_load_base_relations_status
    },
    merge_classes(){
      let list = false
      if(this.bb_base_relations.list_data_of_used_classes_for_skeleton && this.bb_base_relations.list_data_of_used_classes_for_part){
        list = Array.from(new Set(this.bb_base_relations.list_data_of_used_classes_for_skeleton.concat(this.bb_base_relations.list_data_of_used_classes_for_part)))
      }
      return list
    },
    bb_base_by_id(){
      return this.$store.getters.bb_base_by_id
    }
  }
};
</script>