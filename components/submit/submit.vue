<template>
	<view>
		<view class="submit">
			<view class="submit-chat ">
				<view class="bt-img" @tap="records">
					<image :src="toc"></image>
				</view>
				<!-- 文本框 -->
				<!-- <textarea auto-height="true" class="chat-send btn inputs" :class="{displaynone:isrecord}"
					@input="inputs" @focus="focus" v-model="msg" @blur="loseNamefocus"></textarea> -->
				<view class="content-wrap" v-if="!isrecord">
					<textarea class="content" @input="inputs" @focus="focus" v-model="msg" @blur="loseNamefocus"
						maxlength="-1" auto-height :adjust-position="true" />
				</view>
				<view class="content-wrap" :class="{displaynone:!isrecord}" @longpress="touchstart" @touchend="touchend"
					@touchmove="touchmove">
					<view class="content text-center">
						按住说话
					</view>
				</view>
				<!-- <view class="record btn" :class="{displaynone:!isrecord}" @longpress="touchstart" @touchend="touchend"
					@touchmove="touchmove">
					按住说话
				</view> -->
				<view class="bt-img" @tap="emoji">
					<image src="../../static/icon/emoji.png"></image>
				</view>
				<view class="bt-img" @tap="more" v-if="!isShowSend">
					<image src="../../static/icon/plus.png"></image>
				</view>
				<view class="" @tap="more">
					<view class="emoji-send-bt" v-if="isShowSend" @tap="emojiSend">发送</view>
				</view>
			</view>
			<!-- 表情 -->
			<view class="emoji" :class="{displaynone:!isemoji}">
				<emoji @emotion="emotion" :height="260"></emoji>
			</view>
			<!-- 更多 -->
			<view class="more" :class="{displaynone:!ismore}">
				<view class="more-list" @tap="sendImg">
					<image src="../../static/icon/picture.png"></image>
					<view class="more-list-title">图片</view>
				</view>
				<view class="more-list" @tap="sendVideo">
					<image src="../../static/icon/video.png"></image>
					<view class="more-list-title">视频</view>
				</view>
				<!-- <view class="more-list">
					<image src="../../static/icon/file.png"></image>
					<view class="more-list-title">文件</view>
				</view> -->
				<view class="more-list" @tap="call_phone(phone)"  v-if="flag!= 'GROUP'">
					<image src="../../static/message/ihpone.png"></image>
					<view class="more-list-title">拨号</view>
				</view>
				<view class="more-list" v-if="flag== 'GROUP'">
					<!-- <image src="../../static/icon/file.png"></image> -->
					<lsj-upload ref="lsjUpload" childId="upload1" height="120rpx" width="50px" :option="option"
						:size="10" :debug="true" :instantly="true" @progress="onprogress" @change="onChange">
						<view class="" @click="addUpload()">
							<image src="../../static/icon/file.png"></image>
							<view class="more-list-title">文件</view>
						</view>
					</lsj-upload>
				</view>
				
			</view>
		</view>
		<view class="voice-bg" :class="{displaynone:!voicebg}">
			<view class="voice-bg-len">
				<view class="voice-bg-time" :style="{width:vlength/0.6+'%'}">
					{{vlength}}″
				</view>
				<view class="voice-del" @click="touchend()">上滑取消录音</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 引入组件
	import emoji from '../emoji/emoji.vue';
	import webUrl from '@/common/config.js';
	import Request from '@/common/request.js';
	import dateTime from '@/common/dateTime.js';
	import lsjUpload from '@/uni_modules/lsj-upload/components/lsj-upload/lsj-upload.vue';
	import permision from '@/js_sdk/wa-permission/permission.js';
	// 录音
	const recorderManager = uni.getRecorderManager();
	export default {
		props: {
			flag: {
				type: String,
				default: null
			},
			phone: {
				type: String,
				default: null
			},
		},
		data() {
			return {
				// 上传接口参数
				option: {
					// 上传服务器地址，此地址需要替换为你的接口地址
					url: webUrl.BaseURL + Request.API.upload,
					// 上传附件的key
					name: 'file',
					// 根据你接口需求自定义请求头
					header: {
						Authorization: uni.getStorageSync('token')
					},
					// 根据你接口需求自定义body参数
					formData: {
						// 'orderId': 1000
					}
				},
				// 文件回显列表
				files: new Map(),
				// 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
				wxFiles: [],
				// 演示用
				list: [],
				isrecord: false,
				isemoji: false,
				ismore: false,
				voicebg: false,
				pageY: 0,
				msg: "",
				// 直接引用地址可能出不来，需要用require
				toc: require('../../static/icon/voice.png'),
				// recorderManager: uni.getRecorderManager(),
				timer: '', //计时器
				vlength: 0,
				timesSend: 0,
				isShowSend: false,
			};
		},
		components: {
			emoji,
		},
		watch: {
			msg(newValue, oldValue) {
				if (newValue != '' && newValue != null) {
					this.isShowSend = true;
					this.ismore = false;
				} else {
					this.isShowSend = false;
					this.ismore = false;
				}
			}
		},
		onShow() {
			this.voicebg = false;
		},
		onHide() { // 页面关闭页面销毁时关闭音频, 避免页面切换音频还在播放
			recorderManager && recorderManager.onStop(() => {})
		},
		methods: {
			call_phone(phone) { //点击事件：拨打电话
				console.info(phone)
				// 真机拨打
				plus.device.dial(phone, true);
			},
			addUpload() {
				console.info(1111111111111111111111111111111111111111111111)
				this.$refs.lsjUpload.clear();
				this.$refs.lsjUpload.hide();
				this.$refs.lsjUpload.create();
				// this.$refs.lsjUpload.hide();
				// this.$refs.lsjUpload.show();
				this.$refs.lsjUpload.onClick();
			},
			//获取高度方法
			getElementHeight() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.submit').boundingClientRect(data => {
					this.$emit('heights', data.height);
				}).exec();
			},
			//切换音频
			records() {
				//切换的时候关闭其他界面
				this.ismore = false
				this.isemoji = false
				//切换高度
				setTimeout(() => {
					this.getElementHeight();
				}, 10)
				if (this.isrecord) {
					this.isrecord = false;
					this.toc = require("../../static/icon/voice.png");

				} else {
					this.record()
					this.isrecord = true;
					this.toc = require("../../static/icon/jianpan.png");
				}
			},
			async record() {
				let env = uni.getSystemInfoSync().platform
				let that = this
				console.info(env)
				if (env === 'android') {
					permision.requestAndroidPermission('android.permission.RECORD_AUDIO').then((e) => {
						if (e === -1) {
							that.recordShowModal('您已经永久拒绝录音权限，是否在应用设置中手动打开')
							// uni.showToast({
							// 	title: '您已经永久拒绝录音权限，请在应用设置中手动打开',
							// 	icon: 'none',
							// })
							return
						} else if (e === 0) {
							that.recordShowModal('您拒绝了录音授权，是否手动打开')
							// uni.showToast({
							// 	title: '您拒绝了录音授权',
							// 	icon: 'none',
							// })
							return
						} else if (e === 1) {
							this.show = true
						} else {
							that.recordShowModal('授权返回值错误，是否手动打开')
							// uni.showToast({
							// 	title: '授权返回值错误',
							// 	icon: 'none',
							// })
							return
						}
					}).catch((err) => {
						that.recordShowModal('拉起录音授权失败，是否手动打开')
						// uni.showToast({
						// 	title: '拉起录音授权失败',
						// 	icon: 'none',
						// })
						return
					})
				} else if (env === 'ios') {
					if (permision.judgeIosPermission("record"))
						this.show = true
					else
						uni.showToast({
							title: '您拒绝了录音授权，请在应用设置中手动打开',
							icon: 'none',
						})
					return
				}
			},
			recordShowModal(msg) {
				uni.showModal({
					title: '提示',
					content: msg,
					success: function(res) {
						if (res.confirm) {
							console.log('点击了确认')
							permision.gotoAppPermissionSetting()
						} else {
							console.log('点击了取消')
						}
					}
				})
			},
			// 表情
			emoji() {
				this.isemoji = !this.isemoji;
				//切换的时候关闭其功能
				this.ismore = false
				this.isrecord = false;
				this.toc = require("../../static/icon/voice.png");
				//切换高度
				setTimeout(() => {
					this.getElementHeight();
				}, 10)
			},
			//接收表情
			emotion(e) {
				console.log(e),
					this.msg = this.msg + e
			},
			//文字发送
			inputs(e) {
				var chatm = e.detail.value;
				var pos = chatm.indexOf('\n');
				if (pos != -1 && chatm.length > 1) {
					// 0为表情和文字
					// this.send(this.msg, 'TEXT')
					this.ismore = false
				}
				this.isShowSend = true
			},
			// 输入框聚焦
			focus() {
				//关闭其他项
				// this.isemoji = false;
				// this.ismore = false;
				// setTimeout(() => {
				// 	this.getElementHeight()
				// }, 10)
			},
			loseNamefocus(e) {
				console.info(e)
				this.isemoji = false;
				this.ismore = false;
				setTimeout(() => {
					this.getElementHeight()
				}, 10)
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
			},
			// 表情内发送
			emojiSend() {
				if (this.msg.length > 0) {
					//0为表情和文字
					this.send(this.msg, 'TEXT')
				}
			},
			// 表格退格
			emojiBack() {
				if (this.msg.length > 0) {
					this.msg = this.msg.substring(0, this.msg.length - 1);
				}
			},
			//更多功能
			more() {
				this.ismore = !this.ismore;
				//切换的时候关闭其他界面
				this.isemoji = false
				this.isrecord = false;
				this.toc = require("../../static/icon/voice.png");
				setTimeout(() => {
					this.getElementHeight();
				}, 10)
			},
			//图片发送
			sendImg(e) {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: [e],
					success: (res) => {
						const tempFilePaths = res.tempFilePaths[0]
						let token = uni.getStorageSync('token');
						uni.uploadFile({
							url: webUrl.BaseURL + Request.API.upload,
							filePath: tempFilePaths,
							name: 'file',
							header: {
								Authorization: token
							},
							success: (myres) => {
								let returnData = JSON.parse(myres.data);
								if (returnData.code!=200) {
									uni.showToast({ title: returnData.msg, icon: 'none', duration: 2000 })
								}
								this.send(returnData.data.url, 'IMAGE');
							},
							fail: (err) => {
								uni.hideLoading()
								uni.showToast({ title: err, icon: 'none', duration: 2000 })
								console.log('请求失败', err)
							}
						});
					}
				});
			},
			sendVideo() {
				uni.chooseVideo({
					maxDuration: 60, //拍摄视频最长拍摄时间，单位秒。最长支持 60 秒
					count: 1,
					sourceType: ['album'],
					success: res => {
						uni.showLoading({
							title: '视频上传中...'
						});
						let videoPaths = res.tempFilePath
						uni.uploadFile({
							url: webUrl.BaseURL + Request.API.upload,
							header: {
								'Authorization': uni.getStorageSync('token')
							},
							filePath: videoPaths,
							name: 'file',
							success: (myres) => {
								console.info("上传的视频", myres)
								let returnData = JSON.parse(myres.data);
								// this.send(returnData.data.url, 'VIDEO');
								this.send(returnData.data, 'VIDEO');
								uni.hideLoading()
							},
						})
					}
				})
			},
			//音频处理
			//开始录音
			touchstart(e) {
				if (e.touches.length > 1) {
					return;
				}
				console.log("开始录音")
				console.log("点击产生数据", e)
				this.pageY = e.changedTouches[0].pageY;
				this.voicebg = true;
				let i = 1;
				this.timer = setInterval(() => {
					this.vlength = i;
					i++;
					console.log("计时器开始工作,第几秒", i)
					//结束计时
					if (i > 60) {
						clearInterval(this.timer);
						this.touchend();
					}
				}, 1000)
				recorderManager && recorderManager.start({
					format: 'mp3'
				});
			},
			//删除录音
			touchmove(e) {
				if (this.pageY - e.changedTouches[0].pageY > 100) {
					// 关闭录音界面
					this.voicebg = false;
					this.vlength = 0
				}
			},
			// 结束录音
			touchend() {
				console.log("结束录音")
				if (!this.voicebg) {
					clearInterval(this.timer);
					return
				}
				// this.voicebg = false;
				if (this.vlength < 1) {
					console.info("时间不够", this.vlength)
					uni.showToast({
						title: '说话时间太短了',
						icon: 'none', //如果要纯文本，不要icon，将值设为'none'
						duration: 2000 //持续时间为 2秒
					})
					this.vlength = 0;
					this.voicebg = false;
					clearInterval(this.timer);
					return
				}
				clearInterval(this.timer);
				this.timesSend = this.vlength
				// //时长归位
				this.vlength = 0;
				this.voicebg = false;
				recorderManager.stop();
				recorderManager.onStop((res) => {
					const tempFilePaths = res.tempFilePath
					let token = uni.getStorageSync('token');
					console.log("onStop", res, tempFilePaths)
					uni.uploadFile({
						url: webUrl.BaseURL + Request.API.upload,
						filePath: tempFilePaths,
						name: 'file',
						header: {
							Authorization: token
						},
						success: (myres) => {
							console.log('VOICE', myres)
							let returnData = JSON.parse(myres.data);
							this.send(returnData.data.url, 'VOICE', this.timesSend);
						},
						fail: (err) => {
							uni.showToast({
								title: '录音失败',
								icon: 'none', //如果要纯文本，不要icon，将值设为'none'
								duration: 2000 //持续时间为 2秒
							})
						}
					});
					// if (this.voicebg) {
					// 	this.send(data, 'VOICE');
					// }
					console.log('recorder stop' + JSON.stringify(res));
				});
				// 监听录音报错
				recorderManager.onError((res) => {
					recorderManager.stop();
					uni.showToast({
						icon: 'none',
						title: '录音失败,请检查麦克风权限',
						duration: 1000
					});
				})
			},
			//发送
			send(msg, type, times) {
				let date = {
					message: msg,
					type: type,
					times: times
				}
				console.info('inputsinputsinputsinputs', date)
				this.$emit('inputs', date);
				setTimeout(() => {
					this.msg = '';
				}, 0)
			},
			onprogress(item) {
				let that = this
				uni.showLoading({
					title: '上传中...'
				});
				console.log(`${item.name}已上传结束，上传状态=${item.type}`);
				// 更新当前状态变化的文件
				this.files.set(item.name, item);
				// 演示上传完成后取服务端数据
				if (item['responseText']) {
					this.files.get(item.name).responseText = JSON.parse(item.responseText);
				}
				// 演示判断是否所有文件均已上传成功
				let isAll = [...this.files.values()].find(item => item.type !== 'success');
				let push = item.responseText
				if (!isAll) {
					if (push.code != 200) {
						uni.showToast({ title: push.msg, icon: 'none', duration: 2000 })
					}
					console.info('console.info(push)',push)
					let name = push.data.originalName
					let url = push.data.url
					let size = this.files.get(item.name).size
					let message = {
						name: name, //文件名称
						size: size, //文件大小
						url: url //文件地址
					}
					let date = {
						message: message,
						type: "FILE",
						times: ''
					}
					this.$emit('inputs', date);
				} else {
					console.log(isAll.name + '待上传');
				}
			},
			// 文件选择回调
			onChange(files) {
				this.files = files;
				this.$forceUpdate(); // 进行强制渲染，效果实现
				// 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
				// #ifdef MP-WEIXIN
				this.wxFiles = [...this.files.values()];
				// #endif
			},
		}
	};
