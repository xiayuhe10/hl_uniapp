<template>
	<view class="content avatarwrap">
		<view class=" bg-white">
			<view class="cu-bar   ">
				<view class="action">
					<text class="cuIcon-title text-blue"></text> 首页应用
					<text class="text-red text-sm" v-if="showDeleteFlag">（长摁元素可以移动）</text>
				</view>
			</view>
			<view class="" style="padding: 0 30rpx;">
				<AppList ref='appList' :listData="firstMenuList" @getInto='getInto' @listChange="listChange"
					@showDelWatch='showDelWatch' @deleteAppItem='deleteAppItem'></AppList>
			</view>
		</view>
		<scroll-view class="scroll-box margin-top-xs" scroll-y style="height: 100%">
			<view class="">
				<view v-for="(item,index) in menuList" :key="index">
					<view class="cu-bar bg-white  " :class="index==0?'':'margin-top-xs'">
						<view class="action">
							<text class="cuIcon-title" :class="item.color"></text> {{item.meta.title}}
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
								<image :src="fileUrl+item1.image" mode="aspectFit" style="width: 22px;height: 22px;">
								</image>
								<view class="cu-tag badge" v-if="item.query!=null&&item.query!=''">
									<block v-if="item.query!=''">{{item.query}}</block>
								</view>
							</view>
							<text>{{item1.meta.title}}</text>
							<view class="cuIcon-roundaddfill   text-blue " @tap="addAppItem(item1)"
								v-if="showDeleteFlag && !myMenuID.includes(item1.meta.menuId)"
								style="position: absolute;top: 0;left: 11%; font-size: 32rpx;"></view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- <view>
			<button @click="gotoFileList">班级文件</button>
		</view> -->
	</view>
</template>

