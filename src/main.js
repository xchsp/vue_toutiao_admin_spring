// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//注册组件库
Vue.use(ElementUI);

Vue.prototype.$axios = axios

// axios.defaults.baseURL = "http://111.230.181.206:3000"
axios.defaults.baseURL = 'http://127.0.0.1:8080/api'
// axios.defaults.baseURL = 'http://127.0.0.1:5000/api'

axios.interceptors.request.use((config) => {
  console.log(config.headers.Authorization)
  if (!config.headers.Authorization && localStorage.getItem('token')) {
    config.headers.Authorization = localStorage.getItem('token')
  }
  console.log(config.headers.Authorization)
  return config;
})

// 封装函数处理图片路径
Vue.prototype.$fixImgUrl = function (url) {
  if (url.indexOf("http") < 0) {
    return axios.defaults.baseURL.replace("api","") + url
  } else {
    return url
  }
}

// 全局路由守卫
router.beforeEach((to, from, next) => {
  if (to.path != '/login') {
    if (!localStorage.getItem('token')) {
      router.push('/login')
    } else {
      next()
    }
  } else {
    next()
  }

})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
