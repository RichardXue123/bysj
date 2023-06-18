<template>
  <div class="options">
    <div class="title">
      <div class="titleCon">参数配置</div>
    </div>
      <el-tabs
      type="card"
      class="options-tabs"
      v-if="store.state.canvasShow">
      <el-tab-pane label="基本" name="first">
        
        <div v-if="opNode.type==='image'
                  ||opNode.type==='button'
                  ||opNode.type==='input'
                  ||opNode.type==='echarts'
                  ||opNode.type==='text'">
          <div>
            <span v-if="opNode.type==='image'">
              这是一张图片
            </span>
            <span v-else-if="opNode.type==='button'">
              这是一个按钮
            </span>
            <span v-else-if="opNode.type==='echarts'">
              这是一个图表
            </span>
            <span v-else-if="opNode.type==='input'">
              这是一个输入框
            </span>
            <span v-else-if="opNode.type==='text'">
              这是一个文本
            </span>
          </div>

          <el-form label-width="80">
            <el-formItem label="X坐标" >
              <el-inputNumber :max="10000" :min="-1000"  v-model="inputX" @change="updateNodeBox" placeholder="输入X坐标"/>
            </el-formItem>
            <el-formItem label="Y坐标" >
              <el-inputNumber :max="10000" :min="-1000" v-model="inputY" @change="updateNodeBox" placeholder="输入Y坐标"/>
            </el-formItem>
            <el-formItem label="宽度" >
              <el-inputNumber :max="10000" :min="1" v-model="inputWidth" @change="updateNodeBox" placeholder="输入宽度"/>
            </el-formItem>
            <el-formItem label="高度" >
              <el-inputNumber :max="10000" :min="1" v-model="inputHeight" @change="updateNodeBox" placeholder="输入高度"/>
            </el-formItem>
            <el-formItem label="zIndex" >
              <el-inputNumber :max="10" :min="1" v-model="inputZIndex" @change="updateNodeBox" placeholder="输入zIndex"/>
            </el-formItem>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="数据" name="second">
        <el-tabs v-show="opNode.type==='echarts'||opNode.type==='text'" type="card" class="options-tabs">
          <el-tab-pane v-for="(tab,ti) in echartsOptionConfig" :key="ti" :label="tab.type" :icon="tab.icon">
            <el-collapse class="xslab-collapse" accordion>
              <el-collapse-item v-for="(panel,pi) in tab.con" :name="pi.toString()" :key="pi" :title="panel.name">
                <el-form label-position="left" label-width="auto">
                  <el-formItem v-for="(fItem,fi) in panel.sub"  :key="fi" :label="fItem.name">
                    <myFormItem :fItem="fItem" :panel="panel"
                    ></myFormItem>
                  </el-formItem>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
        <div v-if="opNode.type==='image'">
          <span>
            这是一张图片
          </span>
          <el-form :label-width="80">
            <el-formItem label="素材地址" >
              <el-input 
              type="textarea" 
              v-model="inputImageSrc" @change="updateNodeOption" placeholder="输入图片src"/>
            </el-formItem>

            <span>
              常用图片素材
            </span>
            <el-collapse accordion>
              <el-collapse-item title="background" name="1">
                <ul v-infinite-scroll="loadImage" infinite-scroll-immediate class="infinite-list" style="overflow: auto">           
                  <li v-for="(imageSource, index) in imageSrcArray.background" :key="index" class="infinite-list-item">
                    {{ index }}
                    <el-image class="infiniteImage" :src="imageSource.replace(/./,'images/background')" @click="setInputImageSrc(imageSource.replace(/./,'images/background'))">
                    </el-image>
                  </li>
                </ul>
              </el-collapse-item>
              <el-collapse-item title="button" name="2">
                <ul v-infinite-scroll="loadImage" infinite-scroll-immediate class="infinite-list" style="overflow: auto">           
                  <li v-for="(imageSource, index) in imageSrcArray.button" :key="index" class="infinite-list-item">
                    {{ index }}
                    <el-image class="infiniteImage" :src="imageSource.replace(/./,'images/button')" @click="setInputImageSrc(imageSource.replace(/./,'images/button'))">
                    </el-image>
                  </li>
                </ul>
              </el-collapse-item>
              <el-collapse-item title="icon" name="3">
                <ul v-infinite-scroll="loadImage" infinite-scroll-immediate class="infinite-list" style="overflow: auto">           
                  <li v-for="(imageSource, index) in imageSrcArray.icon" :key="index" class="infinite-list-item">
                    {{ index }}
                    <el-image class="infiniteImage" :src="imageSource.replace(/./,'images/icon')" @click="setInputImageSrc(imageSource.replace(/./,'images/icon'))">
                    </el-image>
                  </li>
                </ul>
              </el-collapse-item>
              <el-collapse-item title="panel" name="4">
                <ul v-infinite-scroll="loadImage" infinite-scroll-immediate class="infinite-list" style="overflow: auto">           
                  <li v-for="(imageSource, index) in imageSrcArray.panel" :key="index" class="infinite-list-item">
                    {{ index }}
                    <el-image class="infiniteImage" :src="imageSource.replace(/./,'images/panel')" @click="setInputImageSrc(imageSource.replace(/./,'images/panel'))">
                    </el-image>
                  </li>
                </ul>
              </el-collapse-item>
              <el-collapse-item title="tab" name="5">
                <ul v-infinite-scroll="loadImage" infinite-scroll-immediate class="infinite-list" style="overflow: auto">           
                  <li v-for="(imageSource, index) in imageSrcArray.tab" :key="index" class="infinite-list-item">
                    {{ index }}
                    <el-image class="infiniteImage" :src="imageSource.replace(/./,'images/tab')" @click="setInputImageSrc(imageSource.replace(/./,'images/tab'))">
                    </el-image>
                  </li>
                </ul>
              </el-collapse-item>
              <el-collapse-item title="others" name="6">
                <ul v-infinite-scroll="loadImage" infinite-scroll-immediate class="infinite-list" style="overflow: auto">           
                  <li v-for="(imageSource, index) in imageSrcArray.others" :key="index" class="infinite-list-item">
                    {{ index }}
                    <el-image class="infiniteImage" :src="imageSource.replace(/./,'images/others')" @click="setInputImageSrc(imageSource.replace(/./,'images/others'))">
                    </el-image>
                  </li>
                </ul>
              </el-collapse-item>
            </el-collapse>

            <span>
              我的图片素材
            </span>
            <el-upload
              :class="'upload_wrapper ' + (hideUpload ? 'hide' : '')"
              list-type="picture-card"
              :limit="3"
              :file-list="fileList"
              :show-file-list="true"
              :on-change="fileChange"
              :auto-upload="false"
              accept="image/*"
            >
              <el-icon>
                <Plus />
              </el-icon>
              <template #file="{ file }">
                <div>
                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                      <el-icon>
                        <zoom-in />
                      </el-icon>
                    </span>
                    <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </span>
                  </span>
                </div>
              </template>
            </el-upload>
            <el-dialog v-model="dialogVisible2">
              <img w-full class="full_img" :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>

          </el-form>

        </div>
        <div v-else-if="opNode.type==='echarts'">
          <span>
            这是一个图表
          </span>
          <!-- <el-form>
            <el-formItem label="图表配置" >
              <el-input 
              type="textarea"
              v-model="inputEchartsOption"
              @change="updateNodeOption" 
              placeholder="输入图表配置"/>
              <el-button @click="openEchartsDialog">
                打开详细数据面板
              </el-button>
            </el-formItem>
          </el-form> -->
        </div>
        <div v-else-if="opNode.type==='button'">
          <span>
            这是一个按钮
          </span>
          <el-form :label-width="80">
            <el-formItem  label="颜色">
              <el-select v-model="inputButtonType" class="m-2" placeholder="Select" size="small"
              @change="setButtonType"
              >
                <el-option
                  v-for="item in buttonTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-formItem>
            <el-formItem  label="形状">
              <el-select v-model="inputButtonShape" class="m-2" placeholder="Select" size="small"
              @change="setButtonShape"
              >
                <el-option
                  v-for="item in buttonShapes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-formItem>
            <el-formItem  label="文字">
              <el-input style="width:auto"  v-model="inputButtonName" placeholder="buttonName" size="small"
              @change="setButtonName"
              >
              </el-input>
            </el-formItem>
          </el-form>
        </div>
        <div v-else-if="opNode.type==='input'">
          <span>
            这是一个输入框
          </span>
        </div>
        <div v-else-if="opNode.type==='text'">
          <span>
            这是一个文本
          </span>
        </div>

      </el-tab-pane>
    </el-tabs>

    <!-- <el-dialog
      v-model="dialogVisible"
      draggable="true"
      title="编辑Echarts详细属性"
      width="50%"
      zIndex="10"
    >
    <el-form :label-width="80">
      <el-input 
      type="textarea"
      style="height:300px"
      v-model="inputEchartsOption"
      @change="updateNodeOption" 
      autosize
      placeholder="输入配置"/>
    </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog> -->

  </div>
