// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import App from './App'
import router from './router'
import global from "./js/global"
import sevice from "./axios"
import echarts from 'echarts'
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import commonJs from "./js/common"
Vue.config.productionTip = false;
Vue.prototype.baseUrl = global.baseUrl;
Vue.prototype.$ajax = sevice;
Vue.prototype.$echart = echarts;
Vue.prototype.commonJs = commonJs;
// Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
