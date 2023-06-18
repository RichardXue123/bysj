import bar from './echarts/bar'
import barStack from './echarts/barStack'
import line from './echarts/line'
import text from './dom/text'

export default {
  initOptions: { // 初始化配置
    eCharts: {
      bar: bar.resource,
      barStack: barStack.resource,
      line: line.resource,
    },
    dom: {
      text: text.resource,
    },
  },
    configOptions: {// 右侧配置
      eCharts: {
        bar: bar.option,
        barStack:barStack.option,
        line:line.option,
      },
      dom: {
        text: text.option,
      },
    },
    
}