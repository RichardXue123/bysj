<template>
    <div class="my_node" :style="nodeStyle" :id="props.node.id" >
        <el-image v-if="props.node.type==='image'" class="image" :src="props.node.options.src">
          <template #error>
            <div class="image-slot">
              <el-icon><icon-picture /></el-icon>
            </div>
          </template>
          图片</el-image>
        <div v-else-if="props.node.type==='div'" class="myDiv">方框</div>
        <el-button  v-else-if="props.node.type==='button'" class="button" 
          :type="props.node.options.buttonType" 
          :circle="props.node.options.circle"
          :round="props.node.options.round"
          :color="props.node.options.color" 
          >{{props.node.options.buttonName}}
        </el-button>
        <el-input v-else-if="props.node.type==='input'" class="input" placeholder="please input"></el-input>
        <e-charts  v-else-if="props.node.type==='echarts'" class="echarts" autoresize="true" :option="props.node.options"></e-charts>
        <XscText
          v-else-if="props.node.type==='text'"
          :options="props.node.options"  :theme="props.node.theme"
          ></XscText>
        <slot name="resize"></slot> 
        <!-- <el-button @click="getNodeData(props.node)">test1</el-button>
        <el-button @click="update">test2</el-button> -->
    </div>  
    
</template>

<script setup>
import XscText from './dom/XscText'
import { defineProps,computed} from 'vue';
import { Picture as IconPicture } from '@element-plus/icons-vue'


const props = defineProps({
    node: Object,
    view: Boolean
})
const nodeStyle = computed(() =>{
  // console.log(props.node)
    if (props.node) {
      if(props.node.type != 'echarts') 
      return {
        width: (props.node.box.width || 400) + 'px',
        height: (props.node.box.height || 300) + 'px',
        left: (props.node.box.x || 0) + 'px',
        top: (props.node.box.y || 0) + 'px',
        zIndex: (props.node.box.zIndex || 100)
      }
      else {
        return {
          width: (props.node.box.width || 400) + 'px',
          height: (props.node.box.height || 300) + 'px',
          left: (props.node.box.x || 0) + 'px',
          top: (props.node.box.y || 0) + 'px',
          zIndex: (props.node.box.zIndex || 100)
        }
      }

    } else {
      return {}
    }
    
})

</script>

<style scoped>
.my_node{
  display: inline-block;
  cursor: move;
  position: absolute;
  outline: none;
}
.image{
    width: 100%;
    height: 100%;
    background-size: auto;
    background-repeat: repeat;
}
.myDiv{
    width: 100%;
    height: 100%;
    background-size: auto;
    background-repeat: repeat;
}
.button{
    width: 100%;
    height: 100%;
    background-size: auto;
    background-repeat: repeat;
}
.input{
  width: 100%;
  height: 100%;
  background-size: auto;
  background-repeat: repeat;
}

.echarts {
  width: 100%;
  height: 100%;
  
}
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}

</style>