</script>

<style lang="scss" scoped>
	.submit {
		background: rgba(244, 244, 244, 0.96);
		border-top: 1px solid rgba(39, 40, 50, 0.1);
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 100;
		// padding-bottom: var(--status-bar-height);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.displaynone {
		display: none;
	}

	.content-wrap {
		width: 78%;
		margin-left: 2%;
		// line-height: 44rpx;
	}

	.content {
		width: 100%;
		box-sizing: border-box;
		margin: 14rpx 0;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		padding: 16rpx;
		caret-color: #01B4FE;
	}

	.submit-chat {
		width: 100%;
		display: flex;
		align-items: center;
		// align-items: flex-end;
		box-sizing: border-box;
		// padding: 14rpx 14rpx;
		padding-top: 14rpx;
		padding-bottom: 14rpx;

		image {
			width: 56rpx;
			height: 56rpx;
			margin: 0 10rpx;
			flex: auto;
		}

		.btn {
			flex: auto;
			background-color: #fff;
			border-radius: 10rpx;
			// padding: 20rpx;
			max-height: 160rpx;
			margin: 0 10rpx;
		}

		.chat-send {
			line-height: 44rpx;
		}

		.record {
			line-height: 44rpx;
			text-align: center;
			font-size: 20rpx;
			color: rgba(39, 40, 50, 0.6);
		}
	}

	.emoji {
		width: 100%;
		height: 460rpx;
		background: rgba(236, 237, 238, 1);
		box-shadow: 0px 11rpx 0px 0px rgba(0, 0, 0, 0.1);

		.emoji-send {
			width: 280rpx;
			height: 104rpx;
			padding-top: 24rpx;
			background-color: rgba(236, 237, 238, 0.8);
			position: fixed;
			// bottom: 0;
			bottom: env(safe-area-inset-bottom);
			right: 0;
			display: flex;

			.emoji-send-det {
				flex: 1;
				margin-left: 24rpx;
				height: 80rpx;
				background: #fff;
				font-size: 32rpx;
				text-align: center;
				line-height: 80rpx;
				border-radius: 12rpx;

				image {
					width: 42rpx;
					height: 32rpx;
				}
			}
		}
	}

	/deep/ .uni-textarea-wrapper {
		max-height: 180rpx;
	}

	.emoji-send-bt {
		flex: 1;
		// margin: 0 32rpx 0 20rpx;
		margin-right: 10rpx;
		width: 100rpx;
		height: 70rpx;
		background: rgba(149, 236, 105, 1.0);
		font-size: 32rpx;
		text-align: center;
		line-height: 70rpx;
		border-radius: 12rpx;
	}

	.more {
		width: 100%;
		height: 436rpx;
		background: rgba(236, 237, 238, 1);
		box-shadow: 0px 11rpx 0px 0px rgba(0, 0, 0, 0.1);
		bottom: env(safe-area-inset-bottom);
		padding: 8rpx 20rpx;
		box-sizing: border-box;

		.more-list {
			width: 25%;
			text-align: center;
			float: left;
			padding-top: 32rpx;

			image {
				width: 72rpx;
				height: 72rpx;
				padding: 24rpx;
				background: rgba(255, 255, 255, 1);
				border-radius: 24rpx;
			}

			.more-list-title {
				font-size: 24rpx;
				color: rgba(39, 40, 50, 0.5);
				line-height: 34rpx;
			}
		}
	}

	.voice-bg {
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		position: fixed;
		top: 0;
		bottom: 0;
		z-index: 1001;

		.voice-bg-len {
			height: 84rpx;
			width: 600rpx;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			background-color: rgba(255, 255, 255, 0.2);
			border-radius: 42rpx;
			text-align: center;
		}

		.voice-bg-time {
			display: inline-block;
			min-width: 120rpx;
			line-height: 84rpx;
			background-color: rgba(255, 228, 49, 1);
			border-radius: 42rpx;
		}

		.voice-del {
			position: absolute;
			bottom: -480rpx;
			width: 100%;
			text-align: center;
			color: #fff;
			font-size: 28rpx;
		}
	}
</style>
