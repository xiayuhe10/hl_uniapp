<template>
	<view>
		<view class="text-top">联系我们</view>
		<view class="bg-list">
			<view v-for="(item,index) in problemBox" :key="index" :title="item.problemTitle" class="list-title">
				<view class="flex justify-start">
					<view class="radius">
						<image :src="item.problemUrl" class="title-image"></image>
					</view>
					<view class="radius">
						<view class="text-title">{{item.problemTitle}}</view>
					</view>
				</view>
				<view class="list-question">
					<view class="text-item">{{item.problemContent}}</view>
				</view>
				<view class="list-question">
					<view class="text-item text-min">{{item.explain}}</view>
				</view>
			</view>
		</view>
		<view class="address-box">
			<swiper class="screen-swiper">
				<swiper-item @touchmove.stop="catchTouchMove">
					<image src="@/static/userInfo/address.jpg" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="address-text">
			<view>公司地址：南宁市青秀区佛子岭路28号霖峰壹號2组团7栋2单元5楼</view>
		</view>
		<view class="padding-lg"></view>
		<view class="bg-box">
			<view class="bg-white-box">
				<image src="@/static/userInfo/myFeedback.png" class="image"></image>
				<view class="text-feedback" hover-class="hover" @click="toFeedbackList">我的反馈</view>

				<view class="vertical-line"></view>
				<image src="@/static/userInfo/editFeedback.png" class="image"></image>
				<view class="text-feedback" hover-class="hover" @click="toFeedback">我要反馈</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				problemBox: [{
						problemUrl: "https://d-image.i4.cn/i4web/static20212/img/about_contact_icon2.png",
						problemTitle: '技术支持',
						explain:"",
						problemContent: '775842894@qq.com'
					},
					{
						problemUrl: "https://d-image.i4.cn/i4web/static20212/img/about_contact_icon4.png",
						problemTitle: '平台客服',
						explain:"服务时间：周一至周五9：00-18：00",
						problemContent: '0771-5885606'
					},
					{
						problemUrl: "https://d-image.i4.cn/i4web/static20212/img/about_contact_icon3.png",
						problemTitle: '投诉建议',
						explain:"",
						problemContent: 'aixiaoxin_open@163.com'
					}
				]
			}
		},
		methods: {
			toFeedbackList() {
				uni.navigateTo({
					url: './feedbackList'
				});
			},
			toFeedback() {
				uni.navigateTo({
					url: './feedback'
				});
			},
			catchTouchMove(res) {
				return false;
			},
		}
	}
</script>

<style>
	page {
		background-color: #F8F8F8;
		height: 100%;
	}

	.title-image {
		width: 75rpx;
		height: 75rpx;
		margin-top: -10rpx;
	}

	.address-box {
		width: 80%;
		height: 500rpx;
		margin: -50rpx auto;
	}

	.address-text {
		height: 100rpx;
		margin-bottom: 100rpx;
		font-size: 24rpx;
		text-align: center;
	}

	.bg-box {
		background-color: #F8F8F8;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.bg-list {
		margin-bottom: 80rpx;
		background-color: #FFFFFF;
		padding: 25rpx
	}

	.bg-white-box {
		background-color: #FFFFFF;
		margin: 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 10rpx;
		border-radius: 20rpx;
		color: #303133;
		font-size: 32rpx;
	}

	.vertical-line {
		height: 20rpx;
		background-color: #cecece;
		width: 2rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
	}

	.line {
		width: 100%;
		height: 1rpx;
		background-color: #F5F5F5;
	}



	.text-title {
		color: #303133;
		font-size: 32rpx;
		font-weight: bold;
	}

	.text-item {
		color: #999999;
		font-size: 28rpx;
		padding: 24rpx;
	}

	.list-title {
		margin-bottom: 30rpx;
	}

	.list-question {
		color: #606266;
		font-size: 28rpx;
	}

	.hover {
		background-color: #eee;
		opacity: 0.6;
	}

	.image {
		width: 40rpx;
		height: 40rpx;
		margin-left: 20rpx;
	}

	.text-feedback {
		padding: 20rpx;
	}

	.text-top {
		margin: 30rpx;
		color: #999999;
		font-size: 28rpx;
	}
</style>
