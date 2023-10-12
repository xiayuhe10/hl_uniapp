import Vue from 'vue'
import Vuex from 'vuex'
import webUrl from '../common/config.js'
import socket from 'plus-websocket'
import Request from '@/common/request.js';
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		//用户token
		token: '',
		//用户信息
		userInfo: {},
		count: "",
		update: false,
		tips: false,
		isRead: false,
		ip: '',
		start: 0,
		loginLoseTip: false, //是否进行失效提示
		nowAlarm: "",
		alarmType: "",
		readNum: "",
		intervalID: "",
		readArr: [],

		nowAlarms: [],

		connected: false,
		connecting: false,
		timeout: 5000,
		timeoutObj: null,
		msg: false,

		socketTask: null,
		is_open_socket: false
	},
	mutations: {
		nowAlarms(state, nowAlarms) {
			console.log(nowAlarms)
			state.nowAlarms = nowAlarms
		},
		thirdToken(state, token) {
			state.thirdToken = token
		},
		thirdUUID(state, UUID) {
			state.thirdUUID = UUID
		},

		//登录失效提示，用于处理登陆失效关闭页面以后无法提示
		showTips(state) {
			console.log('登陆失效')
			state.loginLoseTip = true;
		},
		loginchange(state) {
			console.log('登陆了')
			state.loginLoseTip = false;
		},
		//是否提示
		setTips(state) {
			state.tips = true;
		},

		//获取用户信息
		getUserInfo(state) {
			Request.get(Request.API.getUserDetail).then(res => {
				console.log("用户信息", res.data.user)
				state.userInfo = res.data.user;
			})
		},
		//获取未查看通知
		async getNoRead(state) {
			uni.request({
				url: state.webUrl + '/slmp-server/notice/findNoticeUser/' + state.userInfo.id,
				method: "GET",
				success: (res) => {
					// console.log(res)
					state.readNum = res.data.datas;
				}
			})
		},
		//用户查看
		userRead(state) {
			state.isRead = true;
			state.tips = false;
		},
		//检查更新
		update(state) {
			let appid = plus.runtime.appid
			plus.runtime.getProperty(appid, async (e) => {});

		},
		//本地获取token信息
		getToken(state) {
			let token = uni.getStorageSync('token');
			state.token = token
		},
		//登陆，储存token到本地
		login(state, token) {
			state.token = token;
			uni.setStorageSync('token', token);
		},
		//注销登陆
		logout(state) {
			state.token = "";
			uni.removeStorageSync('token');
			// this.commit('stopTimout');
		},

		//webscoket
		socketConnect(state) {
			var _this = this;
			uni.closeSocket();
			this.connected = false;
			let token = uni.getStorageSync('token')
			console.log('websocket连接中...')
			let url = webUrl.webscoket;
			console.log(url)
			console.log(token)
			uni.connectSocket({
				url: url + '?token=' + token,
				header: {
					'content-type': 'application/json',
					"Authorization": token
				},
				method: 'GET',
				success(res) {
					console.log('websocket连接成功')
				},
				fail(err) {
					console.log("conn-websocket错误：" + err)
				}
			})
			uni.onSocketOpen((res) => {
				console.log("open-websocket：" + res)
				console.log('WebSocket连接正常打开中...！')
				_this.connected = true
			})
			uni.onSocketError((err) => {
				_this.connected = false
				console.log('onError', err);
			})
			//信息接收
			uni.onSocketMessage((res) => {
				let that = this;
				console.log("收到服务器信息：", JSON.parse(res.data))
			})
			uni.onSocketClose((res) => {
				this.connected = false
			})
		},
		CLOSE_SOCKET(state) {
			if (!state.socketTask) return
			state.socketTask.close({
				success(res) {
					console.log('关闭成功', res)
				},
				fail(err) {
					console.log('关闭失败', err)
				}
			})
		},
		WEBSOCKET_INIT(state) {
			let token = uni.getStorageSync('token')
			console.log('websocket连接中...')
			let url = webUrl.webscoket;
			state.socketTask = uni.connectSocket({
				url: url + '?token=' + token,
				header: {
					'content-type': 'application/json',
					"Authorization": token
				},
				method: 'GET',
				success(data) {
					console.log("websocket连接成功");
				},
			});

			state.socketTask.onOpen((res) => {
				console.log("WebSocket连接正常打开中...！");
				state.is_open_socket = true;
				state.socketTask.onMessage((res) => {
					console.log("收到服务器内容：" + res.data);
				});
			})
		},
		WEBSOCKET_SEND(state, p) {
			console.log("ws发送！");
			state.socketTask.send({
				data: p,
				async success() {
					console.log("消息发送成功");
				},
			});
		}
	},
	actions: {

	}
})
export default store
