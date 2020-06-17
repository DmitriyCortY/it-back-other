<template>
    <v-content>
        <OutputConf 
            :skeleton_data="akb_load_kit_relation.skeleton_data"
            :attachments="list_selected_products"
            :config="akb_load_kit_relation"
            :side="side"
        ></OutputConf>

        <v-text-field v-model="filter_products" label="Filter products"></v-text-field>

        <v-row>
            <v-col cols="4" v-for="(item, index) in output_filter_products" :key="'filter-' + index">
                <v-card >
                    <v-btn color="primary"  class="b-hover-button" text style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" v-if="!detect_selected_product(item.id)" @click="select_product(parseInt(item.id))">
                        <v-icon>
                            mdi-plus-circle-outline
                        </v-icon>
                    </v-btn>
                    <v-btn color="red"  class="b-hover-button" text style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" v-if="detect_selected_product(item.id)" @click="delete_product(parseInt(item.id))">
                        <v-icon>
                            mdi-minus-circle-outline
                        </v-icon>
                    </v-btn>

                    <v-row justify="center" align="center"> 
                        <v-col cols="4">
                            <img class="ma-3" :src="item['image_' + [side]]" :style="{maxWidth: '78px', maxHeight: '78px',display: 'black'}">
                        </v-col>
                        <v-col cols="8">
                            <h4 class="pa-3"> 
                                {{item.name}}
                            </h4>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-row v-if="filter_products.length === 0">
            <v-col cols="4" v-for="(item, index) in akb_load_kit_relation.merge_classes_skeleton_and_products" :key="'product-' + index">
                <v-card @click="select_class(parseInt(item.id))">
                    <div class="pa-3">
                        {{item.name}}
                    </div>
                </v-card>
            </v-col>
        </v-row>
        
        <v-row v-if="filter_products.length === 0">
            <v-col cols="4" v-for="(item, index) in fitler_products_by_filter_products_points_list" :key="'filter-' + index">
                <v-card >
                    <v-btn color="primary"  class="b-hover-button" text style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" v-if="!detect_selected_product(item.id)" @click="select_product(parseInt(item.id), parseInt(selected_class))">
                        <v-icon>
                            mdi-plus-circle-outline
                        </v-icon>
                    </v-btn>
                    <v-btn color="red"  class="b-hover-button" text style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" v-if="detect_selected_product(item.id)" @click="delete_product(parseInt(item.id))">
                        <v-icon>
                            mdi-minus-circle-outline
                        </v-icon>
                    </v-btn>

                    <v-row justify="center" align="center"> 
                        <v-col cols="4">
                            <img class="ma-3" :src="item['image_' + [side]]" :style="{maxWidth: '78px', maxHeight: '78px',display: 'black'}">
                        </v-col>
                        <v-col cols="8">
                            <h4 class="pa-3"> 
                                {{item.name}}
                            </h4>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="choose_parent_dialog" persistent max-width="440">
            <v-card>
                <v-card-title class="headline">
                    Choose parent
                </v-card-title>
                <v-card-text>
                    <v-select 
                        placeholder="Choose parent"
                        :items="choose_parent_list"
                        item-text="name"
                        return-object
                        v-model="choose_parent"
                    ></v-select>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" text @click="cancel_choose_parent_dialog">Cancel</v-btn>
                    <v-btn color="green" style="color:#fff;" @click="accept_choose_parent_dialog">Agree</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-content>
