<template style="border:1px solid red;">
	<view class="viewContent">
		<view class="cu-list no-border grid col-5 " v-if="MenuList&&MenuList.length>0&&isLoad">
			<view class="cu-item" v-for="(item,index) in MenuList" @click="gotoInfo(item)">
				<view :class="'cuIcon-' + item.icon+ ' text-' + item.color">
					<view class="cu-tag badge" v-if="item.badge">
						<block v-if="item.badge!=1">{{item.badge>99?"99+":item.badge}}</block>
					</view>
				</view>
				<text>{{item.name}}</text>
			</view>
		</view>
		<view class="margin-top-xs"></view>
		<view class="" v-for="(itemL,indexL) in sessionTerList" :key="'l'+indexL">
			<view v-for="(item,index) in itemL.list" :key="item.id">
				<view class="cu-list menu-avatar" @click="gotoMessInfo(itemL,itemL.type)">
					<view class="cu-item" :class="modalName=='move-' + indexL + 'box-' + index?'move-cur':''"
						@touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd($event,itemL)"
						:data-target="'move-' + indexL + 'box-' + index">
						<view class="content" v-if="itemL.type=='SINGLE' || itemL.type=='GROUP'  ">
							<view class="text-black text-cut">
								{{item.name}}
								<text class="text-xs text-gray margin-left-xs"
									v-if="item.chatType=='SINGLE' && item.className">{{item.className}}</text>
							</view>
							<view class="text-gray text-sm flex">
								<text class="text-cut" style="max-height: 40rpx;"
									v-show="item.contentType=='TEXT'">{{item.content}}</text>
								<text class="text-cut" v-show="item.contentType=='IMAGE'">[图片]</text>
								<text class="text-cut" v-show="item.contentType=='VOICE'">[语音]</text>
								<text class="text-cut" v-show="item.contentType=='VIDEO'">[视频]</text>
								<text class="text-cut" v-show="item.contentType=='FILE'">[群文件]</text>
							</view>
						</view>
						<view class="action">
							<view class="text-grey text-xs">{{changeTime(item.createTime)}}</view>
							<view class="cu-tag round bg-red sm" v-if="itemL.unRead>0">
								{{itemL.unRead>99?'99+':itemL.unRead}}
							</view>
						</view>
						<view class="move" @tap="listDelete(indexL,index,item)" >
							<!-- <view class="bg-grey">置顶</view> -->
							<view class="text-white" style="background-color: #FF5A6B;">删除</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 聊天消息 -->
		<view class="padding-top"></view>
		<!--加号弹出层 start-->
		<view class="mune-pop" v-if="isShowPop">
			<view @click="gotoSelectContact()">
				<text class="cuIcon-profile"></text><text style="margin-left:10rpx;">加好友/群</text>
			</view>
			<view @click="scanCode()">
				<text class="cuIcon-scan"></text> <text style="margin-left:10rpx;">扫一扫</text>
			</view>
			<view @click="toHelpAndFeedback()">
				<text class="cuIcon-question"></text> <text style="margin-left:10rpx;">帮助与反馈</text>
			</view>
		</view>
		<!--加号弹出层 end-->
		<!--版本升级 start-->
		<view class="cu-modal " :class="modalName=='version'?'show':''">
			<view class="cu-dialog">
				<view class="" style="height:150px;">
					<image src="../../static/index/version.png"></image>
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub  solid-left">爱校信最新版来啦，快更新尝鲜</view>

				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub " @click="hideModal()">
						稍后再说
					</view>
					<view class="action margin-0 flex-sub text-blue" @click="downLoadFiles()">
						立即更新
					</view>

				</view>
			</view>
		</view>
		<!--版本升级 end-->
		<!--版本下载 start-->
		<view class="cu-modal " :class="modalName=='versionDownLoad'?'show':''">
			<view class="cu-dialog">
				<view class="" style="height:120px;">
					<image src="../../static/index/download.png" style="display: block;width: 100%;height: 100%;">
					</image>
				</view>
				<view class="cu-bar bg-white padding">
					<view class="cu-progress round sm striped active">
						<view class="bg-green" :style="[{width:downLoadRate}]"></view>
						<view class="text-center align-center progress-absolute">{{downLoadRate}}</view>
					</view>
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub  solid-left">下载中...请耐心等候</view>
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub text-yellow" @click="hideModal()">
						后台下载
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import dateTime from '@/common/dateTime.js';
	import Request from '@/common/request.js';
	import webUrl from '@/common/config.js';
	import optionList from '@/components/gzz-option-list/option-list.vue';
	import homePage from '@/components/homePage/homePage.vue';
	import createAvatar from '@/uni_modules/ch-avatar/js_sdk/index.js'
	export default {
		data() {
			return {
				canvasId: 'canvas',
				modalName: null,
				downLoadRate: "10%",
				listTouchStart: 0,
				listTouchDirection: null,
				isShowPop: false,
				pageNum: 1,
				pageSize: 200,
				listNum: 0,
				fileUrl: '',
				webSocket: null,
				deviceType: "ANDROID",
				version: '', //版本名称
				versionInfo: {},
				brand: '',
				MenuList: [],
				clientX: '',
				clientY: '',
				userInfo: {},
				sessionTerList: [],
				studentList: [], //学生列表
				isLoad: false,
			}
		},
		computed: {},
		components: {
			optionList,
			homePage
		},
		onLoad() {
			this.fileUrl = webUrl.fileURL;
			let platform = uni.getSystemInfoSync().platform
			if ("ios" == platform) {
				this.deviceType = "IOS"
			}
			//开启websocket
			console.log("$webSocket:", this.$webSocket)
			uni.$on("wsRespData", (rel) => { // 监听全局的自定义事件。事件可以由 uni.$emit 触发
				console.log("socket返回：" + rel)
				if (rel != '') {
					if (rel.code != "PING") {
						this.listWithMyUnReadTer();
					}
				}
			});
			uni.startPullDownRefresh();
			uni.getSystemInfo({
				success: res => {
					console.log("res", res)
					this.brand = res.brand
					console.log("手机品牌", this.brand);
				}
			})
		},
		onShow() {
			let that = this
			this.userInfo = uni.getStorageSync('userInfo')
			console.info(this.userInfo)
			this.isShowPop = false;
			this.listNum = 0
			this.modalName = ""
			this.intWebsocket();
			this.listWithMyUnReadTer();
			this.getArchivesFromPatriarch();
			this.getVersionInfo();
			this.getMyMenu();
			this.sendWelcome();
			//#ifdef APP-PLUS
				this.setTabVisible()
			//#endif
			// that.cerateGroupAvatar()
		},
		created() {
			getApp().globalData.logoutNum = 0
		},
		//下拉刷新
		onPullDownRefresh() {
			this.listWithMyUnReadTer();
			this.getMyMenu();
			this.getArchivesFromPatriarch();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onNavigationBarButtonTap(e) {
			if (this.userInfo.userType != '02') {
				this.isShowPop = !this.isShowPop
			}
		},
		methods: {
			setTabVisible(){
				if (this.userInfo.userType == '02') {
					this.getAddShow()
					uni.setTabBarItem({
						index: 1,
						visible: false
					})
				} else {
					this.getAddPushShow()
					uni.setTabBarItem({
						index: 1,
						visible: true
					})
				}
			},
			getAddShow() {
				let pages = getCurrentPages();
				let page = pages[pages.length - 1];
				let currentWebview = page.$getAppWebview();
				let tn = currentWebview.getStyle().titleNView;
				tn.buttons[0].text = '';
				tn.buttons[0].fontSrc = '';
				currentWebview.setStyle({
					titleNView: tn
				});
				console.info('打印tn', tn)
			},
			getAddPushShow() {
				let pages = getCurrentPages();
				let page = pages[pages.length - 1];
				let currentWebview = page.$getAppWebview();
				let tn = currentWebview.getStyle().titleNView;
				tn.buttons[0].text = '\ue657';
				tn.buttons[0].fontSrc = '/static/icon/iconfont.ttf';
				currentWebview.setStyle({
					titleNView: tn
				});
				console.info('打印tn', tn)
			},
			getMyMenu() { //GET获取我的应用菜单列表
				Request.get(Request.API.getMyMenu).then(res => {
					this.isLoad = true
					if (res.data.code == 200) {
						let resData = res.data.data
						this.MenuList = resData.slice(0, 5)
						this.$forceUpdate()
					}
				})
			},
			getArchivesFromPatriarch() { //获取当前家长绑定的学生列表
				let that = this;
				Request.get(Request.APIPAR.selectArchivesFromPatriarch).then(res => {
					this.isLoad = true
					this.studentList = res.data.rows ? res.data.rows : []
				})
			},
			listWithMyUnReadTer() { //GET查询我的消息通知列表+未读数量（教师端
				if (this.userInfo.userType != '02') {
					Request.get(Request.API.listWithMyUnReadTer).then(res => {
						if (res.data.code == 200) {
							this.sessionTerList = res.data.rows
							this.selectBadgeNum()
						}
					})
				} else {
					Request.get(Request.APIPAR.listWithMyUnReadByPatriarch).then(res => {
						if (res.data.code == 200) {
							this.sessionTerList = res.data.rows
							this.selectBadgeNum()
						}
					})
				}
			},
			selectBadgeNum() { // 设置未读消息显示
				let that = this
				let num = 0
				let showNumList = this.sessionTerList
				if (showNumList.length > 0) {
					showNumList.forEach((item, index) => {
						num = num + item.unRead
					})
				}
				// console.log("设置未读消息显示：", show,num)
				if (num > 0) {
					if (num > 99) {
						num = '99+'
					}
					uni.setTabBarBadge({
						index: 0,
						text: `${num}`
					});
					that.setBadge(num)
				} else {
					uni.removeTabBarBadge({
						index: 0
					});
					that.clearBadge()
				}
			},
			// 设置数字
			setBadge(num) {
				//#ifdef APP-PLUS
				plus.runtime.setBadgeNumber(num);
				//#endif
			},
			// 清除数字
			clearBadge() {
				//#ifdef APP-PLUS
				plus.runtime.setBadgeNumber(0);
				//#endif
			},
			gotoInfo(item) {
				let path = item.path
				if (item.path.startsWith('./')) {
					path = '../broadcast' + item.path.replace('./', '/')
				}
				uni.navigateTo({
					url: path
				})
			},
			async cerateGroupAvatar() { // 群聊头像待使用
				let imgs = [
					'../../static/message/group.png',
					'../../static/message/group.png',
					'../../static/message/group.png',
					'../../static/message/group.png',
					'../../static/message/group.png',
					'https://ossweb-img.qq.com/images/lol/web201310/skin/big25002.jpg',
					'https://ossweb-img.qq.com/images/lol/web201310/skin/big81005.jpg',
					'https://ossweb-img.qq.com/images/lol/web201310/skin/big25002.jpg',
					'https://ossweb-img.qq.com/images/lol/web201310/skin/big25002.jpg',
					'https://ossweb-img.qq.com/images/lol/web201310/skin/big81005.jpg',
					'https://ossweb-img.qq.com/images/lol/web201310/skin/big25002.jpg'
				]
				let res = await createAvatar({
					canvasId: this.canvasId,
					data: imgs,
				})
				console.log(res);
			},
			intWebsocket() {
				let token = uni.getStorageSync('token')
				if (token) {
					try {
						this.$webSocket.connectSocketInit()
					} catch (e) {
						console.log('catch');
						this.$webSocket.is_open_socket = false
						this.$webSocket.reconnect()
					}
				}
			},
			scanCode() { // 扫一扫功能
				this.isShowPop = false
				uni.scanCode({
					success: function(res) {
						console.info(res)
						if (res.scanType == 'QR_CODE') {
							if (res.result.indexOf("aixiaoxin") != -1) {
								console.info('包含', res.result.indexOf("aixiaoxin"))
								uni.navigateTo({
									url: "./scanCodeLog/scanCodeLog"
								})
								return
							}
							let resData = JSON.parse(res.result)
							if (resData.type == 'CLASS_INVITE') {
								console.log("班级邀请", resData.data)
								uni.navigateTo({
									url: "./applyClass/applyClass?code=" + resData.data
								})
							}
						}
					}
				});
			},
			hideModal() {
				this.modalName = null;
			},
			listDelete(indexL, index, item) { // 删除
				console.info(indexL, index, item)
				Request.delete(Request.API.deleteImChatSessionById + "/" + item.id).then(res => {
					if (res.data.code == 200) {
						this.getGroupList();
						this.listWithMyUnReadTer();
					} else {
						uni.showToast({
							title: '删除失败',
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			sendWelcome() { // 发送欢迎语
				Request.post(Request.API.sendWelcome).then(res => {
					console.info("sendWelcome", res)
				})
			},
			addClass() { // 加入班级
				Request.post(Request.API.addClassGroup).then(res => {
					this.getGroupList()
					uni.showModal({
						title: '提示',
						content: '添加成功！请前往联系人查看',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.reLaunch({
									url: '/pages/contact/contact'
								})
							}
						}
					})

				})
			},
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
				this.clientX = e.changedTouches[0].clientX;
				this.clientY = e.changedTouches[0].clientY;
			},
			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},
			// ListTouch计算滚动
			ListTouchEnd(e,value) {
				const subX = e.changedTouches[0].clientX - this.clientX;
				const subY = e.changedTouches[0].clientY - this.clientY;
				// v-if="itemL.type!='SINGLE' && itemL.type!='GROUP'"
				if (value.type =='SINGLE' || value.type=='GROUP') {
					if (subY > 50 || subY < -50) {
						if (subY > 50) {
							// console.log('下滑')
							this.modalName = null
							this.listTouchDirection = null
						} else if (subY < -50) {
							// console.log('上滑')
							this.modalName = null
							this.listTouchDirection = null
						}
					} else {
						if (subX > 50) {
							console.log('右滑')
							if (this.listTouchDirection == 'left') {
								this.modalName = e.currentTarget.dataset.target
							} else {
								this.modalName = null
							}
							this.listTouchDirection = null
						} else if (subX < -50) {
							console.log('左滑')
							if (this.listTouchDirection == 'left') {
								this.modalName = e.currentTarget.dataset.target
								console.info(this.modalName)
							} else {
								this.modalName = null
							}
							this.listTouchDirection = null
						} else {
							// console.log('无效')
							// this.modalName = null
							// this.listTouchDirection = null
						}
					}
				}else{
					this.modalName = null
					this.listTouchDirection = null
				}
				// console.info('计算滚动',this.modalName,this.listTouchDirection)
			},
			fingerstart(e) { // 滑动开始
				this.clientX = e.changedTouches[0].clientX;
				this.clientY = e.changedTouches[0].clientY;
			},
			fingerend(e) { // 滑动结束
				const subX = e.changedTouches[0].clientX - this.clientX;
				const subY = e.changedTouches[0].clientY - this.clientY;
				if (subY > 50 || subY < -50) {
					if (subY > 50) {
						console.log('下滑')
					} else if (subY < -50) {
						console.log('上滑')
					}
				} else {
					if (subX > 100) {
						console.log('右滑')
					} else if (subX < -100) {
						console.log('左滑')
					} else {
						console.log('无效')
					}
				}
			},
			checkUpdate() { //进入首页则检查最新
				//获取app应用版本号 与后端提供的最新版本进行比较
				//#ifdef APP-PLUS
				plus.runtime.getProperty(plus.runtime.appid, (info) => {
					this.version = info.version;
					console.log("当前版本：" + this.version + "=====最新版本：" + this.versionInfo.version)
					//this.versionCode = info.versionCode;
					if (this.version != '') {
						let that = this
						if (this.compareVersion(this.version, this.versionInfo.version) == -
							1) { //本地版本小于最新版本 提示更新
							//需要更新，判断是整包更新还是热更新
							const index = this.versionInfo.url.lastIndexOf(".");
							const type = this.versionInfo.url.substring(index + 1);
							if (type == 'wgt') { //热更新,后台下载资源
								uni.downloadFile({
									url: webUrl.fileURL + that.versionInfo.url,
									success: (downloadResult) => {
										if (downloadResult.statusCode === 200) {
											plus.runtime.install(downloadResult
												.tempFilePath, {
													force: false
												},
												function() {
													console.log(
														'install success...'
													);
													//plus.runtime.restart();
												},
												function(e) {
													console.error(
														'install fail...',
														e);
												});
										}
									}
								});
							} else { //整包更新，弹出提示框
								this.modalName = "version";
							}
						} else if (this.compareVersion(this.version, this.versionInfo.version) ==
							0) { //比较相等 已是最新
							console.log("当前已是最新版本")
						}
					}
				})
				//#endif
			},
			downLoadFiles() {
				if (plus.os.name == "Android") {
					if (this.brand == 'xiaomi' || this.brand == 'vivo') {
						// 跳转安卓应用市场
						let appurl = "market://details?id=uni.aixiaoxin"
						plus.runtime.openURL(appurl)
					} else {
						this.modalName = "versionDownLoad";
						let that = this
						var downloadApkUrl = this.fileUrl + this.versionInfo.url;
						var dtask = plus.downloader.createDownload(
							downloadApkUrl, {},
							function(d, status) {
								//this.modalName="";
								if (status == 200) {
									plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, {},
										function(
											error) {
											uni.showToast({
												title: '安装失败',
												duration: 1500
											});
										})
								} else {
									uni.showToast({
										title: '更新失败',
										duration: 1500
									});
								}
							});
						dtask.start();
						var prg = 0;
						//var showLoading = plus.nativeUI.showWaiting("正在下载"); //创建一个showWaiting对象 
						dtask.addEventListener('statechanged', function(
							task,
							status
						) {
							switch (task.state) {
								case 1:
									//showLoading.setTitle("正在下载");
									break;
								case 2:
									//showLoading.setTitle("已连接到服务器");
									break;
								case 3:
									prg = parseInt(
										(parseFloat(task.downloadedSize) /
											parseFloat(task.totalSize)) *
										100
									);

									that.downLoadRate = prg + "%";
									console.log("下载进度：" + that.downLoadRate)
									//showLoading.setTitle("  正在下载" + prg + "%  ");
									break;
								case 4:
									plus.nativeUI.closeWaiting();
									that.modalName = "";
									//下载完成
									break;
							}
						});
					}
				} else {
					let appleId = getApp().globalData.appAppleId
					plus.runtime.launchApplication({
						action: `itms-apps://itunes.apple.com/cn/app/id${appleId}?mt=8`
					}, function(e) {
						console.log('Open system default browser failed: ' + e.message);
					});
				}
				// if (this.deviceType === 'ANDROID') {
				// 	this.modalName = "versionDownLoad";
				// 	let that = this
				// 	var downloadApkUrl = this.fileUrl + this.versionInfo.url;
				// 	var dtask = plus.downloader.createDownload(
				// 		downloadApkUrl, {},
				// 		function(d, status) {
				// 			//this.modalName="";
				// 			if (status == 200) {
				// 				plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, {}, function(
				// 					error) {
				// 					uni.showToast({
				// 						title: '安装失败',
				// 						duration: 1500
				// 					});
				// 				})
				// 			} else {
				// 				uni.showToast({
				// 					title: '更新失败',
				// 					duration: 1500
				// 				});
				// 			}
				// 		});
				// 	dtask.start();
				// 	var prg = 0;
				// 	//var showLoading = plus.nativeUI.showWaiting("正在下载"); //创建一个showWaiting对象 
				// 	dtask.addEventListener('statechanged', function(
				// 		task,
				// 		status
				// 	) {
				// 		switch (task.state) {
				// 			case 1:
				// 				//showLoading.setTitle("正在下载");
				// 				break;
				// 			case 2:
				// 				//showLoading.setTitle("已连接到服务器");
				// 				break;
				// 			case 3:
				// 				prg = parseInt(
				// 					(parseFloat(task.downloadedSize) /
				// 						parseFloat(task.totalSize)) *
				// 					100
				// 				);

				// 				that.downLoadRate = prg + "%";
				// 				console.log("下载进度：" + that.downLoadRate)
				// 				//showLoading.setTitle("  正在下载" + prg + "%  ");
				// 				break;
				// 			case 4:
				// 				plus.nativeUI.closeWaiting();
				// 				that.modalName = "";
				// 				//下载完成
				// 				break;
				// 		}
				// 	});
				// } else if (this.deviceType === 'IOS') {
				// 	let appleId = getApp().globalData.appAppleId
				// 	plus.runtime.launchApplication({
				// 		action: `itms-apps://itunes.apple.com/cn/app/id${appleId}?mt=8`
				// 	}, function(e) {
				// 		console.log('Open system default browser failed: ' + e.message);
				// 	});
				// }

			},
			//获取最新APP版本信息
			getVersionInfo() {
				Request.get(Request.API.getLatestVersion, {
					type: this.deviceType
				}).then(res => {
					console.log("res", res.data.data)
					this.versionInfo = res.data.data
					this.checkUpdate();
				})
			},
			//比较两个版本大小
			compareVersion(v1, v2) {
				v1 = v1.split('.')
				v2 = v2.split('.')
				const len = Math.max(v1.length, v2.length)

				// 调整两个版本号位数相同
				while (v1.length < len) {
					v1.push('0')
				}
				while (v2.length < len) {
					v2.push('0')
				}

				// 循环判断每位数的大小
				for (let i = 0; i < len; i++) {
					const num1 = parseInt(v1[i])
					const num2 = parseInt(v2[i])

					if (num1 > num2) {
						return 1
					} else if (num1 < num2) {
						return -1
					}
				}
				return 0
			},
			gotoMessInfo(itemL, item) {
				console.info(itemL, item)
				let systemList = ['SYSTEM', 'SCHOOL', 'CLASS', 'WORK', 'LEAVE', 'PHOTO_ALBUM', 'ORDER']
				if (itemL.type == 'ALARM') { //告警消息
					this.gotoAlarmMessage()
				} else if (itemL.type == 'CHECK') { //审批消息
					if (this.userInfo.userType != '02') {
						this.gotoCheckMessage(itemL.type)
					} else {
						this.gotoSystemMessage(itemL.type)
					}
				} else if (itemL.type == 'GROUP') { //群消息
					this.toChat(itemL.list[0])
				} else if (itemL.type == 'SINGLE') { //聊天消息
					this.toChat(itemL.list[0])
				} else if (systemList.includes(itemL.type)) { //系统消息
					this.gotoSystemMessage(itemL.type)
				}
			},
			//跳转告警消息列表
			gotoAlarmMessage() {
				uni.navigateTo({
					url: "../../../../broadcast/AIMonitor/AIMonitor"
				})
			},
			//跳转系统消息列表
			gotoSystemMessage(flag) {
				uni.navigateTo({
					url: "./message/systemMessage?flag=" + flag
				})
			},
			//跳转审批消息列表
			gotoCheckMessage() {
				uni.navigateTo({
					url: "./message/checkMessage"
				})
			},
			//跳转到好友、群添加页面
			gotoSelectContact() {
				uni.navigateTo({
					url: "../contact/selectContact/selectContact"
				})
			},
			patriarchInfo(userId) { //跳到家长详情
				uni.navigateTo({
					url: "../contact/patriarchInfo?userId=" + userId + "&groupId=null"
				})
			},
			classGroupInfo(e) { //跳到群详情
				uni.navigateTo({
					url: `../contact/classGroupInfo?id=${e.groupId}&sessionId=${e.id}&name=${e.name}&flag=${e.chatType}`
				})
			},
			toChat(e) { // 聊天界面转跳
				console.info("www", e)
				let sessionId = e.id
				let name = e.name
				uni.navigateTo({
					url: `./chat/myChats?sessionId=${sessionId}&name=${name}&flag=${e.chatType}`
				})
			},
			toHelpAndFeedback() { // 跳转帮助与反馈
				uni.navigateTo({
					url: "../userInfo/helpAndFeedback/helpAndFeedback"
				})
			},
			addStudent() { // 跳转帮助与反馈
				uni.navigateTo({
					url: "../parent/myChild/myChild"
				})
			},
			changeTime(date) {
				return dateTime.dateTime(date);
			},
		}
	}
</script>

<style lang="less">
	@charset "UTF-8";
	@import "../../common/global.less";

	.bannerView {
		height: 180rpx;

		margin: 0rpx auto;

		background-color: #fff;
	}

	.swiper {
		top: 0rpx;
		width: 100%;
		height: 100%;
	}

	.slide-image {
		display: block;
		height: 160rpx;
		border-radius: 10rpx;
		margin: 10rpx auto;
		width: 94%;

	}

	.optionMove-cur {
		transform: translateX(-130upx)
	}

	.cu-dialog {

		width: 70%;
		border-radius: 30rpx;
	}

	//scoped 在当前页生效 不影响子组件
	.item {
		// width: 100%;
		padding: 0 10px;
		height: 100%;

		.item-img {
			width: 40px;
			height: 40px;
		}
	}

	.emptyView {

		height: 400rpx;
		margin-top: 45%;
		text-align: center;
		color: #E6E6E6;

		image {
			display: block;
			width: 400rpx;
			height: 380rpx;
			margin: 0rpx auto;
		}
	}

	.nav {
		box-sizing: border-box;
		height: 80rpx;
		line-height: 80rpx;
		width: 100%;
		background-color: #03AAFD;
		color: #FFFFFF;
		z-index: 999;
		position: fixed;
		text-align: center;
		top: 0rpx;
	}

	.profileUrl {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
		background-color: #fff;
	}

	.messageView {
		width: 96%;
		margin: 10rpx auto;

	}

	.inform {
		margin-top: 20rpx;
		border: 1px solid rgb(238, 237, 237);
		height: 100rpx;
		border-radius: 10rpx;
	}

	.inform-left {
		width: 15%;
		height: 100%;
		float: left;
	}

	.inform-left image {
		display: block;
		width: 70rpx;
		height: 70rpx;
		margin: 15rpx auto;
	}

	.inform-right {
		width: 85%;
		margin-left: 15%;
		height: 100%;
	}

	.inform-right-title {
		height: 50%;
		font-size: 26rpx;
		line-height: 50rpx;
		font-weight: bold;
	}

	.inform-right-content {
		font-size: 24rpx;
		color: rgb(143, 143, 143);
		overflow: hidden;
		/*超出部分隐藏*/
		white-space: nowrap;
		/*不换行*/
		text-overflow: ellipsis;
		/*超出部分文字以...显示*/
	}

	.alarmView {
		border: 1px solid rgb(238, 237, 237);
		height: 400rpx;
		width: 80%;
		margin: 30rpx auto;
		border-radius: 10rpx;

	}

	.alarm-top {

		height: 50rpx;
	}

	.alarm-top-left {

		width: 50rpx;
		height: 50rpx;
		float: left;
	}

	.alarm-top-left image {
		display: block;
		width: 40rpx;
		height: 40rpx;
		margin: 5rpx auto;
	}

	.alarm-top-right {
		font-size: 26rpx;
		margin-left: 60rpx;
		line-height: 50rpx;
		font-weight: bold;

	}

	.alarm-content {
		border-bottom: 1px solid rgb(238, 237, 237);
		height: 40rpx;
		font-size: 24rpx;
		line-height: 40rpx;
		color: rgb(159, 160, 160);
	}

	.alarm-image-view {
		height: 310rpx;
	}

	.alarm-image-view image {
		display: block;

		width: 96%;
		height: 94%;
		margin: 10rpx auto;
		border-radius: 10rpx;
	}

	.btn-join {
		width: 300rpx;
		line-height: 60rpx;
		height: 60rpx;
		margin: 20rpx auto;
		background-color: #3FA3F9;
		border-radius: 10rpx;

	}








	//导航
	.nav {
		position: relative;
		display: flex;
		width: 100%;
		height: 100rpx;
		text-align: center;
		justify-content: space-between;

		color: #000;
		background: #EFEFEF;
	}

	.nav-title {
		margin-left: 10px;
		font-size: 20px;
		width: 100%;
		font-weight: bold;
		text-align: center;
	}

	//导航按钮
	.nav-contorls {

		position: fixed;
		right: 0px;
		height: 100rpx;
		line-height: 60rpx;
		font-size: 40rpx;

	}

	.nav-contorls view:nth-child(1) {
		margin-right: 8px;
	}

	.nav-contorls view {
		padding: 10px;
		border-radius: 8px;
	}

	.nav-contorls view:active {
		background: #C0C0C0;
	}

	.nav-contorls {
		margin-right: 10px;
	}

	.nav-contorls .iconfont {
		font-size: 25px;
	}

	.mune-pop {
		position: absolute;
		top: 0px;
		right: 8px;
		width: 150px;
		text-align: left;
		background: #545454;
		margin-top: 5px;
		border-radius: 5px;
	}

	.mune-pop:after {
		position: absolute;
		top: -5px;
		right: 15px;
		content: '';
		height: 0;
		width: 0;
		border-bottom: 8px solid #545454;
		border-right: 9px solid transparent;
		border-left: 9px solid transparent;
	}

	.mune-pop>view {
		color: white;
		font-size: 30rpx;
		margin: 10px 0 10px 20px;
		height: 30px;
		line-height: 30px;
		border-bottom: 1px solid #808080;
	}

	.mune-pop .iconfont:before {
		margin-right: 10px;
	}
</style>
