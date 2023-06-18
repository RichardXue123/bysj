import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import store from './store'
import ECharts from 'vue-echarts'  // 引入ECharts
import "echarts";                  // 全局引入echarts
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //引入icons

const app = createApp(App)

app.component('ECharts',ECharts)
app.use(ElementPlus)
app.use(store)
app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