</template>
<script>
import OutputConf from "@/components/AdminKitBuilder/help/OutputConf.vue";
export default {
    props: ["akb_load_kit_relation", "side", 'selected_products'],
    components: {  
        OutputConf
    },
    data(){
        return{
            filter_products: '',
            //dialods
            saved_data: null,
            // 
            choose_parent_list: [],
            choose_parent: null,
            choose_parent_dialog: false,
            //
            //dialods end
            selected_class: null,
            list_selected_products: {
                front: [],
                back: []
            }
        }
    },
    created(){
        this.set_loaded_products()
        this.$emit('data_transfer', this.list_selected_products)
    },
    // updated(){
    //     this.set_loaded_products()
    //     this.$emit('data_transfer', this.list_selected_products)
    // },
    methods: {
        // устанавливаем продукты полученые из базы
        set_loaded_products(){
            this.$set(this.list_selected_products, 'front', this.selected_products.front)
            this.$set(this.list_selected_products, 'back', this.selected_products.back)
        },
        // выбираем id класса
        select_class(id){
            this.selected_class = parseInt(id)
        },
        // выбираем продукт
        select_product(id, point_class){
            if(!point_class){
                point_class = this.akb_load_kit_relation.products_points_data.filter(item=>parseInt(item.product_id)===parseInt(id)&&item.side===this.side&&item.type==='Minus')[0].class[0]
            }
            let selected_product = this.akb_load_kit_relation.products_data.filter(item=>parseInt(item.id)===parseInt(id))[0]
            let selected_product_points = this.akb_load_kit_relation.products_points_data.filter(item=>parseInt(item.product_id)===parseInt(selected_product.id)&&item.type==="Minus"&&item.side===this.side)[0]
            let data = {
                product_id: parseInt(selected_product.id),
                product_point_id: parseInt(selected_product_points.id),
                parent: this.skeleton_or_product_point(parseInt(point_class)),
                class_id: parseInt(point_class)
            }
            
            this.validation_product_before_install(this.search_parent_point(data))
        },
        // удаляем продукт
        delete_product(id){
            let saved_data = this.list_selected_products[this.side].filter(item=>parseInt(item.product_id)===parseInt(id))[0]
            for(let i = 0; i < this.list_selected_products[this.side].length; i++){
                if(parseInt(this.list_selected_products[this.side][i].product_id) === parseInt(id)){
                    this.list_selected_products[this.side].splice(i, 1)
                }
            }
            if(saved_data){
                if(saved_data.parent_skeleton_point_id){
                    let child_point = this.akb_load_kit_relation.products_points_data.filter(item=>parseInt(item.product_id)===parseInt(saved_data.product_id)&&item.type==="Plus"&&item.side===this.side)
                    if(child_point.length != 0){
                        let child_point_id = parseInt(child_point[0].id)
                        for(let j = 0; j < this.list_selected_products[this.side].length; j++){
                            if(parseInt(this.list_selected_products[this.side][j].parent_product_point_id) === parseInt(child_point_id)){
                                this.list_selected_products[this.side].splice(j, 1)
                            }
                        }
                    }
                }
            }
            this.delete_product_other_side(id)
        },
        delete_product_other_side(id){
            let side = null
            if(this.side === 'front'){
                side = "back"
            }else if(this.side === 'back'){
                side = 'front'
            }
            let saved_data = this.list_selected_products[side].filter(item=>parseInt(item.product_id)===parseInt(id))[0]
            for(let i = 0; i < this.list_selected_products[side].length; i++){
                if(parseInt(this.list_selected_products[side][i].product_id) === parseInt(id)){
                    this.list_selected_products[side].splice(i, 1)
                }
            }
            if(saved_data){
                if(saved_data.parent_skeleton_point_id){
                    let child_point = this.akb_load_kit_relation.products_points_data.filter(item=>parseInt(item.product_id)===parseInt(saved_data.product_id)&&item.type==="Plus"&&item.side===side)
                    if(child_point.length != 0){
                        let child_point_id = parseInt(child_point[0].id)
                        for(let j = 0; j < this.list_selected_products[side].length; j++){
                            if(parseInt(this.list_selected_products[side][j].parent_product_point_id) === parseInt(child_point_id)){
                                this.list_selected_products[side].splice(j, 1)
                            }
                        }
                    }
                }
            }
        },
        // провкряем выбран ли продукт
        detect_selected_product(id){
            if(this.list_selected_products[this.side].filter(item=>parseInt(item.product_id)===parseInt(id)).length > 0){
                return true
            }else{
                return false
            }
        },
        //  поиск родительской точки
        search_parent_point(data){
            let response = {
                product_id: parseInt(data.product_id),
                product_point_id: parseInt(data.product_point_id)
            }
            if(data.parent === 'skeleton'){
                let list_ids = []
                let parent_points_list = this.akb_load_kit_relation.skeleton_points_data.filter(item=>item.class.includes(parseInt(data.class_id))&&item.side===this.side&&item.type==='Plus')
                for(let i = 0; i < parent_points_list.length; i++){
                    list_ids.push(parseInt(parent_points_list[i].id))
                }
                response.suitable_skeleton_points_ids = list_ids
            }else if(data.parent === "product"){
                let list_ids = []
                let parent_points_list = this.akb_load_kit_relation.products_points_data.filter(item=>item.class.includes(parseInt(data.class_id))&&item.side===this.side&&item.type==='Plus')
                for(let i = 0; i < parent_points_list.length; i++){
                    list_ids.push(parseInt(parent_points_list[i].id))
                }
                response.suitable_products_points_ids = list_ids
            }else if(data.parent === 'any'){
                let list_skeleton_ids = []
                let parent_skeleton_points_list = this.akb_load_kit_relation.skeleton_points_data.filter(item=>item.class.includes(parseInt(data.class_id))&&item.side===this.side&&item.type==='Plus')
                for(let i = 0; i < parent_skeleton_points_list.length; i++){
                    list_skeleton_ids.push(parseInt(parent_skeleton_points_list[i].id))
                }
                response.suitable_skeleton_points_ids = list_skeleton_ids

                let list_products_ids = []
                let parent_products_points_list = this.akb_load_kit_relation.products_points_data.filter(item=>item.class.includes(parseInt(data.class_id))&&item.side===this.side&&item.type==='Plus')
                for(let i = 0; i < parent_products_points_list.length; i++){
                    list_products_ids.push(parseInt(parent_products_points_list[i].id))
                }
                response.suitable_products_points_ids = list_products_ids
            }
            return response
        },
        // проверка продукта перед установкой
        validation_product_before_install(data){
            let response = {
                product_id: parseInt(data.product_id),
                product_point_id: parseInt(data.product_point_id)
            }
            // только скелетон
            if(data.suitable_skeleton_points_ids != undefined && data.suitable_products_points_ids === undefined){
                if(data.suitable_skeleton_points_ids.length === 1){
                    response.parent_skeleton_point_id = data.suitable_skeleton_points_ids[0]
                    this.push_product_to_list_selected_product(response)
                    return
                }else{
                    this.saved_data = data
                    let list = []
                    for(let i = 0; i < data.suitable_skeleton_points_ids.length; i++){
                        for(let j = 0; j < this.akb_load_kit_relation.skeleton_points_data.length; j++){
                            if(parseInt(data.suitable_skeleton_points_ids[i]) === parseInt(this.akb_load_kit_relation.skeleton_points_data[j].id)){
                                list.push({
                                    name: this.akb_load_kit_relation.skeleton_data.name,
                                    id: parseInt(this.akb_load_kit_relation.skeleton_points_data[j].id),
                                    type: 'skeleton'
                                })
                            }
                        }
                    }
                    this.choose_parent_list = [...list]
                    this.choose_parent_dialog = true
                }
            }
            // только продукт
            else if(data.suitable_skeleton_points_ids === undefined && data.suitable_products_points_ids != undefined){
                if(data.suitable_products_points_ids.length === 1){
                    response.parent_product_point_id = data.suitable_products_points_ids[0]
                    this.push_product_to_list_selected_product(response)
                    return
                }else{
                    this.saved_data = data
                    let list = []
                    for(let i = 0; i < data.suitable_products_points_ids.length; i++){
                        for(let j = 0; j < this.akb_load_kit_relation.products_points_data.length; j++){
                            if(parseInt(data.suitable_products_points_ids[i]) === parseInt(this.akb_load_kit_relation.products_points_data[j].id)){
                                list.push({
                                    name: this.akb_load_kit_relation.products_data.filter(item=>parseInt(item.id)===parseInt(this.akb_load_kit_relation.products_points_data[j].product_id))[0].name,
                                    id: parseInt(this.akb_load_kit_relation.products_points_data[j].id),
                                    type: 'product'
                                })
                            }
                        }
                    }
                    this.choose_parent_list = [...list]
                    this.choose_parent_dialog = true
                }
            }
            // оба варианта (нужен выбор)
            else if(data.suitable_skeleton_points_ids != undefined && data.suitable_products_points_ids != undefined){
                this.saved_data = data
                let list = []
                for(let i = 0; i < data.suitable_products_points_ids.length; i++){
                    for(let j = 0; j < this.akb_load_kit_relation.products_points_data.length; j++){
                        if(parseInt(data.suitable_products_points_ids[i]) === parseInt(this.akb_load_kit_relation.products_points_data[j].id)){
                            list.push({
                                name: this.akb_load_kit_relation.products_data.filter(item=>parseInt(item.id)===parseInt(this.akb_load_kit_relation.products_points_data[j].product_id))[0].name,
                                id: parseInt(this.akb_load_kit_relation.products_points_data[j].id),
                                type: 'product'
                            })
                        }
                    }
                }

                let list2 = []
                for(let i = 0; i < data.suitable_skeleton_points_ids.length; i++){
                    for(let j = 0; j < this.akb_load_kit_relation.skeleton_points_data.length; j++){
                        if(parseInt(data.suitable_skeleton_points_ids[i]) === parseInt(this.akb_load_kit_relation.skeleton_points_data[j].id)){
                            list2.push({
                                name: this.akb_load_kit_relation.skeleton_data.name,
                                id: parseInt(this.akb_load_kit_relation.skeleton_points_data[j].id),
                                type: 'skeleton'
                            })
                        }
                    }
                }

                this.choose_parent_list = [...list, ...list2]
                this.choose_parent_dialog = true
            }
        },
        // Добвавляем продукт в список выбраных
        push_product_to_list_selected_product(data, side){
            if(parseInt(data.product_point_id) === 0 || parseInt(data.parent_skeleton_point_id) === 0 || parseInt(data.parent_product_point_id) === 0) return
            
            if(!side){
                side = this.side
            }

            for(let i = 0; i < this.list_selected_products[side].length; i++){
                if(
                    parseInt(this.list_selected_products[side][i].product_id) === parseInt(data.product_id) &&
                    parseInt(this.list_selected_products[side][i].product_point_id) === parseInt(data.product_point_id)
                ){
                    return
                }
               if(data.parent_skeleton_point_id){
                    if(
                        parseInt(this.list_selected_products[side][i].parent_skeleton_point_id) === parseInt(data.parent_skeleton_point_id)
                    ){
                        let curent_parent_product_id = this.list_selected_products[side].filter(item=>parseInt(item.parent_skeleton_point_id)===parseInt(this.list_selected_products[side][i].parent_skeleton_point_id))[0].product_id
                        this.delete_product(parseInt(curent_parent_product_id))
                    }
                }

                if(data.parent_product_point_id){
                    if(
                        parseInt(this.list_selected_products[side][i].parent_product_point_id) === parseInt(data.parent_product_point_id)
                    ){
                        let curent_parent_product_id = this.list_selected_products[side].filter(item=>parseInt(item.parent_product_point_id)===parseInt(this.list_selected_products[side][i].parent_product_point_id))[0].product_id
                        this.delete_product(parseInt(curent_parent_product_id))
                    }
                }
            }
            
            this.list_selected_products[side].push(data)

            if(data.parent_product_point_id){
                let parent_product_id = parseInt(this.akb_load_kit_relation.products_points_data.filter(item=>parseInt(item.id)===parseInt(data.parent_product_point_id))[0].product_id)
                let parent_product_classes = this.akb_load_kit_relation.products_points_data.filter(item=>parseInt(item.product_id)===parseInt(parent_product_id)&&item.side===side&&item.type==="Minus")[0].class

                if(parent_product_classes.length === 1){
                    this.select_product(parent_product_id, parseInt(parent_product_classes[0]))
                }
            }
            
            this.add_other_side_related(data)
        },
        // Добавляем связаный продукт с другой стороны
        add_other_side_related(data){
            if(this.side === 'front'){
                let product_point_other_side_data = this.akb_load_kit_relation.products_points_data.filter(item=>parseInt(item.related_id)===parseInt(data.product_point_id))[0]
                let parent_skeleton_point_oher_side_data = this.akb_load_kit_relation.skeleton_points_data.filter(item=>parseInt(item.related_id)===parseInt(data.parent_skeleton_point_id))[0]
                let parent_product_point_oher_side_data = this.akb_load_kit_relation.products_points_data.filter(item=>parseInt(item.related_id)===parseInt(data.parent_product_point_id))[0]
                if(product_point_other_side_data, parent_skeleton_point_oher_side_data){
                    let product_point_other_side_id = parseInt(product_point_other_side_data.id)
                    let parent_skeleton_point_oher_side_id = parseInt(parent_skeleton_point_oher_side_data.id)
                    let product_other_side_data = {
                        product_id: parseInt(data.product_id),
                        product_point_id: parseInt(product_point_other_side_id),
                        parent_skeleton_point_id: parseInt(parent_skeleton_point_oher_side_id)
                    }
                    this.push_product_to_list_selected_product(product_other_side_data, 'back')
                }else if(product_point_other_side_data, parent_product_point_oher_side_data){
                    let product_point_other_side_id = parseInt(product_point_other_side_data.id)
                    let parent_product_point_oher_side_id = parseInt(parent_product_point_oher_side_data.id)
                    let product_other_side_data = {
                        product_id: parseInt(data.product_id),
                        product_point_id: parseInt(product_point_other_side_id),
                        parent_product_point_id: parseInt(parent_product_point_oher_side_id)
                    }
                    this.push_product_to_list_selected_product(product_other_side_data, 'back')
                }
            }else if(this.side === 'back'){
                let product_point_other_side_data = this.akb_load_kit_relation.products_points_data.filter(item=>parseInt(item.id)===parseInt(data.product_point_id))[0]
                let parent_skeleton_point_oher_side_data = this.akb_load_kit_relation.skeleton_points_data.filter(item=>parseInt(item.id)===parseInt(data.parent_skeleton_point_id))[0]
                let parent_product_point_oher_side_data = this.akb_load_kit_relation.products_points_data.filter(item=>parseInt(item.id)===parseInt(data.parent_product_point_id))[0]
                if(product_point_other_side_data, parent_skeleton_point_oher_side_data){
                    let product_point_other_side_id = parseInt(product_point_other_side_data.related_id)
                    let parent_skeleton_point_oher_side_id = parseInt(parent_skeleton_point_oher_side_data.related_id)
                    let product_other_side_data = {
                        product_id: parseInt(data.product_id),
                        product_point_id: parseInt(product_point_other_side_id),
                        parent_skeleton_point_id: parseInt(parent_skeleton_point_oher_side_id)
                    }
                    this.push_product_to_list_selected_product(product_other_side_data, 'front')
                }else if(product_point_other_side_data, parent_product_point_oher_side_data){
                    let product_point_other_side_id = parseInt(product_point_other_side_data.related_id)
                    let parent_product_point_oher_side_id = parseInt(parent_product_point_oher_side_data.related_id)
                    let product_other_side_data = {
                        product_id: parseInt(data.product_id),
                        product_point_id: parseInt(product_point_other_side_id),
                        parent_product_point_id: parseInt(parent_product_point_oher_side_id)
                    }
                    this.push_product_to_list_selected_product(product_other_side_data, 'front')
                }
            }
        },
        // diaolgs
        accept_choose_parent_dialog(){
            if(this.choose_parent === null) return
            let data = {
                product_id: parseInt(this.saved_data.product_id),
                product_point_id: parseInt(this.saved_data.product_point_id),
            }
            if(this.choose_parent.type === "skeleton"){
                data.suitable_skeleton_points_ids = [parseInt(this.choose_parent.id)]
            }else if(this.choose_parent.type === "product"){
                data.suitable_products_points_ids = [parseInt(this.choose_parent.id)]
            }
            this.cancel_choose_parent_dialog()
            this.validation_product_before_install(data)
        },
        cancel_choose_parent_dialog(){
            this.choose_parent_list = []
            this.choose_parent = null
            this.choose_parent_dialog = false
            this.saved_data = null
        },
        // diaolgs end


        // helpers...
        skeleton_or_product_point(class_id){
            // если подходит и на скелет и на продукт
            if(this.akb_load_kit_relation.duplicate_list_classes_skeleton_and_products.includes(class_id)){
                return 'any'
            }
            // если подходит только на скетел
            else if(this.akb_load_kit_relation.skeleton_points_classes_list.map(item=>parseInt(item.id)===parseInt(class_id)).includes(true)){
                return 'skeleton'
            }
            // если подходит только на продукт
            else if(this.akb_load_kit_relation.products_points_classes_list.map(item=>parseInt(item.id)===parseInt(class_id)).includes(true)){
                return 'product'
            }
        }
    },
    computed: {
        filter_products_points_by_class(){
            let list = []
            if(this.selected_class != null){
                for(let i = 0; i < this.akb_load_kit_relation.products_points_data.length; i++){
                    if(
                        this.akb_load_kit_relation.products_points_data[i].class.includes(this.selected_class) &&
                        this.akb_load_kit_relation.products_points_data[i].side === this.side &&
                        this.akb_load_kit_relation.products_points_data[i].type === "Minus"
                    ){
                        list.push(this.akb_load_kit_relation.products_points_data[i])
                    }
                }
            }else{
                list = []
            }
            return list
        },
        fitler_products_by_filter_products_points_list(){
            let list = []
            if(this.filter_products_points_by_class.length > 0){
                for(let i = 0; i < this.filter_products_points_by_class.length; i++){
                    for(let j = 0; j < this.akb_load_kit_relation.products_data.length; j++){
                        if(
                            parseInt(this.filter_products_points_by_class[i].product_id) ===
                            parseInt(this.akb_load_kit_relation.products_data[j].id)
                        ){
                            list.push(this.akb_load_kit_relation.products_data[j])
                        }
                    }
                }
            }else{  
                list = []
            }
            return list
        },
        output_filter_products(){
            let list = []
            if(this.filter_products.length != 0){
                list = this.akb_load_kit_relation.products_data.filter(item=>item.name.toLowerCase().includes(this.filter_products.toLowerCase()))
            }else{
                list = []
            }
            return list
        }
    }
}
</script>
<style lang="scss" scope>
    .b-hover-button{
        transition: opacity 0.3s ease;
        opacity: 0.2;
        &:hover{
            opacity: 1;
        }
    }
</style>