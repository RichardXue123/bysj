<template>
  <div class="mt-editor">
    <div class="mt-editor-header">
      <mtHeader>
      </mtHeader>
    </div>
    <div class="mt-editor-layout">
      <mtMenu></mtMenu>
      <mtScale
      ></mtScale>
      <mtOptions
        ref="optionsRef"
      ></mtOptions>
    </div>
  </div>

</template>

<script setup>
import store from '@/store'
import mtHeader from './myHeader'
import mtMenu from './myMenu'
import mtOptions from './myOptions'
import mtScale from './myScale.vue'
import {ref,onBeforeMount} from 'vue'

const optionsRef = ref(null)

onBeforeMount(() => {
  init()
})

const init = () => {
  // store.state.canvasObj = store.state.canvasArray[0]
  // console.log("init begin")
  store.commit("init")
  // console.log("init finish")
}

// const nodeActive = (item) => {
//   // console.log("my Editor active node : "+item.type+", node num : "+item.id)
//   store.commit("changeActiveNode",item)
//   optionsRef.value.updateOption()
// }

// const nodeEditing = (item) => {
//   // console.log("my Editor node editing : "+item.type+", node num : "+item.id)
//   store.commit("changeActiveNode",item)
//   store.commit("editChart",item)
//   optionsRef.value.updateOption()
// }

</script>
<style scoped>
  .mt-editor {
    display: flex;
    flex-flow: column;
    height: 100%;
    justify-content: flex-start;
  }
  .mt-editor-header{
    border-bottom: 1px solid #ddd;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
    z-index: 2;
  }
  .mt-editor-layout{
    display: flex;
    height: calc(100% - 50px);
    flex-flow: row;
    justify-content: flex-start;
  }
  .ivu-form-item{
    margin-bottom: 20px !important;
  }
  .canvasUrlContent{
    height: 270px;
    margin: 0 auto;
  }
  .canvasUrlQRCode,.canvasUrlText{
    display: block;
  }
  .canvasUrlQRCode{
    width: 200px;
    height: 200px;
    background: red;
    margin: 0 auto;
  }
  .canvasUrlText{
    text-align: center;
    margin-top: 10px;
  }
  .canvasUrlText span{
    display: inline-block;
    height: 24px;
    background: #ddd;
    padding: 4px 18px;
    border-radius: 4px;
    line-height: 16px;
    position: relative;
    top: 1px;
    text-shadow: 1px 1px 0px #fdfdfd;
    max-width: 400px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .canvasUrlText button{
    display: block;
    margin: 8px auto 0px auto;
  }
</style>
  