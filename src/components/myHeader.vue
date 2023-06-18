<template>
    <header class="header">
      <div class="header-con">
        <div class="block_header">
          <div class="logo"></div>
          <el-image 
            :src="logoUrl" 
            style="width:40px"
            :fit="scale-down">
          </el-image>
          <div class="title">MyLab</div>
        </div>
        <Divider type="vertical" />
        <div class="mtCanvasTool">
          <ButtonGroup>
            <el-button type="primary" @click="openCanvasDialogVisible=true"><el-icon><Operation /></el-icon>
              <el-text class="mx-1" style="color: white;">打开</el-text></el-button>
            <el-button type="primary" @click="addCanvasDialogVisible=true"><el-icon><CirclePlus /></el-icon>
              <el-text class="mx-1" style="color: white;">新增</el-text></el-button>
            <el-button type="primary" @click="delCanvasDialogVisible=true"><el-icon><Delete /></el-icon>
              <el-text class="mx-1" style="color: white;">删除</el-text></el-button>
            <el-button type="primary" @click="editCanvasDialogVisible=true"><el-icon><Edit /></el-icon>
              <el-text class="mx-1" style="color: white;">编辑</el-text></el-button>
            <el-button type="primary" @click="openJson"><el-icon><View /></el-icon>
              <el-text class="mx-1" style="color: white;">JSON</el-text>
            </el-button>
            <!-- <el-button type="primary" @click="fetchTest">
              test
            </el-button> -->
          </ButtonGroup>
        </div>
        <!-- <div class="mtCanvasInfo">
          当前canvas名称: {{canvasName}}
        </div>
        <div class="mtCanvasInfo">
          当前canvas类别: {{canvasType}}
        </div> -->
        
      </div>
    </header>



    <!-- 打开画布的弹窗 -->
    <el-dialog
        v-model="openCanvasDialogVisible"
        draggable="true"
        title="打开画布"
        width="52%"
        height="auto"
        append-to-body
      >
      <!-- <span>
        已保存画布:
      </span>

      <el-form :label-width="80">
        <el-formItem label="canvasName">
          <span></span>
        </el-formItem>
        <el-formItem v-for="(canvas,id) in store.state.canvasArray" :key="id" :label="canvas.name">
          <span>canvas.name</span>
        </el-formItem>
      </el-form> -->

      <el-table :data="canvasTableData" style="width: 720px" border>
        <el-table-column prop="id" label="序号" width="180" />
        <el-table-column prop="name" label="名称" width="180" />
        <el-table-column prop="size" label="大小"  width="180"/>
        
        <el-table-column             label="操作"  width="180">
          <template #default="scope">
          <el-button type="primary" @click="openCanvas(scope.row)">打开</el-button>
          <el-button type="danger" @click="delCurCanvas(scope.row)">删除</el-button>
        </template>
        </el-table-column>
      
      </el-table>

      

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="openCanvasDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="openCanvasDialogVisible = false">
            Confirm
          </el-button>
        </span>
      </template>
  </el-dialog>

    <!-- 新建画布的弹窗 -->
    <el-dialog
        v-model="addCanvasDialogVisible"
        draggable="true"
        title="新建画布"
        width="30%"
        height="auto"
        append-to-body
      >
      <el-form ref="formValidate" :model="addFrom" :rules="ruleValidate" :label-width="80">
        <el-formItem label="名称" prop="name">
          <el-input v-model="newCanvas.name" placeholder="输入画布名称"/>
        </el-formItem>
        <el-formItem label="宽度" prop="width">
          <el-inputNumber :max="10000" :min="1"  v-model="newCanvas.width" placeholder="输入画布宽度"/>
        </el-formItem>
        <el-formItem label="高度" prop="height">
          <el-inputNumber :max="10000" :min="1"  v-model="newCanvas.height" placeholder="输入画布高度"/>
        </el-formItem>
      </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addCanvasDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="addCanvas">
              Confirm
            </el-button>
          </span>
        </template>
  </el-dialog>

    <!-- 删除画布的弹窗 -->
    <el-dialog
        v-model="delCanvasDialogVisible"
        draggable="true"
        title="删除画布"
        width="30%"
        height="auto"
        append-to-body
      >
      <span>
        确定要删除当前画布吗？
      </span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="delCanvasDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="delCanvas">
              Confirm
            </el-button>
          </span>
        </template>
  </el-dialog>

  <!-- 编辑画布的弹窗 -->
  <el-dialog
      v-model="editCanvasDialogVisible"
      draggable="true"
      title="编辑当前画布"
      width="30%"
      height="auto"
      append-to-body
    >
    <el-form ref="formValidate" :model="addFrom" :rules="ruleValidate" :label-width="80">
      <el-formItem label="名称" prop="name">
        <el-input v-model="curCanvas.name" placeholder="编辑画布名称"/>
      </el-formItem>
      <el-formItem label="宽度" prop="width">
        <el-inputNumber :max="10000" :min="1"  v-model="curCanvas.width"/>
      </el-formItem>
      <el-formItem label="高度" prop="height">
        <el-inputNumber :max="10000" :min="1"  v-model="curCanvas.height"/>
      </el-formItem>
    </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editCanvasDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="editCanvas">
            Confirm
          </el-button>
        </span>
      </template>
  </el-dialog>

  <!-- 查看Json的弹窗 -->
  <el-dialog
      v-model="JsonDialogVisible"
      draggable="true"
      title="查看画布Json"
      width="50%"
      height="auto"
      append-to-body
    >
    <el-form :label-width="80">
      <el-input 
      type="textarea"
      style="height:auto"
      v-model="canvasObjString"
      autosize
      />
    </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="JsonDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="JsonDialogVisible = false">
            Confirm
          </el-button>
        </span>
      </template>
  </el-dialog>

