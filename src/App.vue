<template>
  <myEditor/>
</template>

<script>
import myEditor from './components/myEditor.vue'

export default {
  name: 'App',
  components: {
    myEditor
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
