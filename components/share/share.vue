<template>
	<view class="share">
		<view :class="{'share-box': shareState}" @click="handleHiddenShare">
		</view>
		<view class="share-item" :class="{'share-show': shareState}">
			<view class="share-to">
				<text>分享到</text>
			</view>
			<view class="content">
				<view @tap="shareMessage(item)" class="block" v-for="(item, index) in shareList" :key="index">
					<image :src="item.image" mode="aspectFill"></image>
					<text>{{item.content}}</text>
				</view>
			</view>
			<view class="cancel" @click.stop="handleHiddenShare">
				<text>取消</text>
			</view>
		</view>
	</view>
</template>

<script>
	import webUrl from '@/common/config.js';
	import Request from '@/common/request.js';
	export default {
		props: {
			classData: {}
		},
		data() {
			return {
				shareList: [{
						image: '/static/logo1.png',
						type: 'aixiaoxin',
						content: '爱校信'
					},
					{
						image: '/static/broadcast/wechat.png',
						type: 'weixin',
						content: '微信'
					},
					{
						image: '/static/broadcast/qq.png',
						type: 'qq',
						content: 'QQ'
					}
				],
				shareState: false,
				logoUrl: {},
				userInfo: {}
			};
		},
		methods: {
			getImage() {
				Request.get(Request.API.sysPictureList, {
					"type": "LOGO"
				}).then(res => {
					this.logoUrl = res.data.rows[0]
				})
			},
			onLoad() {
				console.info("班级", this.classData)
			},
			// 显示分享
			handleShowShare() {
				this.shareState = true;
				this.getImage();
				this.userInfo = uni.getStorageSync('userInfo')
			},
			// 隐藏分享
			handleHiddenShare() {
				this.shareState = false;
			},
			shareMessage(item) {
				if (item.type == "aixiaoxin") {
					this.shareAXX()
				} else if (item.type == "weixin") {
					this.shareWX()
				} else if (item.type == "qq") {
					this.shareQQ()
				}
			},
			//分享到爱校信
			shareAXX() {
				let deptId = this.userInfo.dept.deptId
				if (deptId == 229) {
					uni.showToast({
						icon: 'none',
						title: '未加入学校的老师不能执行该操作！',
						duration: 2000
					});
					return;
				}
				this.handleHiddenShare()
				let classId = this.classData.id
				uni.navigateTo({
					url: './inviteTeacher/inviteTeacher?classId=' + classId
				})
			},
			//分享到微信
			shareWX() {
				this.handleHiddenShare()
				uni.share({
					provider: 'weixin', //分享服务提供商（即weixin|qq|sinaweibo）
					scene: "WXSceneSession", //WXSceneSession(分享到聊天界面)、WXSenceTimeline(分享到朋友圈)、WXSceneFavorite(分享到微信收藏)
					type: 0,
					title: this.userInfo.nickName + '邀请您加入班级',
					summary: "加入" + this.classData.name + ',一起管理班级',
					href: webUrl.h5URL + '/#/pages/index/index?name=' + this.classData.name + '&id=' + this
						.classData.id + '&type=TEACHER' + '&userName=' + this
						.userInfo.nickName, //分享跳转地址
					imageUrl: webUrl.fileURL + this.logoUrl.imgUrl, //分享图片路径(必须是线上可访问图片：http://xxx、https://xxx等)
					success: function(res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail: function(err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});
			},
			//分享到QQ
			shareQQ() {
				this.handleHiddenShare()
				uni.share({
					provider: 'qq', //分享服务提供商（即weixin|qq|sinaweibo）
					scene: "WXSceneSession", //WXSceneSession(分享到聊天界面)、WXSenceTimeline(分享到朋友圈)、WXSceneFavorite(分享到微信收藏)
					type: 0,
					title: this.userInfo.nickName + '邀请您加入班级',
					summary: "加入" + this.classData.name + ',一起管理班级',
					href: webUrl.h5URL + '/#/pages/index/index?name=' + this.classData.name + '&id=' + this
						.classData.id + '&type=TEACHER' + '&shareType=WXSceneSession' + '&userName=' + this
						.userInfo.nickName, //分享跳转地址
					imageUrl: webUrl.fileURL + this.logoUrl.imgUrl, //分享图片路径(必须是线上可访问图片：http://xxx、https://xxx等)
					success: function(res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail: function(err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});
			}
		}
	}
</script>

<style lang="less">
	.share {
		width: 100%;
		height: 100%;
	}

	.share-box {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0rpx;
		left: 0rpx;
		bottom: 0rpx;
		right: 0rpx;
		background-color: rgba(0, 0, 0, 0.4);
		transition: .3s;
		z-index: 999;
	}

	// 进入分享动画
	.share-show {
		transition: all 0.3s ease;
		transform: translateY(0%) !important;
	}

	// 离开分享动画
	.share-item {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: auto;
		background-color: #FFFFFF;
		transition: all 0.3s ease;
		transform: translateY(100%);
		z-index: 1999;

		.share-to {
			width: 100%;
			height: 3rem;
			display: flex;
			justify-content: center;
			align-items: center;

			&::after {
				content: '';
				width: 240rpx;
				height: 0rpx;
				border-top: 1px solid #E4E7ED;
				-webkit-transform: scaleY(0.5);
				transform: scaleY(0.5);
				margin-left: 30rpx;
			}

			&::before {
				content: '';
				width: 240rpx;
				height: 0rpx;
				border-top: 1px solid #E4E7ED;
				-webkit-transform: scaleY(0.5);
				transform: scaleY(0.5);
				margin-right: 30rpx;
			}
		}

		.content {
			width: 100%;
			height: auto;
			display: flex;
			flex-wrap: wrap;

			.block {
				width: 33%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				height: 180rpx;

				image {
					width: 80rpx;
					height: 80rpx;
				}

				text {
					margin-top: 16rpx;
					font-size: 28rpx;
					color: #606266;
				}
			}
		}

		.cancel {
			width: 100%;
			height: 3rem;
			display: flex;
			justify-content: center;
			align-items: center;
			border-top: 1rpx solid #E4E7ED;
		}
	}
</style>
