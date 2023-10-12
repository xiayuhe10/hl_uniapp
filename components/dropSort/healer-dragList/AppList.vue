<template>
	<view class="">
		<!-- 可移动区域容器 -->
		<movable-area class="movarea" ref="areaBox" id="areaBox">
			<!-- 这块只是循环出固定内容，监听其元素touch事件获取坐标 -->
			<view class="appList">
				<view class="app-li " v-for="(appItem,index) in listData_c" :key="index" :id="'appLi' + index"
					:class="(hoverClass==='appLi'+index)?'select':''" @touchstart="AppLi_touchstart(index,$event)"
					@touchmove="AppLi_touchmove" @touchend="AppLi_touchend(index)" @longpress="longFlagShow()">
					<view v-if="appItem.imgType=='SYSTEM'"
						:class="['appIcon','cuIcon-' + appItem.icon,'text-' + appItem.color]">
						<view class=" cuIcon-move cu-tag badge bg-grey margin-right margin-top-sm"
							@tap="deleteAppItem(index)" v-if="showDelete"
							:class="deleteAppID==appItem.appId && showDelete?'':'hide'"></view>
						<!-- <view class="cu-tag badge margin-right-sm margin-top-sm"
							v-if="!showDelete&& appItem.query!=null&&appItem.query!=''">
							<block v-if="appItem.query!=''">{{appItem.query}}</block>
						</view> -->
					</view>
					<view v-if="appItem.imgType=='USER_DEFINED'">
						<image :src="fileUrl+appItem.image" mode="aspectFit" style="width: 22px;height: 22px;">
							<view class=" cuIcon-move cu-tag badge bg-grey margin-right margin-top-sm"
								@tap="deleteAppItem(index)" v-if="showDelete"
								:class="deleteAppID==appItem.appId && showDelete?'':'hide'"></view>
						</image>
					</view>

					<view class="appName">{{appItem.name}}</view>
				</view>
				<!-- <view class="app-li text-blue" @tap="addAppItem">
					<text class="appicon cuIcon-roundadd"></text>
				</view> -->
			</view>
			<!-- 滑块 -->
			<movable-view v-if="moviewShow" :animation="false" class="moveV " :x="moveX" :y="moveY" direction="all"
				:style="{ width: moveViewSize + 'px', height: 160 + 'rpx' }">
				<text :class="['appIcon','cuIcon-' + touchItem.icon,'text-' + touchItem.color]"></text>
				<text class="appName">{{touchItem.name}}</text>
			</movable-view>


		</movable-area>
		<!-- 新增模态 -->
		<!-- <Modal ref="addAppItem" title="添加" @confirm="confirm">
			<InputUnify ref="addAppInput" title="名字" placeholder="请输入应用名"></InputUnify>
		</Modal> -->
	</view>
</template>

