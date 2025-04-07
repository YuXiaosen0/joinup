import App from './App'

import uviewPlus from '@/uni_modules/uview-plus'

//条件编译（非Vue 3 环境）
// #ifndef VUE3
import Vue from 'vue'
//导入 Vue 和适配器,用于将某些 API 转换为 Promise 风格。
import './uni.promisify.adaptor'
import { createPinia } from 'pinia'; // Import pinia
const pinia = createPinia(); // Create pinia instance
Vue.config.productionTip = false
App.mpType = 'app'
//创建 Vue 实例并挂载
const app = new Vue({
  ...App
})
app.use(pinia)
app.$mount()
// #endif

//条件编译（Vue 3 环境）
// #ifdef VUE3
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'; // Import pinia
const pinia = createPinia(); // Create pinia instance
export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  app.use(uviewPlus)
  
  return {
    app
  }
}
// #endif