<template>
	<view>
		<view class="usergroup" @tap="toEssentialInformation()">
			<view class="title"><text class="cuIcon-friendfavor text-olive  margin-right-xs"></text>基本信息</view>
			<view class="text-gray" >
				<text class="cuIcon-right margin-left-xs"></text>
			</view>
		</view>
		<view class="usergroup" @tap="toForget()">
			<view class="title"><text class="cuIcon-settingsfill text-olive  margin-right-xs"></text>重置密码</view>
			<view class="text-gray" >
				<text class="cuIcon-right margin-left-xs"></text>
			</view>
		</view>
		<view class="usergroup" @tap="toPhoneNumber()">
			<view class="title"><text class="cuIcon-mobilefill text-olive  margin-right-xs"></text>更换手机号</view>
			<view class="text-gray" >
				<text class="cuIcon-right margin-left-xs"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import Request from '@/common/request.js';
	import webUrl from '@/common/config.js';
	export default {
		data() {
			return {
			}
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo')
			console.info(this.userInfo)
			this.fileUrl = webUrl.fileURL
		},
		methods: {
			toForget() {//前往修改密码
				uni.navigateTo({
					url: "../forget/forget"
				})
			},
			toPhoneNumber() { //前往更换手机号
				uni.navigateTo({
					url: "../updatePhoneNumber/checkPhoneNumber"
				})
			},
			toEssentialInformation() { //前往更换个人信息
				uni.navigateTo({
					url: "../essentialInformation/essentialInformation"
				})
			},
		}
	}
</script>

<style>
	.usergroup {
		background-color: #ffffff;
		padding: 1upx 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 100upx;
	}

	.usergroup+.usergroup {
		border-top: 1upx solid #eee;
	}

	.usergroup .title {
		text-align: justify;
		padding-right: 30upx;
		font-size: 30upx;
		position: relative;
		height: 60upx;
		line-height: 60upx;
	}

	// 表单按钮组
	.formButModel {
		padding-top: 200rpx;
		width: 75%;
		margin: 20rpx auto;
		justify-content: center;


	}

	.formBut::after {
		border: none;
	}

	.formBut {
		border-radius: 90rpx;
		height: 80rpx;
		width: 550rpx;
		line-height: 80rpx;
		color: #FFFFFF;
		font-size: 32rpx;
		letter-spacing: 8rpx;
	}
</style>
