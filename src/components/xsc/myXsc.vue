<template>
  <div ref="mt_canvas" class="mt_canvas">
    <template v-for="item in props.charts" :key="item.id">
      <MyXscNode
        :ref="item.id"
        @click="nodeClick(item)"
        :node="item"
        @mousedown="itemMousedown(item,$event)"
        @mouseup="removeMouseMove"
        @dragstart="()=>{return false}"
        @contextmenu.prevent="openMenu($event,item)"
                >
        <template v-slot:resize>
          <span 
            
            @dragstart="()=>{return false}" 
            @mousedown="changeSizeSizeMousedown(item,'chart',$event)" 
            @mouseup="removeChangeSizeMouseMove">
            <el-button 
              class="node_resize" 
              :icon="Edit"
              circle
              >
              
            </el-button>
            
          </span>
        </template>
      </MyXscNode>
      <ul v-show="contextMenuVisible"
        :style="{ left: position.left + 'px', top: position.top + 'px', display: (contextMenuVisible ? 'block' : 'none') }"
        class="contextmenu">
        <div class="item" @click="delChart">
          <el-icon><Delete /></el-icon>
          删除
        </div>
        <div class="item" @click="changeChartZIndex(1)">
          <el-icon><ArrowUpBold /></el-icon>
          上移一层
        </div>
        <div class="item" @click="changeChartZIndex(-1)">
          <el-icon><ArrowDownBold /></el-icon>
          下移一层
        </div>
      </ul>
    </template>
    
  </div>
</template>

<script setup>

import MyXscNode from './myXscNode.vue'
import {defineProps, ref, watch} from 'vue';
import {Edit} from '@element-plus/icons-vue'
import store from '@/store';
import bus from "@/utils/bus"

import {
  Delete,
  ArrowUpBold,
  ArrowDownBold,
} from '@element-plus/icons-vue'