</template>
  
<script setup>
import { useStore } from 'vuex'
import { ref, defineExpose ,onMounted, onBeforeMount} from 'vue'
import resources from '../assets/js/resource/resources'
import myFormItem from './options/myFormItem.vue'
import bus from "@/utils/bus"

const store = useStore()

const opNode = ref()

// const imageSrcArray = {
//   data:imageSrc.data
// }
const imageSrcArray = ref({
  tab:[],
  icon:[],
  button:[],
  background:[],
  panel:[],
  others:[]
})

//输入的绑定

//基本元素
const inputX = ref(100)
const inputY = ref(100)
const inputWidth = ref(100)
const inputHeight = ref(100)
const inputZIndex = ref(10)

//图片
const inputImageSrc = ref("")

//按钮
const inputButtonType= ref('')
const inputButtonShape= ref('')
const inputButtonName= ref('')

const echartsOptionConfig = ref([])

const dialogVisible = ref(false)
// const value = ref('')

const buttonTypes = [
  {
    value: '',
    label: 'Default',
  },
  {
    value: 'primary',
    label: 'Primary',
  },
  {
    value: 'success',
    label: 'Success',
  },
  {
    value: 'info',
    label: 'Info',
  },
  {
    value: 'warning',
    label: 'Warning',
  },
  {
    value: 'danger',
    label: 'Danger',
  },
]

