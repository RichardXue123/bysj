<template>
    <div class="myScale" ref="myScale">
      <div class="title">
        <div class="titleCon">画布广场</div>
        
        
      </div>

      <!-- <div class="canvas" ref="wrap"
          @drop="drop" @dragover.prevent
          @click.stop="createDom"
          >
      </div> -->
      <div ref="xscCanvas">
        
        <myXsc
          v-show="store.state.canvasShow"
          :charts="store.state.canvasObj.data" 
          @drop="drop"
          @dragover.prevent
          :style="canvasStyle"
        >
      </myXsc>
        <!-- <el-icon v-show="store.state.canvasShow"><Edit /></el-icon> -->
      </div>
    </div>

</template>

<script setup>
import {onMounted, onBeforeUnmount ,computed,ref} from 'vue'
import myXsc from './xsc/myXsc.vue'
import { useStore } from 'vuex'
import resources from '@/assets/js/resource/resources'
import bus from "@/utils/bus"

const newChart = ref()

const xscShow = ref(true)
const xscCanvas = ref(null)


const store = useStore();

const canvasStyle = computed(() =>{
  // console.log("computed canvasStyle")
  if (store.state.canvasShow) {
    // console.log(store.state.canvasObj.options.width)
    // console.log(store.state.canvasObj.options.height)
    return {
        width: store.state.canvasObj.options.width + 'px',
        height: store.state.canvasObj.options.height + 'px',
    }
  }
  else {
    return {
        width: '0px',
        height: '0px',
    }
  }

})

const drop = (event) => {
  //drop处理从menu拖进来的元素
  // console.log('drop')

  //这里就是包裹xsc的div，dom元素
  // console.log(xscCanvas.value)
  


  newChart.value = {}
  if(store.state.dragingInfo.type == 'echarts') {
    //类型为图表
    // console.log("dropping an echart")
    switch (store.state.dragingInfo.echartType) {
      case 'bar':
        newChart.value = JSON.parse(JSON.stringify(resources.initOptions.eCharts.bar))
        break;
      case 'barStack':
        newChart.value = JSON.parse(JSON.stringify(resources.initOptions.eCharts.barStack))
        break;
      case 'line':
        newChart.value = JSON.parse(JSON.stringify(resources.initOptions.eCharts.line))
        break;
      default:
        break;
    }
    // console.log(newChart)
    newChart.value.id = store.state.dragingInfo.id,
    // console.log(store.state.dragingInfo.id)
    newChart.value.type = store.state.dragingInfo.type,
    newChart.value.echartType = store.state.dragingInfo.echartType,
    newChart.value.box.x = parseInt(event.clientX - xscCanvas.value.getBoundingClientRect().x)
    newChart.value.box.y = parseInt(event.clientY - xscCanvas.value.getBoundingClientRect().y)
  }
  else if(store.state.dragingInfo.type == 'text') {
    //类型为文本
    // console.log("dropping a text")
    // console.log(resources.initOptions.dom.text)
    newChart.value = JSON.parse(JSON.stringify(resources.initOptions.dom.text))
    // console.log(newChart)
    newChart.value.id = store.state.dragingInfo.id,
    // console.log(store.state.dragingInfo.id)
    newChart.value.type = store.state.dragingInfo.type,
    newChart.value.echartType = store.state.dragingInfo.echartType,
    newChart.value.box.x = parseInt(event.clientX - xscCanvas.value.getBoundingClientRect().x)
    newChart.value.box.y = parseInt(event.clientY - xscCanvas.value.getBoundingClientRect().y)
  }
  else if(store.state.dragingInfo.type == 'button') {
    //类型为按钮
    // console.log("dropping a button")
    newChart.value = {
      id: store.state.dragingInfo.id,
      type: store.state.dragingInfo.type,
      echartType: '',
      box:{
          x: parseInt(event.clientX - xscCanvas.value.getBoundingClientRect().x),
          y: parseInt(event.clientY - xscCanvas.value.getBoundingClientRect().y),
          width:100,
          height:30,
          zIndex:2
      },
      config: {

      },
      options:{
        circle: false,
        round: false,
        buttonType: '',
        buttonName: '按钮',
      }
    }
  }
  else {
    //类型为其他
    newChart.value = {
      id: store.state.dragingInfo.id,
      type: store.state.dragingInfo.type,
      echartType: '',
      box:{
          x: parseInt(event.clientX - xscCanvas.value.getBoundingClientRect().x),
          y: parseInt(event.clientY - xscCanvas.value.getBoundingClientRect().y),
          width:100,
          height:100,
          zIndex:1
      },
      config: {

      },
      options:{}
    }
  }

  store.commit('addChart',newChart)
  bus.emit('optionChange')
}


// const nodeActive = (item) => {
//   //向myEditor传值，提示myOptions更新options
//   console.log("node active :")
//   console.log(item)
//   emits('nodeActive',item)
// }

// const nodeMoving = (item) => {
//   console.log("node moving on canvas: "+ item.type)
//   console.log(item.id)
//   store.commit('changeIsCanvasObject',item.id)
// }

// const nodeEditing = (item) => {
//   //bug
//   console.log("node editing:" + item.id)
//   store.commit("editChart",item)
//   emits('nodeEditing',item)
//   console.log("bus.emit:optionChange")
//   bus.emit('optionChange')
// }

const update = ()=>{
  xscShow.value = store.state.canvasShow
}

onMounted(()=>{
    update()
})
onBeforeUnmount(()=>{

})

</script>


<style scoped>
  .myScale{
    position: relative;
    overflow: hidden;
    flex: 1;
    display: inline-flex;
    flex-flow: column;
    justify-content: flex-start;
    background-color: #909399;
    height: 850px;
  }
  .title{
    text-align: left;
    height: 39px;
    line-height: 39px;
    background: #f5f5f5;
    border-bottom: 1px solid #ddd;
  }
  .titleCon{
    font-size: 16px;
    font-weight: bold;
    margin-left: 20px;
    color: #2c3e50;;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  .background{
    margin-left: 20px;
    margin-top: 20px;
    width: 1000px;
    height: 580px;
    background: #828282;
  }
  .canvas{
    
  }
  .img{
    width: 100px;
    height: 100px;
  }
  .boxDom {
    width: 40px;
    height: 40px;
    background: red;
    position: absolute;
  }
</style>
    