const contextMenuVisible = ref(false)
const position = ref({
  top: 0,
  left: 0
})
const rightClickItem = ref('')
const openMenu = (e, item) => {
  store.commit("changeActiveNode",item)
  const ownerRect = mt_canvas.value.getBoundingClientRect()
  // console.log("open contextmenu")
  contextMenuVisible.value = true
  position.value.top = e.clientY-ownerRect.top
  position.value.left = e.clientX-ownerRect.left
  rightClickItem.value = item
  // console.log(item)
  // console.log(e.pageX,e.pageY)
}
const closeMenu = () => {
  contextMenuVisible.value = false
}
watch(contextMenuVisible, () => {
  if (contextMenuVisible.value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

const mt_canvas = ref(null)

const shift = ref({
  x:0,
  y:0,
  type:null
})

// const activeNode = ref()

// const emits = defineEmits(['nodeActive','nodeEditing'])

const props = defineProps({
  charts: {
      type: Array,
      default: null
    },
})

const nodeClick = () =>{
  // console.log("nodeClick node: ")
  // console.log(item)
  // emits('nodeActive',item)
}

const mouseUpListener = (event) =>{
  //鼠标抬起，保存当前参数，恢复到之前状态
  // console.log("mouse up listener")
  event.stopPropagation()
  document.removeEventListener('mousemove',nodeMousemove)
  document.removeEventListener('mousemove',changeSizeMousemove)
  document.removeEventListener('mouseup',mouseUpListener)
  shift.value.x = 0;
  shift.value.y = 0;
  bus.emit('optionChange')
  // emits("nodeEditing",store.state.activeNode)
}

const removeMouseMove = (event) =>{
  // console.log("mouse up")
  event.stopPropagation()
  document.removeEventListener('mousemove',nodeMousemove)
  document.removeEventListener('mousemove',changeSizeMousemove)
  shift.value.x = 0;
  shift.value.y = 0;
  bus.emit('optionChange')
  // emits("nodeEditing",store.state.activeNode)
}



const itemMousedown = (item,event) => {
  // console.log("mouse down")
  // console.log("and active node change into : ")
  store.commit("changeActiveNode",item)
  event.preventDefault()
  event.stopPropagation()
  
  // console.log("nodeClick node: ")
  // console.log(item)
  // console.log("emit node Active from myXsc")
  // emits('nodeActive',item)

  let clickBox = event.currentTarget.getBoundingClientRect()
  // console.log(event.clientX,event.clientY)
  // console.log(clickBox)
  shift.value.x = event.clientX-clickBox.left
  shift.value.y= event.clientY-clickBox.top
  document.removeEventListener('mousemove',nodeMousemove)
  document.removeEventListener('mousemove',changeSizeMousemove)
  document.removeEventListener('mouseup',mouseUpListener)
  document.addEventListener('mousemove',nodeMousemove)
  document.addEventListener('mouseup',mouseUpListener)
}

const nodeMousemove = (event) =>{
  // console.log("node mouse move")
  event.stopPropagation()
    const ownerRect = mt_canvas.value.getBoundingClientRect()
    store.state.activeNode.box.x = parseInt((event.pageX-ownerRect.left-shift.value.x))
    store.state.activeNode.box.y = parseInt((event.pageY-ownerRect.top-shift.value.y))
}

const removeChangeSizeMouseMove = (event) =>{
  // console.log("remove change size mouse move")
  event.stopPropagation()
  document.removeEventListener('mousemove',nodeMousemove)
  document.removeEventListener('mousemove',changeSizeMousemove)
}

const changeSizeSizeMousedown = (node,type,event) =>{
  // console.log("change size mouse down")
  // console.log(event)
  event.stopPropagation()
  // activeNode.value = node
  // console.log("changeActiveNode",node)
  // emits('nodeActive',node)
  shift.value.type=type
  switch (type){
    case 'chart':{
      let clickBoxWeight = event.currentTarget.parentElement.offsetWidth;
      let clickBoxHeight = event.currentTarget.parentElement.offsetHeight;
      shift.value.x = parseInt(clickBoxWeight-event.clientX)
      shift.value.y = parseInt(clickBoxHeight-event.clientY)
      document.removeEventListener('mousemove',nodeMousemove)
      document.removeEventListener('mousemove',changeSizeMousemove)
      document.removeEventListener('mouseup',mouseUpListener)
      document.addEventListener('mousemove',changeSizeMousemove)
      document.addEventListener('mouseup',mouseUpListener)
    }break
    case 'canvas':{
      // let clickBoxWeight = event.currentTarget.previousSibling.offsetWidth;
      // let clickBoxHeight = event.currentTarget.previousSibling.offsetHeight;
      // this.shift.x = parseInt(clickBoxWeight*this.scale)-event.clientX
      // this.shift.y = parseInt(clickBoxHeight*this.scale)-event.clientY
      // document.removeEventListener('mousemove',this.changeSizeMousemove)
      // document.addEventListener('mousemove',this.changeSizeMousemove)
    }break
  }
  
}
const changeSizeMousemove = (event) =>{
  // console.log("change size mouse move")
  switch (shift.value.type){
    case 'chart':{
      store.state.activeNode.box.width = parseInt((event.pageX+shift.value.x))
      store.state.activeNode.box.height = parseInt((event.pageY+shift.value.y))
    }break
    case 'canvas':{
      // this.dragNode.width = parseInt((event.pageX+this.shift.x)/this.scale)
      // this.dragNode.height = parseInt((event.pageY+this.shift.y)/this.scale)
    }break
  }
}

const delChart = () =>{
  // console.log("del Chart")
  store.commit("delChart",store.state.activeNode)
  bus.emit('optionChange')
}

const  changeChartZIndex = (offset) =>{
  // console.log("change Chart zIndex")
  store.state.activeNode.box.zIndex += offset
  bus.emit('optionChange')
}

</script>
  
  <style scoped>
    .mt_canvas{
      position: relative;
      margin-left: 20px;
      margin-top: 20px;
      background: #d6d5d5;
      background-size: auto;
      background-repeat: repeat;
    }
    .node_resize{
      cursor: nwse-resize;
      float: right;
      width: 24px;
      height: 24px;
      transform: rotate(268deg);
      margin-right: -21px;
      box-shadow: 0 2px 12px 0 rgba(255, 255, 255, 0);
      background-color: #ffffff;
      opacity: 0.2
    }

    .contextmenu {
      width: 100px;
      margin: 0;
      background: #fff;
      z-index: 3000;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    }
      .item {
        height: 35px;
        width: 100%;
        line-height: 35px;
        color: rgb(29, 33, 41);
        cursor: pointer;
    
      }
      .item:hover {
        background: rgb(229, 230, 235);
      }
    
  </style>
  