<template>
    <div class="d_box_style" :style="boxStyle">
      <span :style="textStyle">{{props.options.text.content}}</span>
    </div>
</template>

<script setup>

import { defineProps,computed} from 'vue'

const props = defineProps({
  options:Object,
  theme: String
})

const textStyle = computed(()=>{
  console.log(props.options)
      return {
        'font-size': props.options.text.fontSize + 'px',
        'font-family': props.options.text.fontFamily,
        'font-weight': props.options.text.fontWeight,
        'color': props.options.text.color,
        'user-select':'none'
      }
})

const boxStyle = computed(()=>{
  return {
        'line-height': props.options.boxSpace.lineHeight + 'px',
        'text-align': props.options.boxSpace.textAlign,
        'background-color': props.options.background.color,
        'border-width': props.options.border.width + 'px',
        'border-top-style': props.options.border.style,
        'border-bottom-style': props.options.border.style,
        'border-left-style': props.options.border.style,
        'border-right-style': props.options.border.style,
        'border-color': props.options.border.color
      }
})

</script>

<style scoped>
  .d_box_style{
    width: 100%;
    height: 100%;
  }
</style>