const buttonShapes = [
  {
    value: '',
    label: 'Default',
  },
  {
    value: 'round',
    label: 'Round',
  },
  {
    value: 'circle',
    label: 'Circle',
  }
]


// let curShowChart =ref({})

const lastType = ref('')
const count = ref(4)

//图片上传



const loadImage = (type) => {
  if(type != lastType.value) {
    count.value = 4
    lastType.value = type
  }
  count.value += 2
  // console.log(type)
  // console.log("current load count: "+ count.value)
  // console.log(imageSrcArray.value[type][count.value-1])
  // console.log(imageSrcArray.value[type][count.value])
}


// const openEchartsDialog = () => {
//   dialogVisible.value = true
// }

const setButtonType = () => {
  if(opNode.value.type == 'button') {
    opNode.value.options.buttonType = inputButtonType.value
  }
  uploadOpNode()
}
const setButtonShape = () => {
  if(opNode.value.type == 'button') {
    switch (inputButtonShape.value) {
      case '':
        opNode.value.options.round = false
        opNode.value.options.circle = false
        break;
      case 'circle':
        opNode.value.options.round = false
        opNode.value.options.circle = true
        break;
      case 'round':
        opNode.value.options.round = true
        opNode.value.options.circle = false
        break;
      default:
        break;
    }
  }
  uploadOpNode()
}
const setButtonName = () => {
  if(opNode.value.type == 'button') {
    opNode.value.options.buttonName = inputButtonName.value
  }
  uploadOpNode()
}


const setInputImageSrc = (src) => {
  inputImageSrc.value = src
  // console.log("input image src change into: ")
  // console.log(inputImageSrc.value)
  if(opNode.value.type == 'image') {
    opNode.value.options.src = inputImageSrc.value
  }
  uploadOpNode()
}

//更新右侧参数配置下的内容
const updateOption = () => {
  // console.log("update options begin")
  // console.log("cur active node:")
  // console.log(opNode.value.type)

  if(!opNode.value.type) {
    // console.log("options: no active node")
    return
  }
  //赋值基本属性
  inputX.value = opNode.value.box.x
  inputY.value = opNode.value.box.y
  inputWidth.value = opNode.value.box.width
  inputHeight.value = opNode.value.box.height
  inputZIndex.value = opNode.value.box.zIndex
  switch (opNode.value.type) {
    case 'echarts':
      // console.log("this is an echart")
      // console.log(opNode.value.options)
      // inputEchartsOption.value = JSON.parse(JSON.stringify(opNode.options))
      // curShowChart.value = JSON.parse(JSON.stringify(opNode))
      // console.log(curShowChart.value)
      switch (opNode.value.echartType) {
        case 'bar':
          echartsOptionConfig.value = JSON.parse(JSON.stringify(resources.configOptions.eCharts.bar.config))
          break;
        case 'barStack':
          echartsOptionConfig.value = JSON.parse(JSON.stringify(resources.configOptions.eCharts.barStack.config))
          break;
        case 'line':
          echartsOptionConfig.value = JSON.parse(JSON.stringify(resources.configOptions.eCharts.line.config))
          break;
        default:
          echartsOptionConfig.value = []
          break;
      }
      break;
    case 'text':
      // console.log("this is a text")
      echartsOptionConfig.value = JSON.parse(JSON.stringify(resources.configOptions.dom.text.config))
      break;
    case 'image':
      // console.log("this is an image")

      inputImageSrc.value = opNode.value.options.src

      break;
    case 'button':
      // console.log("this is a button")
      inputButtonName.value = opNode.value.options.buttonName
      inputButtonType.value = opNode.value.options.buttonType
      if(opNode.value.options.circle) {
        inputButtonShape.value = 'circle'
      }
      else if(opNode.value.options.round) {
        inputButtonShape.value = 'round'
      }
      else {
        inputButtonShape.value = ''
      }
      
      break;
    default:
      break;
  }
  store.commit('editChart',opNode.value)

}

