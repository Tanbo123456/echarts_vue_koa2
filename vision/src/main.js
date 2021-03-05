import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios' 

import "./assets/css/global.less"
import './assets/font/iconfont.css'
// 引入 sockect 连接ws服务器
import Socket from "./utils/socket";
Socket.Instance.connect()

// 挂载到Vue实例上
Vue.prototype.$socket = Socket.Instance
Vue.prototype.$echarts = window.echarts
// console.log(window.echarts)
axios.defaults.baseURL = 'http://localhost:8888/api/'
Vue.prototype.$ajax = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