</template>

<script setup>
import store from '@/store'
import {onMounted, ref} from 'vue'
import {
  Delete,
  CirclePlus,
  Edit,
  Operation,
  View
  // CaretRight,
} from '@element-plus/icons-vue'


const logoUrl = ref(
  'logo.png'
)

// const canvasName = ref("")
// const canvasType = ref("")
const JsonDialogVisible = ref(false)
const addCanvasDialogVisible = ref(false)
const delCanvasDialogVisible = ref(false)
const openCanvasDialogVisible = ref(false)
const editCanvasDialogVisible = ref(false)
const canvasObjString = ref(JSON.stringify(store.state.canvasObj))

const canvasTableData = ref([])

const newCanvas = ref({
  name:'新的画布',
  width:960,
  height:540
})

const curCanvas = ref({
  name:'',
  width:0,
  height:0
})

const ruleValidate = ref({
  name: { trigger: 'blur' },
  width: { type: 'number',  trigger: 'blur' },
  height: { type: 'number',  trigger: 'blur' }
})


const addCanvas=()=>{
  addCanvasDialogVisible.value=false
  let newId = 0;
  //id: 若一个canvas都没有，新建为0；若有：设置为最新的canvasId + 1
  if(store.state.canvasArray.length == 0) {
    newId = 0
  }
  else {
    newId = store.state.canvasArray[store.state.canvasArray.length-1].id + 1
  }

  let newCanvasObj =  {
    
      id: newId,
      name: newCanvas.value.name,
      data: [],
      options:{
        height:newCanvas.value.height,
        width:newCanvas.value.width,
        scale:1,
      }
  }
  // console.log("addCanvas")
  // console.log(newCanvasObj)
  store.commit("addCanvas",newCanvasObj)
  update()
}

const openCanvas=(canvas)=>{
  openCanvasDialogVisible.value=false
  changeCurCanvas(canvas)
}

const delCanvas=()=>{
  delCanvasDialogVisible.value=false
  // console.log("del cur canvas")
  // console.log(store.state.canvasObj)
  if(store.state.canvasObj.id!=null) {
    store.commit("delCurCanvasById",store.state.canvasObj.id)
  }
  else {
    // console.log("del cur canvas failed")
  }
  update()
}