const updateNodeBox = () => {
  //更新右侧参数配置下的内容
    opNode.value.box = {
      x:inputX,
      y:inputY,
      width:inputWidth,
      height:inputHeight,
      zIndex:inputZIndex
    }
    uploadOpNode()
}



onBeforeMount(()=>{
  //加载图片信息
  // console.log("options on before mount")
  // console.log("loading image source")
  imageSrcArray.value.background = require.context('../../public/images/background', true, /.png$/).keys();
  imageSrcArray.value.button = require.context('../../public/images/button', true, /.png$/).keys();
  imageSrcArray.value.icon = require.context('../../public/images/icon', true, /.png$/).keys();
  imageSrcArray.value.others = require.context('../../public/images/others', true, /.png$/).keys();
  imageSrcArray.value.panel = require.context('../../public/images/panel', true, /.png$/).keys();
  imageSrcArray.value.tab = require.context('../../public/images/tab', true, /.png$/).keys();
	// console.log(imageSrcArray.value)
  
})

onMounted(()=>{
  updateOpNode()
  updateOption()
  bus.on('optionChange', () => {
    // console.log("bus.on:optionChange")
    updateOpNode()
    updateOption()
    bus.emit('activeNodeChange')
  })
})

defineExpose({
  updateOption
})

const updateOpNode = () => {
  opNode.value = JSON.parse(JSON.stringify(store.state.activeNode))
}

const uploadOpNode = () => {
  store.commit('editChart',opNode.value)
}



///////
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue";

const fileList = ref([]); // 图片列表
const dialogImageUrl = ref(""); // 预览图url
const dialogVisible2 = ref(false); // 预览弹窗
const hideUpload = ref(false); // 是否隐藏上传按钮
// 更新上传加号按钮显示状态
function updateUploadShown() {
  if (fileList.value.length == 3) {
    hideUpload.value = true;
  } else {
    hideUpload.value = false;
  }
}
// 文件改变
function fileChange(file, resfileList) {
  fileList.value = resfileList;
  updateUploadShown();
}
// 移除图片
const handleRemove = (file) => {
  const list = fileList.value;
  for (const i in list) {
    if (list[i].uid === file.uid) {
      list.splice(i, 1);
    }
  }
  fileList.value = list;
  updateUploadShown();
}
// 预览图片
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
}

///////

</script>

<style scoped>
  .options {
    width: 300px;
    background: #f5f5f5;
    border-left: 1px solid #ddd;
    overflow:auto;
    z-index: 2;
    box-shadow: -2px 0px 2px 0 rgba(0, 0, 0, 0.1);
  }
  .title{
    text-align: right;
    height: 39px;
    line-height: 39px;
    border-bottom: 1px solid #dddddd;
  }
  .titleCon{
    font-size: 16px;
    font-weight: bold;
    margin-right: 20px;
    color: #2c3e50;;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
    text-align: left;
  }
  .xslab-tabs{
    
  }
  .ivu-collapse {
    border-right: none;
    border-left: none;
  }
  .ivu-collapse-content{
    margin-right: 16px;
  }
  .mt_panel_title{
    display: inline-block;
  }
  .mt_panel_title_control{
    margin-left: 148px;
  }
  .xslab-collapse{
    background: #fff;
    border-color: #dcdee2;
  }
  .ivu-collapse>.ivu-collapse-item{
    border-color: #dcdee2;
  }
  .titleCon{
    margin-left:20px ;
    margin-right: 20px;
  }
  .tableContainer{
    overflow: auto;
    display: flex;
    height: 400px;
  }
  .ivu-modal-body{
    padding: 0px 10px;
  }
  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width:6px;
    height:6px;
  }
  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    border-radius:0px;
  }
  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius:0px;
    background:none;
  }
  ::-webkit-scrollbar-thumb:window-inactive {
    background:none;
  }
  .infinite-list {
    height: 500px;
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .infinite-list .infinite-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    background: var(--el-color-primary-light-9);
    margin: 10px;
    color: var(--el-color-primary);
  }
  .infinite-list .infinite-list-item + .list-item {
    margin-top: 10px;
  }

  .infiniteImage{
    max-height: 80px;
    max-width: 80px;
    min-width: 30px;
    min-height: 30px;
    height: auto;
    width: auto;
    text-align: 'right';
  }

  .xslab-collapse{
    background: #fff;
    border-color: #dcdee2;
  }

  .xslab-tabs{
    background: #f5f5f5;
    width: 300px;
  }

  .options-tabs{
    background: #f5f5f5;
    width: 300px;
  }
  .upload_wrapper{
    background: #f5f5f5;
    width: auto;
    height: auto;
  }

</style>
  