<script>
	import dateTime from '@/common/dateTime.js';
	import Request from '@/common/request.js';
	import webUrl from '../../common/config.js';
	import dragAndDropSort from '@/components/dropSort/dropSort.vue';
	import AppList from '@/components/dropSort/healer-dragList/AppList.vue';
	export default {
		components: {
			dragAndDropSort,
			AppList
		},
		data() {
			return {
				gridCol: 5,
				menuList: [],
				firstMenuList: [],
				cardCur: 0,
				dotStyle: false,
				towerStart: 0,
				direction: '',
				showDeleteFlag: false,
				listChangeList: [],
				myMenuID: [],
				userInfo: {},
				fileUrl: ''
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.getMenuList()
			this.getMyMenu()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onLoad(e) {
			this.userInfo = uni.getStorageSync('userInfo')
			this.fileUrl = webUrl.fileURL
			this.getMenuList()
			this.getMyMenu()
		},
		onShow() {

		},
		onNavigationBarButtonTap(e) {
			this.$refs.appList.showDelChange("把你修改了");
			if (this.showDeleteFlag) {
				this.saveMyMenuList()
			}
		},
		methods: {
			getMenuList() { //获取教师端菜单
				if (this.userInfo.userType != '02') {
					Request.get(Request.API.getRouters).then(res => {
						//刷新数据之后停止刷新
						uni.stopPullDownRefresh()
						if (res.data.code == 200) {
							this.menuConvert(res.data.data);
						}
					})
				} else {
					Request.get(Request.APIPAR.getRouters).then(res => {
						if (res.data.code == 200) {
							this.menuParConvert(res.data.data);
						}
					})
				}
			},
			getMyMenu() { //GET获取教师端应用菜单列表
				if (this.userInfo.userType != '02') {
					Request.get(Request.API.getMyMenu).then(res => {
						if (res.data.code == 200) {
							this.firstMenuList = res.data.data
							this.firstMenuID()
						}
					})
				} else {
					Request.get(Request.APIPAR.getMyMenu).then(res => {
						uni.stopPullDownRefresh() //刷新数据之后停止刷新
						if (res.data.code == 200) {
							this.firstMenuList = res.data.data
							this.firstMenuID()
						}
					})
				}
				this.$forceUpdate() // dom会更新
			},
			firstMenuID() {
				let valueID = []
				let pushChange = this.firstMenuList
				pushChange.forEach(function(value, index) {
					if (value.menuId) {
						valueID.push(value.menuId)
					}
				})
				this.myMenuID = valueID
				// console.info('myMenuID', this.myMenuID)
			},
			menuParConvert(menuTemp) {
				if (menuTemp.length > 0) {
					for (let i = 0; i < menuTemp.length; i++) {
						if (menuTemp[i].meta.title == "广播站") {
							if (menuTemp[i].path == "3" || menuTemp[i].path == "4" || menuTemp[i].path == "5") {
								this.gridCol = menuTemp[i].path
							}
							this.menuList = menuTemp[i].children
							break;
						}
					}
				}
			},
			menuConvert(menuTemp) {
				// console.log(menuTemp);
				if (menuTemp.length > 0) {
					for (let i = 0; i < menuTemp.length; i++) {
						// console.log("目录", menuTemp[i]);
						if (menuTemp[i].meta.title == "应用") {
							if (menuTemp[i].path == "3" || menuTemp[i].path == "4" || menuTemp[i].path == "5") {
								this.gridCol = menuTemp[i].path
							}
							this.menuList = menuTemp[i].children;
							// console.log("应用菜单", this.menuList);
							break;
						}
					}
				}
			},
			saveMyMenuList(option) { //POST 保存我的应用菜单列表
				let that = this
				let pushs = this.firstMenuList
				Request.post(Request.API.saveMyMenuList, pushs).then(res => {
					if (res.data.code == 200) {
						uni.showToast({
							title: '保存成功',
							icon: 'none',
							duration: 2000
						})
						setTimeout(function() {
							that.getMenuList()
							that.getMyMenu()
						}, 300);
					} else {
						// uni.showToast({ title: '保存失败', icon: 'none', duration: 2000 })
					}
					// console.info("保存我的应用菜单列表", res.data)
				})
			},
			listChange(option) {
				if (this.showDeleteFlag) {
					// this.saveMyMenuList(option)
				}
				this.listChangeList = option
				// console.log("父页面listChange", option)
			},
			addAppItem(value) {
				let push = value
				value.name = value.meta.title
				value.icon = value.meta.icon
				value.menuId = value.meta.menuId
				if (this.firstMenuList.length < 9) {
					this.firstMenuList.push(push)
					this.firstMenuID(this.firstMenuList)
				} else {
					uni.showToast({
						title: '最多可以配置9个菜单',
						icon: 'none',
						duration: 2000
					})
				}

				// console.log("添加", push)
			},
			deleteAppItem(option) {
				this.firstMenuID(this.firstMenuList)
				// console.log("父页面deleteAppItem", option)
			},
			toDetail(e) {
				console.log("进入页面", e.isFrame)
				if (!this.showDeleteFlag) {
					if (e.isFrame == 0) { //外链
						this.openPlusURL(e.path)
					} else {
						uni.navigateTo({
							url: e.path
						})
					}

				}
			},
			openPlusURL(url) {
				console.info(url)
				// #ifdef APP-PLUS
				plus.runtime.openURL(url);
				// #endif
				// #ifdef H5
				window.location.href = url
				// #endif
			},
			getInto(option) {
				if (!this.showDeleteFlag) {
					if (option.isFrame == 0) { //外链
						this.openPlusURL(option.path)
					} else {
						uni.navigateTo({
							url: option.path
						})
					}
				}
			},
			showDelWatch(option) {
				this.showDeleteFlag = option
				let name = option ? '保存  ' : '管理  '
				// #ifdef APP-PLUS
				this.getAddShow(name)
				// #endif
			},
			getAddShow(name) {
				let pages = getCurrentPages();
				let page = pages[pages.length - 1];
				let currentWebview = page.$getAppWebview();
				let tn = currentWebview.getStyle().titleNView;
				tn.buttons[0].text = name;
				currentWebview.setStyle({
					titleNView: tn
				});
				// console.info('打印tn', tn)
			},
			gotoFileList() {
				uni.navigateTo({
					url: "../parent/fileList/fileList"
				})
			}
		}
	}
</script>

<style>
	.page {
		height: 100Vh;
		width: 100vw;
	}

	.avatarwrap {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: calc(100vh - var(--window-top));
	}

	.avatarwrap .scroll-box {
		flex: 1;
		overflow: scroll;
	}

	.cuIconShow {
		position: absolute;
		top: 10rpx;
		right: 0rpx;
		font-size: 12rpx;
		z-index: 2;
	}

	.solid-bottom {
		border-bottom: 1px solid #E5E5E5;
	}
</style>