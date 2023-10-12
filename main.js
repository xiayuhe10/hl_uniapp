import Vue from 'vue'
import App from './App'
import store from './store'
import configURL from './common/config.js'
import api from './common/api.js';
import axios from 'axios';
import './dict/index.js'
import AES from '@/js_sdk/ar-aes/ar-aes.js'
Vue.prototype.AES = AES.AES

Vue.config.productionTip = false

Vue.prototype.$configURL = configURL
Vue.prototype.$store = store
import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)

import lgdTab from './@/components/lgd-tab/lgd-tab.vue'
Vue.component('lgd-tab', lgdTab)

import viewLoader from './components/view-loader.vue';
Vue.component('view-loader', viewLoader);

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

import initToast from "@/components/show-toast/initToast.js"
import showToast from "@/components/show-toast/show-toast.vue"
 
Vue.component('show-toast',showToast)

initToast(Vue);

import socket from 'plus-websocket'
Vue.prototype.$socket = socket

import wsRequest from '@/common/websocket.js';
let webSocket = new wsRequest(configURL.webscoket, 1000);
Vue.prototype.$webSocket = webSocket

// 配置公共方法
import noMultiple from './common/noMultipleClicks.js'
Vue.prototype.$noMultipleClicks = noMultiple.noMultipleClicks;
Vue.prototype.$noMulShowToastClicks = noMultiple.noMulShowToastClicks;

Vue.prototype.showError = function (msg, callback) {
  uni.showModal({
    title: '友情提示',
    content: msg,
    showCancel: false,
    success: function (res) {
      callback && callback();
    }
  });
};


//请求挂载
import {
	myRequest
} from "./common/http.js"
Vue.prototype.$http = myRequest

//文件大小函数转换
import {
	getFileSize
} from "./common/utils/getFileSize.js"
Vue.prototype.getFileSize = getFileSize

// import uView from '@/uni_modules/uview-ui'
// Vue.use(uView)
// uni.$u.config.unit = 'rpx'
//#ifdef APP-PLUS
let env = uni.getSystemInfoSync().platform
if (env === 'android') {
	let main = plus.android.runtimeMainActivity();
	plus.runtime.quit = function() {
		main.moveTaskToBack(false);
	};
}
//#endif
App.mpType = 'app'

const app = new Vue({
	axios,
	store,
	...App
})
app.$mount()
