<template>
	<view>
		<view v-if="isShow" @touchmove.stop.prevent="moveHandle" class="sendModel">
			<view class="updateModel">
				<view :style="{background:themeColors}" class="title"><text style="color: #fff;font-size: 35rpx;" >{{title}}</text></view>
				<view class="box">
					<view class="content">
						<scroll-view class="scroll" scroll-y="true">
							{{update}}
						</scroll-view>
					</view>
					<view v-show="true" class="downSize">预计下载大小：<text>{{fileByte}}</text></view>
					<view class="progress">
						<view class="realTime">
							<view :style="{width:progress+'%',background:themeColors}" class="real"></view>
						</view>
						<view class="percent">{{progress}}%</view>
					</view>
					<view class="butModel">
						<button @tap="cancelDown()" type="default" class="cancelBut">取消</button>
						<button @tap="startDown()" :disabled="disabled" type="primary" class="cancelBut">下载</button>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	/**
	 * alertTips 更新组件
	 * @description 更新组件，用于app的更新
	 * @tutorial 1106901749@qq.com
	 * @property {Boolean} isShow 是否显示更新组件
	 * @property {String} themeColors 主题颜色，默认黑色
	 * @property {String} title 标题
	 * @property {String} downUrl 下载地址
	 * @property {String} fileSize 文件大小
	 * @property {String} update 更新内容
	 * @event {Function} isShow 取消事件回执
	 */
	export default {
		name: "tcx-update",
		props: {
			//下载地址
			downUrl: {
				type: String
			},
			//是否显示
			isShow: {
				type: Boolean,
				default: false
			},
			//文件大小
			fileSize:{
				type:Number
			},
			//主题色
			themeColors: {
				type: String,
				default: '#333333'
			},
			//标题
			title: {
				type: String,
				default: '标题'
			},
			//更新内容
			update: {
				type: String,
				default: '更新内容'
			},
		},
		computed: {
			fileByte() {
				return this.getFileSize(this.fileSize)
			}
		},
		data() {
			return {
				disabled: false,
				progress: 0, //进度条
				totalBytesExpectedToWrite: "", //文件大小
				cancel: false
			};
		},
		methods: {
			//文件大小转换
			getFileSize(fileByte) {
				var fileSizeByte = fileByte;
				var fileSizeMsg = "";
				if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB";
				else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
				else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024))
					.toFixed(2) + "MB";
				else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) fileSizeMsg = "1GB";
				else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 *
					1024 * 1024)).toFixed(2) + "GB";
				else fileSizeMsg = "文件超过1TB";
				return fileSizeMsg;
			},
			//取消更新
			cancelDown() {
				uni.showModal({
					title: "提示",
					content: "您确定要取消更新？",
					success: (res) => {
						if (res.confirm) {
							this.$emit('isShow', {
								cancel: true
							})
							this.cancel = true
						}
					}
				})
			},
			//开始下载
			startDown() {
				if (!this.downUrl) {
					uni.showToast({
						icon: "none",
						title: "您当前已是最新版本!"
					})
					return;
				}
				let type = this.downUrl.substr(this.downUrl.length - 3, 3)
				if (type === "wgt") {
					console.log('小版本更新')
				} else if (type === "apk") {
					console.log('大版本更新')
					// uni.showModal({
					// 	title:"提示",
					// 	content:"即将跳转到外部下载，请下载完自行安装最新的安装包",
					// 	success: (res) => {
					// 		if(res.confirm){
					// 			plus.runtime.openURL(this.downUrl);
					// 		}
					// 	}
					// })
					// return
				}
				//下载文件到本地
				let downloadTask = uni.downloadFile({
					url: this.downUrl,
					success: (res) => {
						if (res.statusCode === 200) {
							var update = res.tempFilePath;
							uni.showModal({
								title: "安装提示",
								content: "下载完成，即将重启安装",
								showCancel: false,
								success: (res) => {
									if (res.confirm) {
										plus.runtime.install(update, {
											force: false
										}, (a) => {
											console.log(a);
											plus.runtime.restart();
										}, (e) => {
											console.log(e)
											this.progress = 0;
										});
									}
								}
							})
							
						}
					}
				})
				downloadTask.onProgressUpdate((res) => {
					// console.log(res)
					this.totalBytesExpectedToWrite = this.getFileSize(res
						.totalBytesExpectedToWrite); //预期需要下载的数据总长度，单位 Bytes
					this.progress = res.progress; //	下载进度百分比
					//    // 取消下载任务。
					if (this.cancel) {
						this.progress = 0;
						downloadTask.abort();
						console.log('取消了')
					}
				});
			},
		}
	}
</script>

<style lang="less" scoped>
	.center {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.sendModel {
		background-color: rgba(0, 0, 0, 0.4);
		position: fixed;
		top: 0;
		height: 100%;
		width: 100%;
		z-index: 50;
		.center
	}

	.updateModel {
		background-color: #FFFFFF;
		border-radius: 20rpx;
		height: 560rpx;
		width: 620rpx;
		display: flex;
		flex-direction: column;

		.title {
			height: 90rpx;
			.center;
			font-size: 35rpx;
			border-radius: 20rpx 20rpx 0rpx 0rpx;
		}

		.box {}

		.content {
			height: 280rpx;
		}

		.scroll {
			height: 280rpx;
			font-size: 30rpx;
			padding: 10rpx;
			width: 98%;
			margin: auto;
		}

		.downSize {
			padding: 2rpx 10rpx;
			font-size: 26rpx;
			color: #9e9e9e;
		}

		.progress {
			height: 35rpx;
			margin: 20rpx 10rpx 0rpx 10rpx;

			.realTime {
				width: 85%;
				height: 20rpx;
				float: left;
				background-color: #ebebeb;
				border-radius: 20rpx;
				display: flex;
				flex-direction: row;
			}

			.real {
				height: 20rpx;
				border-radius: 20rpx;
				position: relative;
				overflow: hidden;
			}

			.real::after {
				content: "";
				height: 20rpx;
				position: absolute;
				left: 0;
				top: 0;
				box-shadow: -2rpx 0 20rpx 14rpx #fff;
				animation-name: breathe, flicker;
				animation-duration: 3s, 2s;
				animation-timing-function: linear;
				animation-iteration-count: infinite;
			}

			.percent {
				float: left;
				font-size: 28rpx;
				line-height: 20rpx;
				padding-left: 10rpx;
			}
		}

		.butModel {
			// background-color: #007AFF;
			display: flex;
			flex-direction: row;
			padding: 20rpx;
		}

		.cancelBut {
			height: 65rpx;
			line-height: 65rpx;
			width: 40%;
			font-size: 30rpx;
		}
	}

	@keyframes breathe {
		0% {
			transform: translateX(-10rpx);
			opacity: 1;
		}

		100% {
			opacity: 1;
			transform: translateX(600rpx);
		}
	}

	@keyframes flicker {
		0% {
			opacity: 1;
		}

		20% {
			opacity: 0.6;
		}

		40% {
			opacity: 1;
		}

		60% {
			opacity: 0.6;
		}

		80% {
			opacity: 1;
		}

		100% {
			opacity: 0.6;
		}
	}
</style>
<!-- 
@author 檀陈鑫
@Email 1106901749@qq.com
 -->
