<script>
	import Vue from 'vue'
	import webUrl from 'common/config.js'
	import Request from 'common/request.js';
	export default {
		data() {
			return {

				connected: false,
				connecting: false,
				socketTask: false,
				timeout: 5000,
				timeoutObj: null,
				msg: false,

			}
		},
		globalData: {
			logoutNum: 0,
			appAppleId: 1637609105,
			mapKey: '6VLBZ-NICCU-4O2VT-BSF4A-PB3HK-L3FJN', //腾讯地图key
			encryptKey: 'ed26d4cd99aa11e5b8a4c89cdc776729',

			plantInfo: {
				id: null,
				name: ''
			}
		},
		created: function() {
			// uni.$on('setTabBarItem', res => {
			// 	console.info('TabBar被调用了')
			// 	uni.setTabBarItem({
			// 		index: 1,
			// 		visible: false
			// 	})
			// })
		},
		onLaunch: function() {

			//let token = uni.getStorageSync('token');
			// if (token) {
			// 	//不存在则跳转至登录页
			//  uni.reLaunch({
			// 		url: "/pages/login/login",
			// 		success: () => {
			// 			plus.navigator.closeSplashscreen();
			// 		}
			// 	})
			// } else {
			// 	//存在则关闭启动页进入首页
			// 	plus.navigator.closeSplashscreen();
			// }

			// //#ifdef APP-PLUS
			// var info = plus.push.getClientInfo();
			// console.log("info", info)
			// uni.showModal({
			// 	title: info.clientid,
			// 	content: info.clientid
			// })
			// let timer = false;
			// plus.push.addEventListener("click", (msg) => {
			// 	clearTimeout(timer);
			// 	timer = setTimeout(() => {
			// 		console.log(1111, msg);
			// 		if (msg.payload) {
			// 			uni.navigateTo({
			// 				url: 'pages/index/index'
			// 			})
			// 		}
			// 	}, 1500)
			// }, false)
			// plus.push.addEventListener("receive", (msg) => {
			// 	if ("LocalMSG" == msg.payload) {} else {
			// 		if (msg.type == 'receive') {
			// 			var options = {
			// 				cover: false,
			// 				title: msg.title
			// 			};
			// 			plus.push.createMessage(msg.content, msg.payload, options);
			// 		}
			// 	}
			// }, false)
			// //#endif
		},
		onShow: function() {
			// console.log('App Show')
			let that = this
			//#ifdef APP-PLUS
			setTimeout(() => {
				//判断是否处于登录状态
				let token = uni.getStorageSync('token');
				if (token) {
					//获取第三方传来的参数
					let args = plus.runtime.arguments
					console.log('args:', args)
					if (args) {
						if (args.includes('hbuilder://')) {
							let arg = args.split("://")
							let param = JSON.parse(decodeURIComponent(arg[1]))
							let userInfo = uni.getStorageSync('userInfo');
							uni.showModal({
								title: '孩子关联邀请',
								content: param.inviteName + '邀请您与孩子[' + param.studentName + ']关联',
								success(res) {
									if (res.confirm) {
										Request.post(Request.API.bindByStudentId +
											'/' + that.AES.decrypt(param.studentId,
												'1234567891234567', '1234567891234567') +
											'/' + userInfo.userId).then(res => {
											console.log("res", res)
											if (res.data.code == 200) {
												uni.showToast({
													title: '关联成功',
													icon: "none",
													duration: 3000
												});
											}

										})
									}
								}
							})
						}
					}
				}
			}, 0);
			//#endif
			this.plus()
		},
		onHide: function() {
			// console.log('App Hide')
		},
		methods: {
			async plus() {
				// console.log('App Show1111111')
				// #ifdef APP-PLUS
				var appid = plus.runtime.appid;
				//plus.runtime.setBadgeNumber(8);
				console.log('应用的 appid 为：', appid);
				// #endif
			},
		}

	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";
	// @import "common/demo.scss";
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	/* 全局字体图标 */
	@import './common/icon.css';
	@import './common/facilityIcon.css';
	/* 全局动画 */
	@import './common/animate.css';

	@import "./colorui/main.css";
	@import "colorui/icon.css";
	@import '@/colorui/animation.css';

	.bg-axx {
		background-color: #09A5A1;
	}

	.nav-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0px 40upx 0px;
		justify-content: space-between;
	}

	.nav-li {
		padding: 30upx;
		border-radius: 12upx;
		width: 45%;
		margin: 0 2.5% 40upx;
		background-image: url(https://cdn.nlark.com/yuque/0/2019/png/280374/1552996358352-assets/web-upload/cc3b1807-c684-4b83-8f80-80e5b8a6b975.png);
		background-size: cover;
		background-position: center;
		position: relative;
		z-index: 1;
	}

	.nav-li::after {
		content: "";
		position: absolute;
		z-index: -1;
		background-color: inherit;
		width: 100%;
		height: 100%;
		left: 0;
		bottom: -10%;
		border-radius: 10upx;
		opacity: 0.2;
		transform: scale(0.9, 0.9);
	}

	.nav-li.cur {
		color: #fff;
		background: rgb(94, 185, 94);
		box-shadow: 4upx 4upx 6upx rgba(94, 185, 94, 0.4);
	}

	.nav-title {
		font-size: 32upx;
		font-weight: 300;
	}

	.nav-title::first-letter {
		font-size: 40upx;
		margin-right: 4upx;
	}

	.nav-name {
		font-size: 28upx;
		text-transform: Capitalize;
		margin-top: 20upx;
		position: relative;
	}

	.nav-name::before {
		content: "";
		position: absolute;
		display: block;
		width: 40upx;
		height: 6upx;
		background: #fff;
		bottom: 0;
		right: 0;
		opacity: 0.5;
	}

	.nav-name::after {
		content: "";
		position: absolute;
		display: block;
		width: 100upx;
		height: 1px;
		background: #fff;
		bottom: 0;
		right: 40upx;
		opacity: 0.3;
	}

	.nav-name::first-letter {
		font-weight: bold;
		font-size: 36upx;
		margin-right: 1px;
	}

	.nav-li text {
		position: absolute;
		right: 30upx;
		top: 30upx;
		font-size: 52upx;
		width: 60upx;
		height: 60upx;
		text-align: center;
		line-height: 60upx;
	}

	.text-light {
		font-weight: 300;
	}

	@keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}

	@-webkit-keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}
</style>