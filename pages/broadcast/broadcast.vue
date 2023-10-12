<template>
	<view class="content">
		<swiper class="screen-swiper" :class="dotStyle?'square-dot':'round-dot'" :circular="true" :autoplay="true"
			interval="10000" duration="500">
			<swiper-item>
				<image src="../../static/index.png" class="slide-image" mode="scaleToFill" />
			</swiper-item>
		</swiper>
<!-- 		<view class="panel bg-white" @tap="toSiteList">
			<view class="panel-title">{{siteInfo.name}}</view>
			<view class="panel-status action text-sm"><text class="cuIcon-right"></text></view>
		</view> -->
		<view class="bg-white" style="border-bottom: 1px solid #f5f5f5;height: 30px;line-height: 30px;">
			<picker @change="PickerChange" range-key="name" :value="index" :range="picker">
				<view class="picker" style="text-align: center;">
					{{index>-1?picker[index].name:'请选择'}}
				</view>
			</picker>
		</view>
		<view class="" style="width: 100%; margin-left: auto;margin-right: auto; "
			:style="bannerTopList.length>0?'margin-top: -60rpx;position: absolute;left:0;right:0;':'margin-top:0px'">
			<view class="cu-list grid no-border col-2 " style="border-radius: 10rpx;height:80px">
				<view @tap="toRepo" class="solid-right">
					<view class="" style="height: 40px;line-height: 40px;
						font-size: 30px;color:green;font-weight: bold;">{{myRepositoryCount}}</view>
					<view class="cu-item text-gray text-sm">
						<text>我的项目</text>
					</view>
				</view>
				<view>
					<view @tap="toCheckList" class="" style="height: 40px;line-height: 40px;
					font-size: 30px;font-weight: bold;" :class="myCheckNoReadCount>0?'text-red':'text-gray'">{{myCheckNoReadCount}}
					</view>
					<view class="cu-item text-gray text-sm">
						<text>当前消息</text>
					</view>
				</view>
			</view>
		</view>
		<view style="height: 2rpx;"> </view>
		<!--项目列表start-->
		<!-- 		<scroll-view scroll-x class="bg-white nav" scroll-with-animation>
		  <view class="cu-item" :class="index1==TabCur?'text-orange cur':''"
		   v-for="(item1,index1) in 10" :key="index1" @click=" selectProject(item1)">
		    {{index1}}某某项目哈哈哈哈
		  </view>
		</scroll-view> -->
		<!--项目列表end-->
		<scroll-view class="scroll-box " scroll-y style="height: 100%">
			<view class="">
				<view v-for="(item,index) in menuList" :key="index">
					<view class="cu-bar bg-white  " :class="index==0?'':'margin-top-xs'">
						<view class="action">
							<text class="cuIcon-title" :class="'text-'+item.color"></text> {{item.meta.title}}
						</view>
					</view>
					<view class="cu-list grid no-border" :class="['col-' + gridCol]">
						<view class="cu-item" @tap="toDetail(item1)" v-for="(item1,index1) in item.children"
							:key="index1" v-if="index1<item.children.length">
							<view v-if="item1.imgType=='SYSTEM'"
								:class="['cuIcon-' + item1.meta.icon,'text-' + item1.color]">
								<view class="cu-tag badge" v-if="item.query!=null&&item.query!=''">
									<block v-if="item.query!=''">{{item.query}}</block>
								</view>
							</view>
							<view v-if="item1.imgType=='USER_DEFINED'">
								<image :src="fileUrl+item1.image" mode="aspectFit" style="width: 35px;height: 35px;">
								</image>
								<view class="cu-tag badge" v-if="item.query!=null&&item.query!=''">
									<block v-if="item.query!=''">{{item.query}}</block>
								</view>
							</view>
							<text>{{item1.meta.title}}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="padding"></view>

		<view class="cu-modal " :class="modalName=='version'?'show':''">
			<view class="cu-dialog">
				<view class="" style="height:150px;">
					<image src="../../static/index/version.png"></image>
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub  solid-left">新版本更新提示</view>

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
	const app = getApp()
	import dateTime from '@/common/dateTime.js';
	import Request from '@/common/request.js';
	import webUrl from '@/common/config.js';
	export default {
		data() {
			return {
				index: -1,
				gridCol: 4,
				menuList: [],
				cardCur: 0,
				dotStyle: false,
				towerStart: 0,
				direction: '',
				TabCur: 0,
				bannerTopList: [],
				fileUrl: '',
				userInfo: {},

				myRepositoryCount: 0, //我的仓库数量
				myCheckNoReadCount: 0,

				downLoadRate: "10%",
				modalName: null,

				deviceType: '',
				versionInfo: {},

				siteInfo: {},
				picker: [],
				pageNum: 1,
				pageSize: 10
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onLoad() {
			let platform = uni.getSystemInfoSync().platform
			if ("ios" == platform) {
				this.deviceType = "IOS"
			}
			this.fileUrl = webUrl.BaseURL;
			this.getMyMenu()
			this.getMyCount()
			this.getVersionInfo()
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo')
			this.selectUnReadTotalMsg()
			this.getSiteList()
		},
		methods: {
			//点击选择项目
			selectProject(item) {

			},
			//获取我的项目数量
			getMyCount() {
				Request.get(Request.API.selectMyPlantCountByUserId).then(res => {
					this.myRepositoryCount = res.data.data
				})
			},
			//获取分配的工地列表
			getSiteList() {
				Request.get(Request.API.selectMyPlantByUserId, {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}).then(res => {
					if (res.data.code == 200) {
						let resData = res.data.rows
						if (resData.length > 0) {
							this.picker=resData
							this.index = 0
							let param={
								id:this.picker[this.index].id,
								name:this.picker[this.index].name
							}
					        uni.setStorageSync("plantInfo",param)
						}
					}
				})
			// 	Request.get(Request.API.mixingPlant + '/list').then(res => {
				
			// 	})
			},
			toSiteList() {
				uni.navigateTo({
					url: './siteList'
				})
			},
			PickerChange(e) {
				var index = e.detail.value;
				this.siteName = this.picker[index].name;
				this.siteId = this.picker[index].id;
				this.index = index
				let param={
					id:this.picker[index].id,
					name:this.picker[index].name
				}
				uni.setStorageSync("plantInfo",param)
			},
			//获取审核未读
			selectUnReadTotalMsg() {
				Request.get(Request.API.selectUnReadTotalMsg).then(res => {
					this.myCheckNoReadCount = res.data.data
				})
			},
			getIndexBannerTop() { //GET 轮播图列表（顶部）
				Request.get(Request.API.getIndexBannerTop).then(res => {
					if (res.data) {
						this.bannerTopList = res.data
					}
				})
			},
			getMyMenu() { //GET获取我的应用菜单列表
				Request.get(Request.API.getRouters).then(res => {
					uni.stopPullDownRefresh() //刷新数据之后停止刷新
					if (res.data.code == 200) {
						if (res.data.code == 200) {
							this.menuConvert(res.data.data);
						}
					}
				})
			},
			menuConvert(menuTemp) {
				if (menuTemp.length > 0) {
					for (let i = 0; i < menuTemp.length; i++) {
						if (menuTemp[i].meta.title == "应用") {
							if (menuTemp[i].path == "3" || menuTemp[i].path == "4" || menuTemp[i].path == "5") {
								this.gridCol = menuTemp[i].path
							}
							this.menuList = menuTemp[i].children;
							break;
						}
					}
				}
			},
			//前往仓库列表
			toRepo() {
				uni.navigateTo({
					url: './mixingPlant/list'
				})
			},
			//前往审核列表
			toCheckList() {
				uni.navigateTo({
					url: './check/list'
				})
			},
			toDetail(e) {
				console.log("进入页面", e)
				uni.navigateTo({
					url: e.path
				})
			},
			//获取最新APP版本信息
			getVersionInfo() {
				Request.get(Request.API.getLatestVersion, {
					type: this.deviceType
				}).then(res => {
					console.log("res", res.data)
					this.versionInfo = res.data.android
					this.checkUpdate();
				})
			},
			checkUpdate() {
				//#ifdef APP-PLUS
				plus.runtime.getProperty(plus.runtime.appid, (info) => {
					this.version = info.version;
					console.log("当前版本：" + this.version + "=====最新版本：" + this.versionInfo.version)
					if (this.version != '') {
						let that = this
						if (this.compareVersion(this.version, this.versionInfo.version) == -
							1) { //本地版本小于最新版本 提示更新
							this.modalName = "version";
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
					this.modalName = "versionDownLoad";
					let that = this
					var downloadApkUrl = this.fileUrl + this.versionInfo.url;
					var dtask = plus.downloader.createDownload(
						downloadApkUrl, {},
						function(d, status) {
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
				} else {
					let appleId = getApp().globalData.appAppleId
					plus.runtime.launchApplication({
						action: `itms-apps://itunes.apple.com/cn/app/id${appleId}?mt=8`
					}, function(e) {
						console.log('Open system default browser failed: ' + e.message);
					});
				}
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
			hideModal() {
				this.modalName = null
			}
		}
	}
</script>

<style>
	.screen-swiper {
		min-height: 275upx;
	}

	.slide-image {
		display: block;
		height: 260rpx;
		border-radius: 10rpx;
		margin: 10rpx auto;
		width: 94%;

	}

	.panel {

		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		border-bottom: 1px solid #F5F5F5;
	}

	.panel-title {
		width: 95%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		float: left;
		text-align: center;
		font-size: 15px;
		font-size: 10rpx;

	}
</style>