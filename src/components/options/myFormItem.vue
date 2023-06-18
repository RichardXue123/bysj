<template>
    <div>

        <span v-if="props.fItem.type==='number'">
            <el-inputNumber v-model="input" size="small"
                @change="watchNodeConfigChange"
            ></el-inputNumber> 
            {{props.fItem.unit || 'px'}}
        </span>

        <el-input v-else-if="props.fItem.type==='text'" 
            v-model="input" size="small"
            @change="watchNodeConfigChange"/>

        <el-input v-else-if="props.fItem.type==='textarea'" 
            v-model="input" type="textarea" rows={4} size="small"
            @change="watchNodeConfigChange"/>

        <el-switch v-else-if="props.fItem.type==='boolean'" v-model="input"
            @change="watchNodeConfigChange"
            >
            <el-icon><Check /></el-icon>
            <el-icon><Close /></el-icon>
        </el-switch>

        <el-select v-else-if="props.fItem.type==='select'"
            v-model="input"
            size="small" 
            @change="watchNodeConfigChange">
            <el-option
                v-for="item in props.fItem.data"
                :key="item.value"
                :label="item.text"
                :value="item.value"
            />
        </el-select>

        <div v-else-if="props.fItem.type==='div'"
            style="width:auto; height:props.fItem.style.height+'px'"
            >
        </div>

        <el-color-picker 
            v-else-if="props.fItem.type==='color'" 

            show-alpha 
            size="large"
            @change="watchNodeConfigChange"
            />

        <div v-else-if="props.fItem.type==='code'">
            <el-input 
              type="textarea"
              v-model="input"
              @change="watchNodeConfigChange"
              />
            <el-button @click="openDialog">
              查看详细
            </el-button>
        </div>


        <el-input
            v-else
            v-model="input"
            size="small"
            @change="watchNodeConfigChange">
        </el-input>

    </div>

    <el-dialog
    v-model="dialogVisible"
    draggable="true"
    title="查看详细属性"
    width="50%"
    zIndex="10"
  >
  <el-form :label-width="80">
    <el-input 
    type="textarea"
    style="height:300px"
    v-model="input"
    @change="watchNodeConfigChange"
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
  </el-dialog>

</template>

<script setup>
import { defineProps,onMounted,ref,onBeforeUpdate,onUpdated} from 'vue';
import { useStore } from 'vuex';
import bus from "@/utils/bus"

const store = useStore();
const input = ref()

let modelObj = null

const props = defineProps({
    fItem: Object,
    panel: Object,
})

const dialogVisible = ref(false);

const openDialog=()=>{
  dialogVisible.value = true
}

const getModelProp = (proPath, opNode) =>{
    modelObj = null
    const proDeep = proPath.split('/')
    proDeep.forEach(pro => {
        if (modelObj) {
            modelObj = modelObj[pro]
        } 
        else {
            modelObj = pro?opNode[pro]:opNode
        }
    })
    return modelObj
}

const watchNodeConfigChange = (event) => {
    // console.log("sth change")
    // console.log(event)
    modelObj[props.fItem.key] = event
    input.value = event

    // let panelArray = props.panel.key.split('/')
    // var tmp = store.state.activeNode

    // panelArray.forEach(pro => {
    //     if(tmp[pro]){
    //         tmp = tmp[pro]
    //     }
    //     else {
    //         // console.log(tmp)
    //     }
    // })
    // console.log("change")
    modelObj = getModelProp(props.panel.key, store.state.activeNode)
    modelObj[props.fItem.key] = event
    // tmp = modelObj
    update()
    
}

onMounted(()=>{
    if(store.state.activeNode.type == 'echarts'
    ||store.state.activeNode.type == 'text') {
      getNodeData(store.state.activeNode).then(data=>{
        // console.log(data)
        // console.log(newData)
        updateNodeData(store.state.activeNode,data)
      })
        modelObj = getModelProp(props.panel.key, store.state.activeNode)
        // console.log("input value:" + input.value)
        input.value=modelObj[props.fItem.key]
        
    }


    bus.on('activeNodeChange', () => {
    // 传参由回调函数中的形参接受
    // console.log("bus.on:activeNodeChange")
    update()
  })
})

const update = ()=>{
  if(store.state.activeNode.type == 'echarts'||store.state.activeNode.type=='text') {
    getNodeData(store.state.activeNode).then(data=>{
      // console.log(data)
      // console.log(newData)
      updateNodeData(store.state.activeNode,data)
    })
    modelObj = getModelProp(props.panel.key, store.state.activeNode)
    // input.value=modelObj[props.fItem.key]
  }
  
}

onBeforeUpdate(()=>{
    modelObj = getModelProp(props.panel.key, store.state.activeNode)
})

onUpdated(()=>{
    // console.log("on updated my formitem")
})

const getNodeData = (node) => {
  try {
    // console.log(node.data)
    if (node.data) {
      let promiseArray=[]
      node.data.source.forEach((c, i) => {
        switch (c.type) {
          case 2: { // json
            promiseArray.push(getDataByJson(c,i))
          }break;
          case 3: { // 接口
            promiseArray.push(getDataByApi(c,i))
          }break;
          default :
            break;
        }
      })
      // console.log(promiseArray)
      return Promise.all(promiseArray)
    } else {
      return Promise.resolve(null)
    }
  }catch (e){
    return Promise.reject(e)
  }
}

const getDataByJson = (c) =>{
  return new Promise((resolve,reject)=>{
    try {
      let res = typeof (c.json) === 'string' ? JSON.parse(c.json || null) : c.json
      // console.log(res)
      resolve(res)
    }catch (e){
      reject(e)
    }
  })
}

