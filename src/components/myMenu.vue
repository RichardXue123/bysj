<template>
    <div class="menu">
      <div class="title">
        <div class="titleCon">组件列表</div>
      </div>
      <div>
        <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><TrendCharts /></el-icon>
            <el-text class="mx-1" size="large">图表</el-text>
          </template>
          <el-menu-item index="1-1" draggable="true" @dragstart="dragstart('echarts','bar')">
            <!-- <el-icon><CaretRight /></el-icon> -->
            简单柱状图
            <el-image :src="echartsIconUrlArray['bar']"
              :key="contain"
            />
          </el-menu-item>
          <el-menu-item index="1-2" draggable="true" @dragstart="dragstart('echarts','barStack')">
            堆叠柱状图
            <el-image :src="echartsIconUrlArray['barStack']"
              :key="fill"
            />
          </el-menu-item>
          <el-menu-item index="1-3" draggable="true" @dragstart="dragstart('echarts','line')">
            简单折线图
            <el-image :src="echartsIconUrlArray['line']"
              :key="fill"
            />
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><Document /></el-icon>
            <el-text class="mx-1" size="large">文本</el-text>
          </template>
          <el-menu-item index="2-1" draggable="true" @dragstart="dragstart('text')">
            显示文本
            <el-image :src="textIconUrl"
            :key="contain"
          />
          </el-menu-item>
          <el-menu-item index="2-2" draggable="true" @dragstart="dragstart('input')">
            输入文本
            <el-input style="margin-left:10px" disabled placeholder="输入框"
            
            ></el-input>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
            <template #title>
              <el-icon><Picture /></el-icon>
              <el-text class="mx-1" size="large">图片</el-text>
            </template>
            <el-menu-item index="3-1" draggable="true" @dragstart="dragstart('image')">基础图片
              <el-image :src="imageIconUrl" 
              :fit="scale-down"
              />

            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              <el-icon><Pointer /></el-icon>
              <el-text class="mx-1" size="large">按钮</el-text>
            </template>
            <el-menu-item index="4-1" draggable="true"  @dragstart="dragstart('button')">
              基础按钮
              <el-button :src="imgUrl" 
              style="margin-left:10px"
              >
              按钮
              </el-button>
            </el-menu-item>
          </el-sub-menu>
      </el-menu>
      </div>
    </div>
</template>

<!-- <script> -->
<script setup>
import { ref } from "vue";
import {
  TrendCharts,
  Document,
  Picture,
  Pointer,
  // CaretRight,
} from '@element-plus/icons-vue'
import { useStore } from 'vuex'

//vue2写法
// export default {
//   name: 'myMenu',
//     data() {
//       return {
//         imgUrl:imgUrl,
//       }
//   },
//   methods: {
//         dragstart(event) {
//           console.log("dragStart",event)
//           // console.log(imgUrl)
//           event.dataTransfer.setData('imgInfo',imgUrl)
//           let newChart = {
//             id: (new Date()).valueOf(),
//             type: "image",
//             config: {
//               box:{
//                 x:98,
//                 y:97,
//                 width:100,
//                 height:100,
//                 zIndex:100
//               }
//             }
//           }
//           //dataTransfer传参
//           event.dataTransfer.setData('newChart',newChart)
//           console.log("message send: " + newChart)
//           console.log("start clientX: " + event.clientX)
//           console.log("start clientY: " + event.clientY)
//           // event.dataTransfer.setData('startX',imgUrl)
//           // event.dataTransfer.setData('imgInfo',imgUrl)
//           // event.dataTransfer.setData('imgInfo',imgUrl)


//           //vuex传参
          
//         }
//   },
// }
const imageIconUrl = ref(
  'chartsPic/dom_img.png'
)
const textIconUrl = ref(
  'chartsPic/dom_text.png'
)



const echartsIconUrlArray = ref(
  {
    'bar':'chartsPic/bar_simple.png',
    'barStack':'chartsPic/bar_stack.png',
    'line':'chartsPic/line_simple.png'
  }
)

let curID = 0
const store = useStore();

const dragstart = (event,echartType) =>{

  let dragingInfo = {
    id: curID,
    type: event,
    echartType: echartType
  }
  curID = curID+1
  
  store.commit('changeDragingInfo',dragingInfo)
  
}

</script>

<style scoped>
  .menu{
    position: relative;
    width: 200px;
    height: auto;
    background: #f5f5f5;
    border-right: 1px solid #ddd;
    box-shadow: 2px 0px 2px 0 rgba(0, 0, 0, 0.1);
    z-index: 2;
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


</style>