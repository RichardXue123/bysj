// import { assign } from 'core-js/core/object'
import { createStore } from 'vuex'
import bus from "@/utils/bus"
export default createStore({
  state: {
    //当前是否有canvas展示
    canvasShow: false,
    //所有canvas数组
    canvasArray:[],

    //当前活跃canvas
    canvasObj:{},

    //当前活跃node
    activeNode:{},

    //拖动元素信息
    dragingInfo : {
        id: 0,
        type: '',
        echartType: '',
        option:[]
    },

    curChartID : 0,
  },


  getters: {
    getNodebyId:(state)=>(id)=>{
      // console.log("vuex getNodebyId: " + id + ", node: " + state.canvasObj.data[id])
      return state.canvasObj.data[id]
    }
  },


  mutations: {
    //初始化
    init(state){
      // console.log(state.canvasArray.length)
      if(state.canvasArray.length==0) {
        //弹出提示：未有画布
        state.canvasShow = false
      }
      else {
        state.canvasObj = state.canvasArray[0]
        state.canvasShow = true
      }
    },

    //图表操作
    addChart(state,newChart){
        // console.log("add chart")
        state.canvasObj.data.push(newChart)
        state.activeNode = newChart
        // bus.emit('optionChange')
    },
    editChart(state,editedChart){
      // console.log("edit chart")
      // console.log(editedChart)
        state.canvasObj.data.splice(editedChart.id,1,editedChart)
        state.activeNode = state.canvasObj.data[editedChart.id]
        // console.log(state.canvasObj.data)
        // console.log(state.activeNode)
    },
    delChart(state,delChart){
      state.activeNode = {}
      // console.log("del chart")
      if(delChart) {
        state.canvasObj.data.splice(delChart.id,1)
        this.commit("rearrangeCanvasObj")
        // console.log("del finish")
        // console.log(state.canvasObj)
      }
      else {
        // console.log("del fail")
        // console.log(state.canvasObj.data)
      }
      // bus.emit('activeNodeChange')
    },
    rearrangeCanvasObj(state){
      state.canvasObj.data.forEach((item, index)=>{
        item.id = index;
      })
      state.curChartID = state.canvasObj.data.length
    },


    //拖动，menu,scale,option的互动

    changeDragingInfo(state,dragingInfo){
        state.dragingInfo = dragingInfo
        state.dragingInfo.id = state.curChartID
        state.curChartID = state.curChartID + 1
        // console.log("vuex: draging a new chart: " + state.dragingInfo.type + " id: " + state.dragingInfo.id)
    },
    changeClickOnType(state,type){
      state.clickOnType = type
      // console.log("vuex: clickOnType change into: " + state.clickOnType)
    },
    changeActiveNode(state,node){
      if(state.canvasObj.data[node.id]) {
          state.activeNode = state.canvasObj.data[node.id]
      }
      else {
        state.activeNode = {}
      }
      // console.log("vuex: activeNode change into: ")
      // console.log(state.activeNode)
      // console.log("bus.emit:optionChange")
      bus.emit('optionChange')
    },



    //画布操作
    addCanvas(state,canvas){
      // console.log("vuex: add new canvas")
      state.canvasArray.push(canvas)
      if(!state.canvasShow) {
        state.canvasShow=true;
      }
      state.canvasObj=canvas
    },

    editCanvas(state,canvas){
      // console.log("vuex: edit new canvas")
      // console.log(canvas)
      state.canvasArray.splice(canvas.id,1,canvas)
      // console.log(state.canvasArray)

      state.canvasObj=state.canvasArray[state.canvasObj.id]
    },


    delCanvas(state,canvas){
      // console.log("vuex: del new canvas")
      // console.log(canvas)
      state.canvasArray.splice(canvas.id,1)
    },

    // saveCanvas(state,canvas){
    //   console.log("vuex: save canvas")
    //   console.log(canvas)
    //   state.canvasArray.splice(canvas.id,1,canvas)
    // },

    changeCurCanvas(state,canvas){
      // console.log("vuex: change cur canvas")
      // console.log(canvas)

      //切换当前可视canvas前，保存当前canvas
      // state.canvasArray.splice(state.canvasObj.id,1,state.canvasObj)

      state.canvasObj = canvas
    },

    changeCurCanvasById(state,canvasId){
      // console.log("vuex: change cur canvas by id")
      // console.log(canvasId)
      if(state.canvasArray[canvasId]) {
        state.canvasObj = state.canvasArray[canvasId]
      }
    },

    delCurCanvasById(state,canvasId){
      // console.log("vuex: del cur canvas by id: "+canvasId)
      if(state.canvasObj.id == canvasId) {
        //if删除了当前展示canvas
        state.canvasShow = false;
        state.canvasObj = {}
      }
      if(state.canvasArray[canvasId]) {
        state.canvasArray.splice(canvasId,1)
        // console.log("del result:")
        // console.log(state.canvasArray)
      }
      
    },

    changeOpUpdateFlag(state,flag){
      // console.log("vuex: flag: "+flag)
      state.opUpdateFlag = flag
    },

  },
  actions: {
  },
  modules: {
  }
})