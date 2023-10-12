<template>
	<view>
		<view style="height: 80rpx;"></view>
		<view class="navTop">
			<view class="headLogo">
				<view class="logo">
					<image src="../../../static/index/inform.png"></image>
				</view>
			</view>
			<view class="title">{{notice.noticeTitle}}</view>
			<view class="neirong">{{notice.noticeStatus}}</view>
			<view class="time">{{notice.modeifyTime}}</view>
		</view>
		<view style="height: 20rpx;"></view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				notice: {},
				history: "",
				height: '',
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
		},
		onReady() {
			this.$store.commit('getRead');
			this.$store.commit('getNoRead');
		},
		methods: {
			//更改查看状态
			async read(id) {
				let {
					data: res
				} = await this.$http({
					url: '/slmp-server/notice/updateNoticeUser',
					data: {
						noticeId: id,
						userId: this.userInfo.id
					}
				})
			},
			//获取贴子详情
			async getNotice(id) {
				console.log(id)
				try {
					let {
						data: res
					} = await this.$http({
						url: `/slmp-server/notice/search/${id}`,
					})
					this.notice = res.datas;
				} catch (e) {
					console.log(e);
				}
			}
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			this.getNotice(option.id);
			this.read(option.id)
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F4F4F4;
	}

	.scrol {}

	.close {
		padding: 30rpx;
		position: fixed;
		bottom: 0;
		width: 100%;
	}


	.navTop {
		width: 90%;
		margin: auto;
		background-color: #FFFFFF;
		border-radius: 20upx;
	}

	.headLogo {
		display: flex;
		justify-content: center;
		width: 100%;
		height: 180rpx;
		border-radius: 20upx 20upx 0upx 0upx;
		background: linear-gradient(to bottom, #F3DDA1, #F7D583);
	}

	.logo {
		margin-top: -40rpx;
		height: 180rpx;
		width: 180rpx;
		border-radius: 999rpx;
		background-color: #f9e2a5;
		display: flex;
		align-items: center;
		justify-content: center;

		image {
			padding: 10rpx;
			border-radius: 999rpx;
			background-color: #FFFFFF;
			width: 130rpx;
			height: 130rpx;
		}
	}

	.title {
		margin: 10rpx auto;
		color: #000000;
		width: 94%;
		font-size: 40rpx;
	}

	.time {
		font-size: 25upx;
		color: #9a9a9a;
		text-align: right;
		padding: 0rpx 30rpx 40rpx 0rpx;
	}

	.neirong {
		font-size: 32rpx;
		width: 90%;
		margin: auto;
		margin-top: 20upx;
		color: #453A2E;
		padding-bottom: 50upx;
		word-break:break-all;
		min-height: 500rpx;
	}
</style>
