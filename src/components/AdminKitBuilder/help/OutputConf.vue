<template>
    <v-content>
        <v-card>
            <div class="b-image-container">
                <div class="b-image-container__inner" :style="{paddingLeft: side === 'front' ?  '400px' : '200px', paddingRight: side === 'back' ?  '400px' : '200px'}">
                    <div class="b-image-container__content" :style="{width: canvas_width,minWidth: canvas_width,maxWidth: canvas_width}">
                        <img :src="(side === 'front') ? skeleton_data.image_front : (side === 'back') ? skeleton_data.image_back : 'error'" :width="canvas_width + 'px'" draggable="false">
                        
                        <img 
                            draggable="false"
                            v-for="(item, index) in list_product[side]" 
                            :key="'image' + index" 
                            :src="item.image[side]" 
                            :title="`top: ${parseFloat(item.pos.y) / parseFloat(radio['front'])}, left: ${parseFloat(item.pos.x) / parseFloat(radio['front'])}}`"
                            class="b-image-container__image"
                            :style="{top: item.pos.y, left: item.pos.x, width: item.width, zIndex: item.z_index}"
                        >
                    </div>
                </div>
            </div>
        </v-card>
    </v-content>
</template>

<script>
export default {
    props: ['skeleton_data', 'attachments', 'config', 'side'],
    watch: {
        attachments: {
            immediate: true,
            handler(){
                this.get_product_data()
            },
            deep: true
        }
    },
    data(){
        return {
            canvas_width: 500,
            radio: {
                front: null,
                back: null
            },
            list_product: {
                front: [],
                back: []
            }
        }
    },
    created(){
        this.get_radio(this.skeleton_data.image_front, 'front')
        this.get_radio(this.skeleton_data.image_back, 'back')
        
        let interval = setInterval(()=>{
            this.get_product_data()
            
            if(this.attachments['front'].length > 0 || this.attachments['back'].length > 0){
                clearInterval(interval)
            }
        },100)
    },
    mounted() {
    },
    methods: {
        get_radio(url, side){
            let width = null
            let img = new Image();
            img.onload =  e =>{
                if(side === 'front'){
                    this.radio.front = this.canvas_width /  e.target.width
                }else if(side === 'back'){
                    this.radio.back = this.canvas_width /  e.target.width
                }
            }
            img.src = url
            return width
        },
        async get_product_data(){
            this.list_product[this.side] = []
            for(let i = 0; i < this.attachments[this.side].length; i++){
                let item =     this.attachments[this.side][i]
                let part_pos = {
                    x: this.config.products_points_data.filter(elem => parseInt(elem.id) === parseInt(item.product_point_id))[0].pos_x,
                    y: this.config.products_points_data.filter(elem => parseInt(elem.id) === parseInt(item.product_point_id))[0].pos_y
                }
                let answer = {
                        pos: {
                            x: null,
                            y: null
                        },
                        image: {
                            front: this.config.products_data.filter(elem => parseInt(elem.id) === parseInt(item.product_id))[0].image_front,
                            back: this.config.products_data.filter(elem => parseInt(elem.id) === parseInt(item.product_id))[0].image_back
                        },
                        width: await this.get_image_width(this.config.products_data.filter(elem => parseInt(elem.id) === parseInt(item.product_id))[0].image_front) + 'px'   ,
                        hint: this.config.products_points_data.filter(elem => parseInt(elem.id) === parseInt(item.product_point_id))[0].hint,
                        z_index: null
                }
                if(item.parent_skeleton_point_id){
                    let skeleton_point_pos = {
                        x: this.config.skeleton_points_data.filter(elem => parseInt(elem.id) === parseInt(item.parent_skeleton_point_id))[0].pos_x,
                        y: this.config.skeleton_points_data.filter(elem => parseInt(elem.id) === parseInt(item.parent_skeleton_point_id))[0].pos_y
                    }

                        answer.pos.x = ((parseInt(skeleton_point_pos.x) - parseInt(part_pos.x)) * this.radio[this.side]) + 'px'
                        answer.pos.y = ((parseInt(skeleton_point_pos.y) - parseInt(part_pos.y)) * this.radio[this.side]) + 'px'
                        answer.z_index = 0
                }else if(item.parent_product_point_id){
                    let parent_product_point_id = parseInt(item.parent_product_point_id)
                    let parent_part_point_data = this.config.products_points_data.filter(elem => parseInt(elem.id) === parent_product_point_id)[0]
                    let parent_product_id = parseInt(this.config.products_points_data.filter(elem => parseInt(elem.id) === parent_product_point_id)[0].product_id)
                    let parent_part_point_plus_data = this.config.products_points_data.filter(elem => (parseInt(elem.product_id) === parent_product_id && elem.type === 'Minus' && elem.side === this.side))[0]
                    let current_parent_part_data = this.attachments[this.side].filter(elem=> parseInt(elem.product_point_id) === parseInt(parent_part_point_plus_data.id))[0]
                    let skeleton_point_pos = {
                        x: this.config.skeleton_points_data.filter(elem => parseInt(elem.id) === parseInt(current_parent_part_data.parent_skeleton_point_id))[0].pos_x,
                        y: this.config.skeleton_points_data.filter(elem => parseInt(elem.id) === parseInt(current_parent_part_data.parent_skeleton_point_id))[0].pos_y
                    }
                    
                    answer.pos.x = ((parseInt(skeleton_point_pos.x) + parseInt(parent_part_point_data.pos_x) - parseInt(parent_part_point_plus_data.pos_x) - parseInt(part_pos.x)) * this.radio[this.side]) + 'px'
                    answer.pos.y = ((parseInt(skeleton_point_pos.y) + parseInt(parent_part_point_data.pos_y) - parseInt(parent_part_point_plus_data.pos_y) - parseInt(part_pos.y)) * this.radio[this.side]) + 'px'
                    answer.z_index = 1
                }
                this.list_product[this.side].push(answer)
            }
        },
        async get_image_width(src){
            let img = new Image();
            let width = ()=> (img.width * this.radio[this.side])
            img.onload = await width()
            img.src = src
            return width()
        }
    }
}
</script>

<style lang="scss" scope>
    .b-image-container{
        overflow: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .b-image-container__inner{
        width: 1100px;
        min-width: 1100px;
        max-width: 1100px;
        padding-top: 150px;
        padding-bottom: 150px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .b-image-container__content{
        position: relative;
    }
    .b-image-container__image{
        position: absolute;
        display: block;
    }
</style>