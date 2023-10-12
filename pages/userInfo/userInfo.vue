<template>
	<view class="center">
		<view style="background-image: url(../../static/userInfo/drawingboard.png);width: 100%;height: 170px;background-size: 100% 100%;" >
			<view class=" padding-left flex align-center" style="padding-top: 90px;" >
				<view v-if="userInfo.avatar && userInfo.avatar != ''" class="cu-avatar round bg-white" :style="`background-image:url(` + fileUrl +userInfo.avatar +`);width: 100rpx;height:100rpx;`"></view>
				<view @tap="updateAvatar()" v-else class="cu-avatar radius lg avatarbg avatarfontsize"
					style="width: 100rpx;height:100rpx;margin-top:30rpx;">
					{{userInfo.nickName}}
				</view>
				<view class="margin-left-sm" >
					<view class=" flex align-center">
						<view class="text-bold grid ">
							{{userInfo.nickName}}
						
						</view>
					</view>
					
				</view>
			</view>
		</view>
<!-- 		<view class="solid-top ">
			<view class="grid col-3 text-center  bg-white padding radius">
				<view class="" @tap="toIntegralSignInfo">
					<view class=" text-lg">
						<text class="text-blue text-bold ">{{sysUserScore.score}}</text>积分
					</view>
					<view class="margin-top-xs text-gray"> 收支/兑换记录 </view>
				</view>
				<view class="" @tap="toSgnInClick">
					<view class=" text-lg">每日赚积分</view>
					<view class="margin-top-xs " :class="signByToday.status?'text-gray':'text-red'">
						{{signByToday.status?'今日已签到':'去签到'}}
					</view>
				</view>
				<view class="" >
					<view class=" text-lg"> 积分兑换 </view>
					<view class="margin-top-xs text-gray" @tap="toIntegralMall()"> 敬请期待 </view>
				</view>
			</view>
		</view> -->
		<view class="cu-list menu sm-border  margin-top response">
			<view class="cu-item arrow" @tap="toUserInfo()">
				<button class="cu-btn content" open-type="contact">
					<text class="cuIcon-myfill text-olive"></text>
					<text class="text-grey">个人信息</text>
				</button>
			</view>
			
			<!-- 另一半 -->
			<view class="margin-top"></view>
			<view class="cu-item arrow" @tap="toHelp()">
				<button class="cu-btn content" open-type="contact">
					<text class="cuIcon-question text-blue"></text>
					<text class="text-grey">帮助与反馈</text>
				</button>
			</view>
			<view class="cu-item arrow" @tap="toComplain()">
				<button class="cu-btn content" open-type="contact">
					<text class="cuIcon-warnfill text-red"></text>
					<text class="text-grey">投诉与举报</text>
				</button>
			</view>
			<view class="cu-item arrow" @tap="toAbout()">
				<button class="cu-btn content" open-type="contact">
					<text class="cuIcon-evaluate_fill text-olive"></text>
					<text class="text-grey">关于</text>
				</button>
			</view>

			<view class="cu-item arrow" v-if="checkShow" @tap="checkUpdate">
				<button class="cu-btn content" open-type="contact">
					<text class="cuIcon-icloading text-olive"></text>
					<text class="text-grey">检查更新</text>
				</button>

				<view class="action text-gray">
					当前{{version}}
				</view>
			</view>
			<view class="cu-item arrow" @tap="toSettings()">
				<button class="cu-btn content" open-type="contact">
					<text class="cuIcon-settings  text-olive"></text>
					<text class="text-grey">设置</text>
				</button>
			</view>
		</view>
	
	</view>
</template>