const getDataByApi = (c) =>{

    return new Promise((resolve,reject)=>{
    try {
        // console.log("get by api")
        // console.log(c.url)
        // 'http://106.15.51.165:3000/api/statistics/people'
         // 'http://106.15.51.165:3000/api/statistics/device'
        // console.log('http://106.15.51.165:3000/api/statistics/'+c.url)
        fetch('http://106.15.51.165:3000/api/statistics/'+c.url, {
        method: 'get'
        })
        .then(function(data){
            return data.text();
        }).then(function(data){
            // console.log(data)
            let Jsondata = JSON.parse(data)
            // console.log(Jsondata.body.pieces)
            // console.log(Jsondata.body.weeks)
            let newData = {}
            if(Jsondata.body.pieces) {
              newData = handleData(Jsondata.body.pieces)
            }
            else {
              newData = handleData(Jsondata.body.weeks)
            }
            // console.log(newData)
            resolve (newData)
        });
    }catch (e){
      reject(e)
    }
  })

}

const handleData=(data)=>{
    data = JSON.parse(data)
    // console.log(data)
    if(data.length == 0) {
        return []
    }
    else {
        let Data = []
        data.forEach(value=>{
            Data.push({"month":" ","value":value})
        })
        return Data
    }


}

const updateNodeData =(node,data) =>{
  let errMsgs = null
  
  // console.log("data:")
  // console.log(data)
  switch (node.data && node.data.coordinate) {
    case 'rightAngle': {
      errMsgs = setRightAngleData(node,data)
      break
    }
    // case 'gauge':
    // case 'pie': {
    //   errMsgs = setNoCoordinateData(data)
    //   break
    // }
    // case 'table': {
    //   errMsgs = setTableData(data)
    //   break
    // }
  }
  // console.log(node.data)
  return errMsgs
}

const setRightAngleData =(node,data) =>{
  
  // console.log("setRightAngleData data:")
  // console.log(data)
  let errMsgs = []
  if (node.data.source) {
    node.data.source.forEach((c, i) => {
      // console.log(c)
      if (c) {
        let inErrMsg = {index: i, warn: []}
        let sourceData = validateData(i, data[i], inErrMsg.warn)
        let xAxisData = []
        let yAxisData = []
        // console.log(sourceData)
        if (sourceData && sourceData.length > 0) {
          // if (!sourceData[0].hasOwnProperty.call(c.x)) {
          //   inErrMsg.warn.push('数据' + (i + 1) + '，x轴配置不正确')
          // }
          // if (!sourceData[0].hasOwnProperty.call(c.y)) {
          //   inErrMsg.warn.push('数据' + (i + 1) + '，y轴配置不正确')
          // }
          if (sourceData[0][c.x]==null) {
            inErrMsg.warn.push('数据' + (i + 1) + '，x轴配置不正确')
          }
          if (sourceData[0][c.y]==null) {
            inErrMsg.warn.push('数据' + (i + 1) + '，y轴配置不正确')
          }
          if (inErrMsg.warn.length === 0) {
            sourceData.forEach(k => {
              xAxisData.push(k[c.x])
              yAxisData.push(k[c.y])
            })
          }
        }
        if (inErrMsg.warn.length > 0) {
          errMsgs.push(inErrMsg)
        }
        // 赋值
        if (c.xto && xAxisData.length > 0) {
          setDataOptions(node, c.xto, xAxisData)
        }
        if (c.yto) {
          setDataOptions(node, c.yto, yAxisData)
        }
        if (c.sto) {
          setDataOptions(node, c.sto, c.s)
        }
      }
    })
  }
  // console.log(node)
  // setChartOption(node)
  return errMsgs.length > 0 ? errMsgs : null
}

// const setChartOption = (node) => {
  // console.log(node)
  // if (node.type === 'echarts' && node.data.source) {
  //   let cloneNode = JSON.parse(JSON.stringify(node))
  //   cloneNode.config.data.source.forEach((c, i) => {
  //     if ((!c.json && c.type === 2) || (!c.sql && c.type === 1) || !c.s) {
  //       cloneNode.config.options.series[i] = null
  //       cloneNode.config.options.legend.data[i] = null
  //     }
  //   })
  //   console.log(cloneNode)
  // }
// }

function setDataOptions (node, pro, data) {
  if (!(pro instanceof Array)) {
    pro = [pro]
  }
  // console.log(pro)
  pro.forEach(c => {
    try {
      // console.log(c.split('/'))
      if (c.split('/').length === 1) {
        node.options[c.split('/')[0]] = data
      } else if (c.split('/').length === 2) {
        node.options[c.split('/')[0]][c.split('/')[1]] = data
      } else if (c.split('/').length === 3) {
        node.options[c.split('/')[0]][c.split('/')[1]][c.split('/')[2]] = data
      } else if (c.split('/').length === 4) {
        node.options[c.split('/')[0]][c.split('/')[1]][c.split('/')[2]][c.split('/')[3]] = data
      } else if (c.split('/').length === 5) {
        node.options[c.split('/')[0]][c.split('/')[1]][c.split('/')[2]][c.split('/')[3]][c.split('/')[4]] = data
      } else if (c.split('/').length === 6) {
        node.options[c.split('/')[0]][c.split('/')[1]][c.split('/')[2]][c.split('/')[3]][c.split('/')[4]][c.split('/')[5]] = data
      }
    } catch (e) {
      // console.log("seet data error")
    }
  })
}

function validateData (i, data, warns) {

  if (data instanceof Array) {
    return data
  } else {
    try {
      return JSON.parse(data)
    } catch (e) {
      warns.push('数据' + (i + 1) + '，数据源配置不正确\n' + e)
      return null
    }
  }
}

</script>


<style scoped>
</style>
    