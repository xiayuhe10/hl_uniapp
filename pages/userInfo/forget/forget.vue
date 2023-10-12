<template>
	<view class="content">
		<view class="list">
			<view class="tishi">若您忘记了密码，可在此重新设置新密码。</view>
			<view class="list-call" v-if="pwdFlag">
				<image class="img" src="/static/userInfo/2.png"></image>
				<input class="sl-input" type="password" v-model="oldPassword" maxlength="16" placeholder="请输入旧密码" />
			</view>
			<view class="list-call">
				<image class="img" src="/static/userInfo/2.png"></image>
				<input class="sl-input" type="password" v-model="newPassword" maxlength="16" placeholder="请输入新密码" />
			</view>
			<view class="list-call">
				<image class="img" src="/static/userInfo/2.png"></image>
				<input class="sl-input" type="password" v-model="confirmPassword" maxlength="16" placeholder="请确认新密码" />
			</view>

		</view>
		<view class="formButModel">
			<view><button :disabled="disabled" class="formBut" @click="resetPwd()">修改密码</button></view>
		</view>

	</view>
</template>

<script>
	import weburl from '@/common/config.js'
	import Request from '@/common/request.js';
	export default {
		data() {
			return {
				oldPassword: '',
				newPassword: '',
				confirmPassword: '',
				disabled: false,
				pwdFlag: true,
				userInfo: {},
			}
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo')
			if (this.userInfo.password == null || this.userInfo.password == '') {
				this.pwdFlag = false
			}
		},
		onReady() {},
		methods: {
			resetPwd: function() {
				if (!this.oldPassword) {
					if (this.pwdFlag == true) {
						uni.showToast({
							title: '请输入旧密码',
							icon: 'none'
						})
						return
					}
				}
				if (!this.newPassword) {
					uni.showToast({
						title: '请输入新密码',
						icon: 'none'
					})
					return
				}
				if (!this.confirmPassword) {
					uni.showToast({
						title: '请再次输入新密码',
						icon: 'none'
					})
					return
				}
				if (this.newPassword != this.confirmPassword) {
					uni.showToast({
						title: '两次输入不一致',
						icon: 'none'
					})
					return
				}
				let that = this;
				Request.put(Request.API.updatePwd, {
					"oldPassword": that.oldPassword,
					"newPassword": that.newPassword
				}, "form").then(res => {
					if (res.data.code == 200) {
						uni.showToast({
							title: '修改密码成功！',
							icon: 'success'
						})
						that.oldPassword = '';
						that.newPassword = '';
						that.confirmPassword = '';
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'error'
						})
					}
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	// 表单按钮组
	.formButModel {
		padding-top: 250rpx;
		width: 75%;
		margin: 40rpx auto;
		justify-content: center;

		.formBut::after {
			border: none;
		}

		.formBut {
			border-radius: 90rpx;
			height: 80rpx;
			width: 550rpx;
			line-height: 80rpx;
			color: #FFFFFF;
			background-color: #2a7efb;
			font-size: 32rpx;
			letter-spacing: 8rpx;
		}
	}

	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.tishi {
		color: #999999;
		font-size: 28rpx;
		line-height: 50rpx;
		margin-bottom: 50rpx;
	}

	.list {
		display: flex;
		flex-direction: column;
		padding-top: 50rpx;
		padding-left: 70rpx;
		padding-right: 70rpx;
	}

	.list-call {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 100rpx;
		color: #333333;
		border-bottom: 0.5px solid #e2e2e2;
	}

	.list-call .img {
		width: 40rpx;
		height: 40rpx;
	}

	.list-call .sl-input {
		flex: 1;
		text-align: left;
		font-size: 32rpx;
		margin-left: 16rpx;
	}

	.button-login {
		color: #FFFFFF;
		font-size: 30rpx;
		width: 470rpx;
		height: 85rpx;
		line-height: 85rpx;
		background: #34AB68;
		box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(164, 217, 228, 0.2);
		border-radius: 50rpx;
		text-align: center;
		margin-left: auto;
		margin-right: auto;
		margin-top: 100rpx;
	}

	.button-hover {
		background: linear-gradient(-90deg, rgba(63, 205, 235, 0.8), rgba(188, 226, 158, 0.8));
	}

	.yzm {
		color: #FF7D13;
		font-size: 24rpx;
		line-height: 64rpx;
		padding-left: 10rpx;
		padding-right: 10rpx;
		width: auto;
		height: 64rpx;
		border: 1rpx solid rgba(255, 131, 30, 1);
		border-radius: 50rpx;
	}

	.yzms {
		color: #999999 !important;
		border: 1rpx solid #999999;
	}
</style>