<script>
	import weburl from '@/common/config.js'
	import {
		mapState
	} from 'vuex';
	import {
		logout
	} from '@/common/api/login.js';
	import Request from '@/common/request.js';
	import shareDownload from "@/components/share-download/share-download";
	export default {
		components: {
			shareDownload
		},
		data() {
			return {
				themeColors: 'linear-gradient(45deg, rgb(10, 184, 187), rgb(0, 170, 255))',
				avatarUrl: "../../static/userInfo/uni-center/logo.png",
				show: false, //是否显示
				downUrl: '', //下载地址
				upContent: {},
				updataInfo: "",
				upText: "",
				userInfo: {},
				fileUrl: '',
				version: '',
				deviceType: "ANDROID",
				checkShow: false,
				flagSign: true,
				downLoadUrl: '',
				logoUrl: {},
				modalName: null,
				weekdays: [1, 2, 3, 4, 5, 6, 7],
				sysUserScore: [],
				signByToday: {},
				fileSize: "",
				sysCheckEnable: 'false',
				balanceInfo:{}
			}
		},
		onLoad() {
			let platform = uni.getSystemInfoSync().platform
			if ("ios" == platform) {
				this.deviceType = "IOS"
			}
			this.addAvatar(this.userInfo)
			this.fileUrl = weburl.fileURL
			// console.info("userInfo",this.userInfo)
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo')
			this.getUserInfo();
			this.configKey();
			this.checkPlatform();
			this.getImage();
			//#ifdef APP-PLUS
				this.setTabVisible()
			//#endif
		},
		methods: {
			setTabVisible(){
				if (this.userInfo.userType == '02') {
					uni.setTabBarItem({
						index: 1,
						visible: false
					})
				} else {
					uni.setTabBarItem({
						index: 1,
						visible: true
					})
				}
			},
			flagSignChange() {
				this.flagSign = !this.flagSign
			},
			showModal(e) {
				// this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			onGetPhoneNumber() {
				// console.log("Jin来了")
				let that = this
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: (res2) => {
									const code = res2.code
									uni.getUserInfo({
										provider: 'weixin',
										success: (info) => { //这里请求接口

										},
										fail: () => {
											uni.showToast({
												title: "微信登录授权失败",
												icon: "none"
											});
										}
									})

								},
								fail: () => {
									uni.showToast({
										title: "微信登录授权失败",
										icon: "none"
									});
								}
							})

						} else {
							uni.showToast({
								title: '请先安装微信或升级版本',
								icon: "none"
							});
						}
					}
				});

			},
			checkPlatform() {
				const type = uni.getSystemInfoSync().uniPlatform
				if (type == 'app') {
					this.checkShow = true
					plus.runtime.getProperty(plus.runtime.appid, (info) => {
						this.version = info.version;
					})
				}
			},
			getUserInfo() { // 获取用户信息,更新用户缓存
				Request.get(Request.API.getUserInfo).then(res => {
					uni.setStorageSync('userInfo', res.data.user);
					this.userInfo = res.data.user;
				})
			},
			isOnlineChange(value) {
				this.modalName = null
				this.getUserInfo();
				// console.info('切换', value)
			},
			//获取LOGO
			getImage() {
				Request.get(Request.API.sysPictureList, {
					"type": "GUIDE"
				}).then(res => {
					// console.log("res", res.data.rows)
					this.logoUrl = res.data.rows[0]
				})
			},
			//前往账号注销页面
			toCancel() {
				// console.log("注销")
				uni.navigateTo({
					url: "./cancelAccount/cancelAccount"
				})
			},
			//前往文件管理
			toCloudZone() {
				uni.navigateTo({
					url: "./userCloudZone/userCloudZone?used=" + this.fileSize
				})
			},
			addAvatar(value) {
				// console.info(value)
				// console.info(value.nickName)
				let p = value.nickName
				if (p != undefined) {
					this.userInfo.avatarName = p.substring(p.length - 2)
				}

			},
			//显示pc端url地址
			showPCUrl(value) {
				uni.showModal({
					title: '复制PC端地址',
					content: 'http://aixiaoxin.com.cn',
					confirmText: '复制',
					cancelText: '关闭',
					success: function(res) {
						if (res.confirm) {
							// console.log('点击了确认')
							uni.setClipboardData({
								data: 'http://aixiaoxin.com.cn',
								success: (res) => {
									// console.info(res)
									setTimeout(function() {
										uni.showToast({
											title: "复制成功"
										})
									}, 100)
								}
							});
						} else {
							// console.log('点击了取消')
						}
					}
				})
			},
			showQrModal() {
				this.modalName = 'qrModal'
			},
			hideQrModal() {
				this.modalName = ''
			},
			//保存二维码图片到相册
			saveToAlbum() {
				uni.saveImageToPhotosAlbum({
					filePath: "../../static/userInfo/qrcode_for_aixiaoxin.jpg",
					success: function() {
						uni.hideLoading();
						uni.showToast({
							title: '保存成功',
							icon: 'none'
						});
					},
					fail: function() {
						uni.hideLoading();
						uni.showToast({
							title: '保存失败，请稍后重试',
							icon: 'none'
						});
					}
				});
			},
			//检查更新
			checkUpdate() {
				uni.showLoading({
					title: '检查更新中...'
				});
				Request.get(Request.API.getLatestVersion, {
					type: this.deviceType
				}).then(res => {
					let resData = res.data.data
					let that = this
					if (this.compareVersion(this.version, resData.version) == -1) { //本地版本小于最新版本 提示更新
						uni.showModal({
							title: "更新提醒",
							content: "有新的" + resData.version + "版本！",
							confirmText: "下载",
							success: function(res) {
								if (res.confirm) {
									// console.log(that.deviceType)
									if (that.deviceType === 'ANDROID') {
										const index = resData.url.lastIndexOf(".");
										const type = resData.url.substring(index + 1);
										if (type == 'wgt') {
											that.downLoadWgt(resData.url)
										} else {
											that.downLoadFiles(resData.url)
										}
									} else if (that.deviceType === 'IOS') {
										let appleId = getApp().globalData.appAppleId
										plus.runtime.launchApplication({
											action: `itms-apps://itunes.apple.com/cn/app/id${appleId}?mt=8`
										}, function(e) {
											// console.log(
											// 	'Open system default browser failed: ' +
											// 	e
											// 	.message);
										});
									}

								}
							}
						})
					} else if (this.compareVersion(this.version, resData.version) == 0) { //比较相等 已是最新
						uni.showModal({
							title: "提醒",
							content: "已是最新版本！",
							showCancel: false,
							success: function(res) {

							}
						})
					}
				})
			},
			downLoadWgt(url) {
				uni.downloadFile({
					url: this.fileUrl + url,
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
									plus.runtime.restart();
								},
								function(e) {
									console.error(
										'install fail...',
										e);
								});
						}
					}
				});
			},
			downLoadFiles(url) {
				var downloadApkUrl = this.fileUrl + url;
				var dtask = plus.downloader.createDownload(
					downloadApkUrl, {},
					function(d, status) {
						// 下载完成 
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
				var showLoading = plus.nativeUI.showWaiting("正在下载"); //创建一个showWaiting对象 
				dtask.addEventListener('statechanged', function(
					task,
					status
				) {
					switch (task.state) {
						case 1:
							showLoading.setTitle("正在下载");
							break;
						case 2:
							showLoading.setTitle("已连接到服务器");
							break;
						case 3:
							prg = parseInt(
								(parseFloat(task.downloadedSize) /
									parseFloat(task.totalSize)) *
								100
							);
							showLoading.setTitle("  正在下载" + prg + "%  ");
							break;
						case 4:
							plus.nativeUI.closeWaiting();
							//下载完成
							break;
					}
				});
			},
			isShow(e) {
				this.show = !e.cancel;
			},
			//退出登录
			out() {
				uni.showModal({
					title: "提示",
					content: "你确定要退出登陆吗？",
					success: (res) => {
						if (res.confirm) {
							this.loginOut()
						}
					}
				})
			},
			//帮助中心
			toHelp() {
				uni.navigateTo({
					url: "./helpAndFeedback/helpAndFeedback",
				})

			},

			//修改密码
			toChange() {
				uni.navigateTo({
					url: "./change"
				})
			},
			
			//注销登陆
			loginOut() {
				//let access_token = this.$store.state.token
				Request.delete(Request.API.authLogout).then(res => {
					this.$store.commit('logout');
					uni.removeStorageSync('userInfo');
					uni.removeStorageSync('token');
					this.$webSocket.completeClose()
					uni.reLaunch({
						url: "../login/login"
					})
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
			//更换头像
			updateAvatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						const tempFilePaths = res.tempFilePaths[0]
						let token = uni.getStorageSync('token');
						uni.uploadFile({
							url: weburl.BaseURL + Request.API.upload,
							filePath: tempFilePaths,
							name: 'file',
							header: {
								Authorization: token
							},
							success: (myres) => {
								let returnData = JSON.parse(myres.data);
								this.updateProfile(returnData.data.url);
							}
						});
					}
				});
			},
			configKey() { //GET 根据参数键名查询参数值 configKey
				Request.get(Request.API.configKey + 'sys.check.enable').then(res => {
					if (res.data.code == 200) {
						this.sysCheckEnable = res.data.msg
						// console.info(this.sysCheckEnable)
					}
				})
			},
			updateProfile(url) { //修改用户头像
				let that = this
				let param = {
					"userId": this.userInfo.userId,
					"avatar": url
				}
				Request.put(Request.API.updateUserProfile, param).then(res => {
					// console.log("res", res.data)
					if (this.sysCheckEnable == 'true') {
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							duration: 1000
						});
					} else {
						if (res.data.code) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
								duration: 1000
							});
							setTimeout(function() {
								that.getUserInfo();
							}, 1000)
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
								duration: 1000
							});
						}
					}
				})
			},
			toIntegralSignInfo() {
				uni.navigateTo({
					url: './integral/integralSignInfo/integralSignInfo'
				})
			},
			toSgnInClick() {
				uni.navigateTo({
					url: './integral/sgnInClick/sgnInClick'
				})
			},
			toPhoneNumber() { //前往更换手机号
				uni.navigateTo({
					url: "./updatePhoneNumber/checkPhoneNumber"
				})
			},
			toNoticeManagement() { //前往通知管理
				uni.navigateTo({
					url: "./noticeManagement/noticeManagement"
				})
			},
			toTntegral() { //前往积分乐园
				uni.navigateTo({
					url: "./integral/integral"
				})
			},
			toShipAddress() {
				uni.navigateTo({
					url: "./shipAddress/shipAddress?flag=index"
				})
			},
			toComplain() { //前往投诉与举报
				uni.navigateTo({
					url: "./complain/complain"
				})
			},
			
			toUserManual() { //前往使用手册
				uni.navigateTo({
					url: "./userManual/userManual"
				})
			},
			toUserInfo() { //前往个人中心
				uni.navigateTo({
					url: "./userInformation/userInformation"
				})
			},
			toMyCourse() { //前往我的课程
				uni.navigateTo({
					url: "./myCourse/myCourse"
				})
			},
			toAbout() {
				uni.navigateTo({
					url: "./about/aboutList"
				})
			},
			toUserNotice() { //前往消息中心
				uni.navigateTo({
					url: "./userNotice/userNotice"
				})
			},
			//前往修改密码
			toForget() {
				uni.navigateTo({
					url: "./forget/forget"
				})
			},
			//前往隐患列表
			toFacilityList() {
				uni.navigateTo({
					url: "../facility/list"
				})
			},
			//前往告警列表
			toAlarmList() {
				uni.navigateTo({
					url: "../alarm/list"
				})
			},
			toIntegralMall() { // 积分商城
				uni.navigateTo({
					url: './integral/integralMall/integralMall'
				})
			},
			toMyOrder() { // 我的订单
				uni.navigateTo({
					url: './myOrder/myOrder'
				})
			},
			toUserBalance() { // 我的余额
				uni.navigateTo({
					url: './userBalance/userBalance'
				})
			},
			getFileInfo() {
				Request.get(Request.API.statisticsFileInfo).then(res => {
					this.fileSize = res.data.data.used
				})
			},
			toChangeIdentity(){ // 切换身份
				uni.navigateTo({
					url: './changeIdentit/changeIdentit'
				})
			},
			toSettings(){ // 设置
				uni.navigateTo({
					url: './settings/settings'
				})
			},
			changeKM(num) {
				let newNum = 0
				let newM = 0
				newNum = num / 1024
				newNum = Math.ceil(newNum)
				if (num > 1024) {
					if (newNum > 1024) {
						newM = newNum / 1024
						newM = Math.ceil(newM)
						return newM + "M"
					} else {
						return newNum + "K"
					}
				} else {
					return num + "b"
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	@import "../../common/global.less";

	page {
		background-color: @backcolorthree;
	}

	.cu-dialogSign {
		position: relative;
		display: inline-block;
		vertical-align: middle;
		margin-left: auto;
		margin-right: auto;
		min-width: 600rpx;
		max-width: 100%;
		overflow: hidden;
	}

	.background-img {
		width: 600rpx;
		height: 600rpx;
	}

	.mainSign {
		align-items: center;
	}

	.titleSign {
		font-size: 44rpx;
		color: #FFFFFF;
		font-weight: 600;
	}

	.totalSign {
		background-color: #FFFFFF;
		color: #ed5200;
		text-align: center;
		border-radius: 100px;
		font-size: 30rpx;
		margin: auto;
		width: 230rpx;
	}

	.scoresSign {
		text-align: center;
		color: #FFFFFF;
	}

	.contentSign {
		position: absolute;
		width: 600rpx;
		height: 600rpx;
		justify-content: space-around;
		align-items: center;
		border-radius: 10px;
		z-index: 5;
	}

	.background-img,
	.contentSign {
		top: 0;
	}


	.avatarbg {
		background-color: #00aaff;
	}

	.avatarfontsize {
		font-size: 30rpx;
		letter-spacing: 5rpx;
		width: 130rpx;
		height: 130rpx;
		border-radius: 100%;

		text-align: center;
	}

	.topmy {
		margin-top: 30rpx;
		font-size: 42rpx;
		color: #FFFFFF;
	}

	.updata {
		position: relative;

		>view {
			height: 18rpx;
			width: 18rpx;
			background-color: #FF504D;
			border-radius: 100%;
			position: absolute;
			right: 0;
			margin-right: 40rpx;
		}
	}

	.iconStyle {
		color: #bababa;
	}

	.iconImg {
		color: #34AB68;
		font-size: 40rpx;
	}



	// 表单按钮组
	.formButModel {
		padding-top: 40rpx;
		width: 75%;
		margin: 40rpx auto;
		justify-content: center;

		.formBut::after {
			border: none;
		}

		.formBut {
			height: 80rpx;
			width: 550rpx;
			line-height: 80rpx;
			color: gray;
			background-color: #fff;
			font-size: 32rpx;

		}
	}

	.center {
		flex-direction: column;
		position: absolute;
		width: 100%;
		height: 1600rpx;
	}

	.logo {
		height: 300rpx;
		padding-top: 80rpx;
		width: 100%;
		box-sizing: border-box;
		background-color: #fff;
		flex-direction: column;
		align-items: center;

	}

	.logo-top {
		width: 96%;
		height: 100%;
		margin: 0rpx auto;
		border: 1px solid #fff;

	}

	.userImg {
		// height: 200rpx;
		width: 70%;
		height: 100%;
		margin: 30rpx auto;
		// >text {
		// 	padding-top: 20rpx;

		// }
	}

	.logo-img {
		width: 130upx;
		height: 130upx;
		border-radius: 130upx;
	}

	.uer-name {
		height: 60upx;
		line-height: 60upx;
		font-size: @titleSize;
		color: #FFFFFF;
	}

	.go-login.navigat-arrow {
		font-size: 38upx;
		color: #FFFFFF;
	}

	.login-title {
		height: 150upx;
		align-items: self-start;
		justify-content: center;
		flex-direction: column;
		margin-left: 20upx;
	}

	.center-list {
		background-color: #FFFFFF;
		margin-top: 20upx;
		width: 100%;
		flex-direction: column;
	}

	.center-list-item {
		height: 100upx;
		width: 100%;
		box-sizing: border-box;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		display: flex;
		padding: 0upx 20upx;

	}

	.border-bottom {
		border-bottom-width: 1upx;
		border-color: #f0eff3;
		border-bottom-style: solid;
	}

	.list-icon {
		width: 40upx;
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #4cd964;
		text-align: center;
		font-family: texticons;
		margin-right: 20upx;
	}

	.list-text {
		height: 90upx;
		line-height: 90upx;
		font-size: 32upx;
		color: #555;
		flex: 1;
		text-align: left;
	}

	.navigat-arrow {
		height: 90upx;
		width: 40upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		text-align: right;
		font-family: texticons;
	}
</style>
