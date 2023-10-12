<template>
	<view>
		<view class="cu-list menu" :class="[menuBorder?'sm-border':'',menuCard?'card-menu margin-top':'']">
			<view class="cu-item">
				<view class="content padding-tb-sm">
					<view>
						身份校验
					</view>
					<view class="text-gray text-sm">
						<text class="cuIcon-infofill margin-right-xs"></text> 请先验证旧手机号{{userInfo.phonenumber}}
					</view>
					<view class="cu-form-group">
						<view class="title">验证码</view>
						<input placeholder="" name="input" v-model="verification"></input>
						<text v-if="showClose" class="icon_close" @click="close">×</text>
						<button class='cu-btn round bg-blue shadow' @click="getCodeNum()"
							v-if="codeTime == 60">获取验证码</button>
						<button class='cu-btn bg-blue shadow' v-if="codeTime < 60" disabled
							type="primary">{{codeTime+'s'}}</button>
					</view>
				</view>
			</view>
		</view>
		<view class="formButModel">
			<view><button :disabled="disabled" class="formBut" @click="toUpdatePhone()">下一步</button></view>
		</view>
	</view>
</template>

<script>
	import Request from '@/common/request.js';
	import webUrl from '@/common/config.js';
	export default {
		data() {
			return {
				oldPhoneNumber: '',
				verification: '',
				menuBorder: false,
				menuCard: false,
				disabled: true,
				userInfo: {},
				codeTime: 60,
				showClose: false
			}
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo')
		},
		watch: {
			verification(val) {
				this.listener()
			}
		},
		methods: {
			//监听数据
			listener() {
				if (this.verification) {
					console.log("不是空")
					this.disabled = false
					this.showClose = true
				} else {
					this.disabled = true
					this.showClose = false
				}
			},
			close() {
				this.verification = ''
			},
			getCodeNum() { // 发送验证码
				this.start()
				this.autoCode(this.userInfo.phonenumber)
			},
			autoCode(phone) { // 发送验证码
				let that = this;
				console.info(phone)
				Request.post(Request.API.autoCode, {
					"phone": phone
				}, "form").then(res => {
					console.info("格式", res.data)
					uni.showToast({
						title: res.data.msg,
						icon: "none"
					})
				})
			},
			start() {
				let that = this;
				that.timerID = setInterval(() => {
					that.timer()
				}, 1000) //每隔1s调用一次timer函数
			},
			timer() { //计时函数
				let that = this;
				if (that.codeTime > 1) {
					that.codeTime = that.codeTime - 1
				} else {
					that.codeTime = 60
					clearInterval(that.timerID) // 计时结束
				}
			},
			toUpdatePhone() {
				let that = this;
				let p = {
					"phone": that.userInfo.phonenumber,
					"code": that.verification
				}
				Request.post(Request.API.verifyCode, p).then(res => {
					if (res.data.bool == true) {
						uni.navigateTo({
							url: "./updatePhoneNumber"
						})
					} else {
						uni.showToast({
							title: "验证码错误",
							icon: "none"
						})
					}
				})
			}
		},
	}
</script>

<style>
	.formButModel {
		padding-top: 150rpx;
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
		background-color: #2a7efb;
		font-size: 32rpx;
		letter-spacing: 8rpx;
	}

	.icon_close {
		width: 42upx;
		height: 32upx;
		margin-right: 10upx;
	}
</style>