<script>
	import InputUnify from "@/components/dropSort/unify-input.vue"
	import webUrl from '@/common/config.js';
	export default {
		name: "AppList",
		props: {
			listData: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data() {
			return {
				fileUrl: webUrl.fileURL,
				listData_c: this.listData, //缓存props，(不建议直接修改props)
				// CheckAppId: null,
				deleteAppID: null, //触发删除的itemID
				showDelete: false, //删除按钮状态
				IsDeleteAfter: false, //是否为删除后
				IsCancelDelete: false, //是否为取消后
				moviewShow: false, //滑块状态
				areaBoxInfo: null, //保存滑动区域盒子dom信息
				inBoxXY: {}, //鼠标在item中的坐标
				touchIndex: 0, //被移动index
				touchItem: '', //备份被移动item数据
				moveX: 0, //相对滑动盒子的坐标
				moveY: 0, //相对滑动盒子的坐标
				hoverClass: '',
				hoverClassIndex: null, //最终index
				checkIndex: '',
				longFlag: false
			};
		},
		watch: {
			listData_c(val) {
				this.$emit("listChange", val)
				// console.log(val, "监听listChange")
			},
			showDelete(val) {
				this.$emit("showDelWatch", val)
				// console.log(val, "监听showDelete")
			},
			listData: {
				handler: function(val) {
					this.listData_c = val
					this.$nextTick(() => {
						// this.showDelete = false;
						// this.checkIndex = null;
						// this.IsDeleteAfter = true;
						this.resetListDom()
					});
					// console.log(val, "监听val")
				},
				immediate: true, //--首次加载时执行监听
				deep: true //--值改变时执行监听
			},
		},
		computed: {
			moveViewSize() {
				if (this.areaBoxInfo && this.areaBoxInfo.width) {
					return this.areaBoxInfo.width / 5
				} else {
					return 0
				}
			}
		},
		components: {
			InputUnify
		},
		mounted() {
			// 获取dom信息
			this.resetListDom()
		},
		methods: {
			longFlagShow() {
				this.longFlag = true
				console.info('长摁了')
			},
			showDelChange(val) { // 管理按钮改变
				this.showDelete = !this.showDelete
				// console.log(val, "监听showDelChange")
			},
			getDomInfo(id, callBack) {
				// console.info('getDomInfo',id, callBack)
				const query = uni.createSelectorQuery().in(this);
				query.select('#' + id)
					.boundingClientRect()
					.exec(function(res) {
						callBack(res[0]);
					});
			},
			// 添加
			addAppItem() {
				this.$refs.addAppItem.ModalStatus()
			},
			confirm() {
				let appItem = {
					appId: this.listData_c.length + 1,
					appIcon: "cuIcon-pic",
					appName: this.$refs.addAppInput.value,
					appLink: "",
				};
				this.listData_c.push(appItem);
				this.$refs.addAppInput.resetVal();
				this.$nextTick(() => {
					this.resetListDom()
				});

			},
			AppLi_touchstart(index, event) {
				let that = this
				this.touchItem = this.listData_c[index];
				// 行为判断
				if (this.showDelete) {
					// 取消删除
					if (this.touchItem.appId != this.deleteAppID) {
						this.deleteAppID = null;
						this.showDelete = false;
						this.IsCancelDelete = true;
					}
					// 删除
					// if(this.touchItem.appId==this.deleteAppID){
					// 	this.deleteAppItem(index)
					// }
				}
				if (this.showDelete) {
					// 过时触发（touchEnd中清除此定时器）
					this.Loop = setTimeout(
						() => {
							// 触感反馈（安卓上是150毫秒，ios无短触控反馈）
							uni.vibrateShort();
							// this.showDelete = true;
							this.deleteAppID = this.touchItem.appId;
							// 拖动逻辑
							//显示可移动方块
							this.moviewShow = true
							//保存当前所选择的索引
							this.touchIndex = index;
							// 设置可移动方块的初始位置为当前所选中图片的位置坐标
							this.moveX = this.listData_c[index].x;
							this.moveY = this.listData_c[index].y;
							var x = event.changedTouches[0].clientX - this.areaBoxInfo.left;
							var y = event.changedTouches[0].clientY - this.areaBoxInfo.top;
							// 保存鼠标在图片内的坐标
							this.inBoxXY = {
								x: x - this.listData_c[index].x,
								y: y - this.listData_c[index].y,
							}
						},
						500);
				}
			},
			AppLi_touchmove(event) {
				if (this.longFlag) {
					// 每次endTouch清除startTouch删除按钮定时器
					if (this.Loop) {
						clearTimeout(this.Loop);
						this.Loop = null;
					}
					if (this.showDelete) {
						let areaBoxTop = this.areaBoxInfo.top;
						let areaBoxLeft = this.areaBoxInfo.left;
						//重置为以拖拽盒子左上角为坐标原点
						var x = event.changedTouches[0].clientX - areaBoxLeft;
						var y = event.changedTouches[0].clientY - areaBoxTop;
						this.moveX = x - this.inBoxXY.x;
						this.moveY = y - this.inBoxXY.y;
						let setIng = false;
						this.listData_c.forEach((item, idx) => {
							if (x > item.x && x < item.x + 80 && y > item.y && y < item.y + 80) {
								this.hoverClass = 'appLi' + idx
								this.hoverClassIndex = idx;
								setIng = true
							}
						});
						// 都不存在代表脱离
						if (!setIng) {
							this.hoverClass = ""
							this.hoverClassIndex = null;
						}
					}
				}
			},
			AppLi_touchend(index) {
				if (!this.showDelete && !this.IsDeleteAfter && !this.IsCancelDelete) {
					this.getInto(this.touchItem)
				}
				if (this.longFlag) {
					if (!this.showDelete && !this.IsDeleteAfter && !this.IsCancelDelete) {} else {
						// 为下次getInto清除状态
						this.IsDeleteAfter = false;
						this.IsCancelDelete = false;
						// 移动结束隐藏可移动方块
						if (this.hoverClassIndex != null && this.touchIndex != this.hoverClassIndex) {
							this.$set(this.listData_c, this.touchIndex, this.listData_c[this.hoverClassIndex]);
							this.$set(this.listData_c, this.hoverClassIndex, this.touchItem);
							// this.showDelete = false;
							this.resetListDom()
						}
						this.touchItem = ""
						this.moviewShow = false
						this.hoverClass = ""
						this.hoverClassIndex = null;
					}
					// 每次endTouch清除startTouch删除按钮定时器
					if (this.Loop) {
						clearTimeout(this.Loop);
						this.Loop = null;
					}
				} else {
					this.touchItem = ""
					this.moviewShow = false
					this.hoverClass = ""
					this.hoverClassIndex = null;
					if (this.Loop) {
						clearTimeout(this.Loop);
						this.Loop = null;
					}
				}
				this.longFlag = false
			},
			deleteAppItem(index) {
				this.listData_c.splice(index, 1)
				// this.showDelete = false;
				this.checkIndex = null;
				this.IsDeleteAfter = true;
				this.resetListDom()
				this.$emit('deleteAppItem', this.listData_c);
				// if (this.listData_c.length > 5) {
				// 	this.listData_c.splice(index, 1)
				// 	// this.showDelete = false;
				// 	this.checkIndex = null;
				// 	this.IsDeleteAfter = true;
				// 	this.resetListDom()
				// 	this.$emit('deleteAppItem', this.listData_c);
				// } else {
				// 	uni.showToast({
				// 		title: '最少留5个菜单',
				// 		icon: 'none',
				// 		duration: 2000
				// 	})
				// }
			},
			getInto(item) {
				// uni.showToast({
				// 	title: "进入" + path,
				// 	icon: "none"
				// })
				this.$emit('getInto', item);
			},
			resetListDom() {
				let _this = this;
				this.getDomInfo('areaBox', info => {
					_this.areaBoxInfo = info;
					// 设置区域内所有图片的左上角坐标
					_this.listData_c.forEach((item, idx) => {
						_this.getDomInfo('appLi' + idx, res => {
							item.x = res.left - info.left;
							item.y = res.top - info.top;
						});
					});
				});
			},
			boxClick() {
				this.deleteAppID = null;
				this.showDelete = false;
			}
		}
	}
</script>

<style lang="scss">
	.movarea {
		width: 100%;
		height: auto;
	}

	.appList {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	.app-li {
		width: 20%;
		height: 160rpx;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		padding: 10rpx;
		position: relative;

		.appIcon {
			font-size: 60rpx;
		}

		.appName {
			font-size: 24rpx;
		}

		.cuIcon-roundadd {
			font-size: 60rpx;
			color: #CCCCCC;
		}

		.cuIcon-roundclosefill {
			position: absolute;
			top: 12rpx;
			right: 12rpx;
			font-size: 36rpx;
			z-index: 2;

			&.hide {
				display: none;
			}
		}
	}

	.moveV {
		opacity: 0.8;
		z-index: 999;
		width: 100rpx;
		height: 160rpx;
		box-sizing: border-box;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		padding: 20rpx;

		.appIcon {
			font-size: 60rpx;
		}

		.appName {
			font-size: 24rpx;
		}
	}

	.select {
		// transform: scale(1.3);
		border-radius: 16rpx;
		border: 1px dashed #C0C0C0;
		color: #C0C0C0;
	}
</style>