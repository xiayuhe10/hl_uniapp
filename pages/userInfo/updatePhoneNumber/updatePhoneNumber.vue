<template>
	<view>
		<!-- 		<view class="text-center bg-white padding-top">
			<text class="cuIcon-mobile  icoSize"></text>
		</view>
		<view class="bg-white padding text-center text-black">
			你的手机号码：{{userInfo.phonenumber}}
		</view> -->
		<!-- <view class="bg-white padding margin-top" >
			<view class="text-black titSize" >更换手机号码</view>
			<view class="text-gray margin-top" >可以通过新的手机号码找回密码、验证身份</view>
		</view> -->
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>更换手机号
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">新号码</view>
			<input placeholder="" name="input" v-model="newPhonenumber"></input>
			<view class="cu-capsule radius">
				<view class='cu-tag bg-blue '>
					+86
				</view>
				<view class="cu-tag line-blue">
					中国大陆
				</view>
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">验证码</view>
			<input placeholder="" name="input" v-model="verification"></input>
			<button class='cu-btn round bg-blue shadow' @click="getCodeNum()" v-if="codeTime == 60">获取验证码</button>
			<button class='cu-btn bg-blue shadow' v-if="codeTime < 60" disabled type="primary">{{codeTime+'s'}}</button>
		</view>
		<view class="formButModel">
			<view><button :disabled="disabled" class="formBut" @click="verifyCode()">确定更换手机号</button></view>
		</view>
	</view>
</template>

<script>
	import Request from '@/common/request.js';
	import webUrl from '@/common/config.js';
	export default {
		data() {
			return {
				fileUrl: '',
				list: {},
				deptName: '',
				newPhonenumber: '',
				verification: '',
				disabled: true,
				userInfo: '',
				codeTime: 60,
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
				if (this.verification != '' && this.newPhonenumber != '') {
					console.log("不是空")
					this.disabled = false
				} else {
					this.disabled = true
				}
			},
			getCodeNum() { // 发送验证码
				let that = this;
				if (that.newPhonenumber == '') {
					uni.showToast({
						title: "请输入手机号码",
						icon: "none"
					})
					return
				}
				const regu = /^1\d{10}$/;
				if (regu.test(that.newPhonenumber)) {
					that.start()
					that.autoCode(that.newPhonenumber)
				} else {
					clearInterval(that.timerID) // 计时结束
					uni.showToast({
						title: "手机号格式有误",
						icon: "none"
					})
				}
			},
			autoCode(phone) { // 发送验证码
				let that = this;
				Request.post(Request.API.autoCode, {
					"phone": phone
				}, "form").then(res => {
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
			//校验验证码
			verifyCode() {
				let that = this;
				if (that.newPhonenumber == this.userInfo.phonenumber) {
					uni.showToast({
						title: "新号码不能与旧号码相同",
						icon: "none"
					})
					return
				}

				let p = {
					"phone": that.newPhonenumber,
					"code": that.verification
				}
				Request.post(Request.API.verifyCode, p).then(res => {
					if (res.data.bool == true) {
						that.change()
					} else {
						uni.showToast({
							title: "验证码错误",
							icon: "none"
						})
					}
				})
			},
			//修改手机号 刷新缓存
			change() {
				let that = this;
				let p = {
					"oldPhoneNumber": that.userInfo.phonenumber,
					"newPhoneNumber": that.newPhonenumber
				}
				Request.put(Request.API.updatePhoneNumber, p, 'form').then(res => {
					if (res.data.code == 200) {
						uni.showToast({
							title: res.data.msg,
							icon: "none"
						})
						setTimeout(function() {
							that.getUserInfo();
						}, 1000)
					}
				})

			},
			//更新用户缓存
			getUserInfo() {
				Request.get(Request.API.getUserInfo).then(res => {
					uni.setStorageSync('userInfo', res.data.user);
					this.userInfo = res.data.user;
				})
			},
		}
	}
</script>

<style>
	.titSize {
		font-size: 25pt;
	}

	.icoSize {
		font-size: 50pt;
	}

	/* 表单按钮组 */
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
		background-color: #2a7efb;
		font-size: 32rpx;
		letter-spacing: 8rpx;
	}

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
</style>