const editCanvas=()=>{
  editCanvasDialogVisible.value=false
  if(store.state.canvasShow == false) {
    return
  }
  let editCanvasObj =  {
      id:store.state.canvasObj.id,
      name:curCanvas.value.name,
      data:store.state.canvasObj.data,
      options:{
        height:curCanvas.value.height,
        width:curCanvas.value.width,
        scale:store.state.canvasObj.options.scale,
      }
  }
  // console.log(editCanvasObj)
  store.commit("editCanvas",editCanvasObj)
  update()
}

//更改当前画布
const changeCurCanvas = (canvas) =>{
  // console.log("change cur canvas")
  // console.log(canvas.id)
  store.commit("changeCurCanvasById",canvas.id)
  update()
}

const delCurCanvas = (canvas) =>{
  // console.log("del cur canvas in table")
  // console.log(canvas.id)
  store.commit("delCurCanvasById",canvas.id)
  update()
  openCanvasDialogVisible.value=false
}

const openJson = ()=>{
  updateJson()
  JsonDialogVisible.value=true
}

const updateCurCanvas = () =>{
  // console.log(store.state.canvasObj)
  if(!store.state.canvasShow || store.state.canvasObj=={}) {
    // console.log("no cur canvas")
    curCanvas.value.name=''
    curCanvas.value.height=0
    curCanvas.value.width=0
  }
  else{
    curCanvas.value.name=store.state.canvasObj.name
    curCanvas.value.height=store.state.canvasObj.options.height
    curCanvas.value.width=store.state.canvasObj.options.width
  }

}

const updateJson = () =>{
  canvasObjString.value=JSON.stringify(store.state.canvasObj)
}

const updateCanvasTable = () =>{
  canvasTableData.value=[]
  // console.log(store.state.canvasArray)
  // console.log(store.state.canvasArray.length)
  if (store.state.canvasArray.length!=0) {
    
    store.state.canvasArray.forEach(canvas=>{
    canvasTableData.value.push({
        'id':canvas.id,
        'name':canvas.name,
        'size':canvas.options.width + ' x ' +canvas.options.height
      })
    })
  }

}


const update=()=>{
  // console.log("canvasArray")
  // console.log(store.state.canvasArray)
  // console.log("canvasObj")
  // console.log(store.state.canvasObj)
  // console.log("canvasShow")
  // console.log(store.state.canvasShow)
  // console.log(typeof store.state.canvasShow)
  updateCanvasTable()
  updateJson()
  updateCurCanvas()
}

onMounted(() => {
  update()
})

</script>

<style scoped>
  .header{
    width: 100%;
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header-con{
    height: 100%;
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
  }
  .block_header{
    display: inline-flex;
    justify-content: left;
    align-items: center;
  }
  .logo{
    display: inline-block;
    
    background-size: contain;
    width: 23px;
    height:23px;
  }
  .title{
    height: 100%;
    display: inline-block;
    font-size: 24px;
    font-weight: bold;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
    margin-left: 6px;
  }
  .mtCanvasTool,.mtEditorTool,.mtCanvasInfo{
    height: 100%;
    display: inline-block;
    margin-left: 6px;
  }
  .mtEditorTool
  {
    margin-right: 10px;
  }
  .mtCanvasInfo{
    margin-left: 18px;
  }
  .mtCanvasState,.mtCanvasName{
    display: inline-block;
    height: 49px;
  }
  .mtCanvasState{
    text-align: center;
  }
  .mtCanvasName{
    text-align: center;
    font-size: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .jsonPanel{
    height: 600px;
  }
  .download-panel {
    width: 100%;
    height: 210px;
  }
  .download-ul {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap:wrap;
  }
  .download-ul li{
    list-style: none;
    margin: 0px 30px;
    cursor: pointer;
  }
  .download-ul li:hover{
    background: #eeeeee70;
    border-radius: 10px;
  }
  .download-ul li img{
    width: 165px;
  }
  .download-ul li img,.download-ul li span{
    display: block;
    width: 170px;
  }
  .download-ul li span{
    text-align: center;
    font-size: 16px;
    height: 30px;
    line-height: 10px;
  }
  .header-icon-btn{
    margin-left: 5px;
  }
</style>
