<template>
	<view>
		<view style="">
			<image src="../../static/logo.png" style="display: block;
			width: 200rpx;height: 200rpx;margin:100rpx auto;"></image>
		</view>
		<!-- 登陆主页 -->
<!-- 		<view v-if="loginShowFlag == 1">
			<view class="loginHead">
				<text>您好,</text>
				<text>欢迎来到爱校信</text>
			</view>
			<view class="padding">
				<button class="cu-btn block bg-blue margin-tb-sm lg" style="width:90%;margin:10px auto;"
					open-type="getPhoneNumber" @click="login(1)">微信登录</button>
			</view>
			<view class="grid col-2 text-center text-blue">
				<view @click="loginShowChange(2)" class="borderRi">
					账号登陆
				</view>
				<view @click="loginShowChange(3)">
					手机登陆/注册
				</view>
			</view>
		</view> -->
		
		<!-- 忘记密码 -->
				<view v-if="loginShowFlag == 5">
					<view class="loginHead">
						<text>您好,</text>
						<text>请重置密码</text>
					</view>
					<view class="" style="width:90%;margin:10px auto;">
							<view class="cu-form-group">
								<!-- <view class="title">账号：</view> -->
								<input focus="true" cursor-spacing="20" v-model="register.phone" :placeholder-style='placeholderStyle'
									maxlength="13" placeholder="请输入手机号码" />
							</view>
							
							<view class="cu-form-group">
								<!-- <view class="title">密码：</view> -->
								<input cursor-spacing="20" v-model="register.password" maxlength="13" :placeholder-style='placeholderStyle'
									placeholder="请输入新密码" type="password" />
							</view>
							<view class="cu-form-group">
								<!-- <view class="title">密码：</view> -->
								<input cursor-spacing="20" v-model="affirmPassword" maxlength="13" :placeholder-style='placeholderStyle'
									placeholder="请输入确认密码" type="password" />
							</view>
							<view class="cu-form-group">
							
								<input type="number" v-model="register.code" :placeholder-style='placeholderStyle' maxlength="6"
									placeholder="请输入验证码" />
								<button class='cu-btn bg-blue shadow' @click="getCodeNum()" v-show="codeTime == 60">获取验证码</button>
								<button class='cu-btn bg-blue shadow' v-show="codeTime < 60" disabled
									type="primary">{{codeTime+'s'}}</button>
							</view>
							<view class="padding">
								<button class="cu-btn block bg-blue margin-tb-sm lg" @click="login(5)">重置密码</button>
							</view>
					</view>
					<view class="grid col-2 text-center text-blue">
						<view @click="loginShowChange(2)" class="borderRi">
							账号登陆
						</view>
						<view @click="loginShowChange(3)">
							账号注册
						</view>
					</view>
				</view>
		<!-- 账号密码登陆 -->
		<view v-if="loginShowFlag == 2" class="">
			<view class="loginHead">
				<text>您好,</text>
				<text>欢迎来到hl快速开发框架</text>
			</view>
			<view class="" style="width:90%;margin:10px auto;">
			
				<view class="cu-form-group">
					<!-- <view class="title">账号：</view> -->
					<input focus="true" cursor-spacing="20" v-model="username" :placeholder-style='placeholderStyle'
						maxlength="13" placeholder="请输入手机号码" />
				</view>
				
				<view class="cu-form-group">
					<!-- <view class="title">密码：</view> -->
					<input cursor-spacing="20" v-model="password" maxlength="13" :placeholder-style='placeholderStyle'
						placeholder="请输入密码" type="password" />
				</view>
				<view class="cu-form-group ">
					<!-- <view class="title">验证码：</view> -->
					<input v-model="code" :placeholder-style='placeholderStyle' maxlength="4" placeholder="请输入验证码"
						type="number" />
					<image @click="getCode()" :src="codeUrl" style="width: 200rpx;height: 70rpx;"> </image>
				</view>
				<view class="padding">
					<button class="cu-btn block bg-blue margin-tb-sm lg" @click="login(2)">登录</button>
				</view>
				<view class="grid col-2 text-center text-blue">
					<view @click="loginShowChange(5)" class="borderRi">
						忘记密码？
					</view>
					<view @click="loginShowChange(3)">
						账号注册
					</view>
				</view>
			</view>

		</view>
		<!-- 用户注册 -->
		<view v-if="loginShowFlag == 3">
			<view class="loginHead">
				<text>您好,</text>
				<text>欢迎来到hl快速开发框架</text>
			</view>
			<view class="" style="width:90%;margin:10px auto;">
				<view class="cu-form-group">
					<input focus="true" v-model="register.companyCode" :placeholder-style='placeholderStyle' maxlength="11"
						placeholder="请输公司编码" />
				</view>
				<view class="cu-form-group">
					<!-- <view class="title">账号：</view> -->
					<input focus="true" cursor-spacing="20" v-model="register.username" :placeholder-style='placeholderStyle'
						maxlength="13" placeholder="请输入姓名" />
				</view>
				<view class="cu-form-group">
					<input focus="true" v-model="register.phone" :placeholder-style='placeholderStyle' maxlength="11"
						placeholder="请输入手机号" />
				</view>
							
				<view class="cu-form-group">
					<!-- <view class="title">账号：</view> -->
					<input focus="true" cursor-spacing="20" v-model="register.password" :placeholder-style='placeholderStyle'
						maxlength="13" placeholder="请输入密码"  type="password"  />
				</view>
			
				<view class="cu-form-group">
				
					<input type="number" v-model="register.code" :placeholder-style='placeholderStyle' maxlength="6"
						placeholder="请输入验证码" />
					<button class='cu-btn bg-blue shadow' @click="getCodeNum()" v-show="codeTime == 60">获取验证码</button>
					<button class='cu-btn bg-blue shadow' v-show="codeTime < 60" disabled
						type="primary">{{codeTime+'s'}}</button>
				</view>
				<view class="cu-form-group">
					<button class="cu-btn block bg-blue margin-tb-sm lg response" @click="login(3)">注册</button>
				</view>
				<view class="grid col-2 text-center text-blue margin-top">
					<view @click="loginShowChange(5)" class="borderRi">
						忘记密码？
					</view>
					<view @click="loginShowChange(2)">
						账号密码登陆
					</view>
				</view>
			</view>
		</view>
		<!-- 绑定手机号 -->
		<view v-if="loginShowFlag == 4">
			<view class="loginHeads margin-bottom">
				<text>绑定手机号</text>
				<text>微信首次登陆，需绑定手机号码</text>
			</view>
			<view class="cu-form-group">
				<view class="title">手机号：</view>
				<input focus="true" v-model="weixinPhone" :placeholder-style='placeholderStyle' maxlength="11"
					placeholder="请输入手机号" />
			</view>
			<view class="cu-form-group">
				<view class="title">验证码：</view>
				<input type="number" v-model="weixinCode" :placeholder-style='placeholderStyle' maxlength="6"
					placeholder="请输入验证码" />
				<button class='cu-btn bg-blue shadow' @click="getWeixinCodeNum()"
					v-if="codeWeixinTime == 60">获取验证码</button>
				<button class='cu-btn bg-blue shadow' v-if="codeWeixinTime < 60" disabled
					type="primary">{{codeWeixinTime+'s'}}</button>
			</view>
			<view class="cu-form-group">
				<button v-if="weixinPhone != ''" class="cu-btn block bg-blue margin-tb-sm lg response"
					@click="weiDetermine(weixinPhone)">确定</button>
				<button v-else class="cu-btn block bg-blue margin-tb-sm lg response" disabled type="primary">确定</button>
			</view>
			<view class="grid col-2 text-center text-blue">
				<view @click="loginShowChange(2)" class="borderRi">
					账号登陆
				</view>
				<view @click="loginShowChange(3)">
					手机登陆/注册
				</view>
			</view>
		</view>
		<view style="width: 90%;position: fixed;bottom: 20px;left:5%;font-size: 13px;">
			<view class="flex align-center" style="float: left;height: 30px;">
				<checkbox-group style="transform: scale(0.6);" class="block" @change="CheckChange">
					<checkbox class='round blue' :class="checked?'checked':''" :checked="checked?true:false" value="">
					</checkbox>
				</checkbox-group>
				<view @click="CheckChange">
					<view class="text-gray" style="float: left; ">我已阅读并同意</view>
				</view>
			</view>

			<view class="flex align-center" style="height: 30px;">
				<navigator url="./loginAgreement/loginAgreement?id=1" hover-class="navigator-hover" class="navigatorBg">
					《用户服务协议》
				</navigator>
				<navigator url="./loginAgreement/loginAgreement?id=1" hover-class="navigator-hover" class="navigatorBg">
					《隐私政策》
				</navigator>
			</view>

		</view>
		<!-- 		<view class="padding margin-tb-sm apple-view" style="margin: 10px auto;">
			<view class="sign-in-with-apple" @click="appleLogin">sign in with apple
			</view>
		</view> -->


	</view>
</template>

<script>
	import {
		getCodeImg,
		login
	} from '@/common/api/login.js';
	import Request from '@/common/request.js';
	import webUrl from '../../common/config.js';
	export default {
		data() {
			return {
				loginShowFlag: 2,
				disabled: true,
				placeholderStyle: 'font-size:30rpx;color:#B5B3B3;',
				edClass: true, //登陆方式
				username: '', // 13111111111
				password: '', // 123456
				sessionKey: '',
				validCode: '',
				code: '',
				uuid: '',
				codeTime: 60,
				mobilePhone: '',
				mobileCode: '',
				weixinPhone: '',
				weixinCode: '',
				codeWeixinTime: 60,
				appid: "",
				inputEd: 0, //input选中,
				imgid: 1,
				webUrl: '',
				clicks: 0,
				codeUrl: '',
				captchaOnOff: false,
				checkedAtten: true,
				timerID: '',
				timerWeiID: '',
				weiOpenid: '',

				checked: false,

				system: '',
				platform: '',

				loginForm: {},

				modalName: false,
				affirmPassword:"",
				register:{
					companyCode:"",
					username:"",
					password:"",
					phone:"",
					code:"",
				}
			};
		},
		onLoad(option) {
			// let launchFlag = option.launchFlag
			// if (launchFlag) {
			// 	this.modalName = true
			// }
		},
		onShow() {
			this.getCode()
			getApp().globalData.logoutNum = 1
			const username = uni.getStorageSync('username');
			const password = uni.getStorageSync('password');
			const mobilePhone = uni.getStorageSync('mobilePhone');
			const checkedAtten = uni.getStorageSync('checkedAtten');
			this.mobileCode = ''
			if (checkedAtten) {
				this.username = username
				this.password = password
			}

			this.mobilePhone = mobilePhone
			if (checkedAtten == false && checkedAtten != '') {
				this.checkedAtten = checkedAtten
			}
			uni.getSystemInfo({
				success: (res) => {
					this.system = res.system
					this.platform = res.platform

					this.loginForm.brand = res.brand
					this.loginForm.model = res.model
					this.loginForm.osName = res.osName
				}
			})
			console.log("value", username, password, mobilePhone, checkedAtten);
		},
		methods: {
			//获取验证码
			getCode() {
				Request.get(Request.API.captchaImage).then(res => {
					this.captchaOnOff = res.data.captchaOnOff === undefined ? true : res.data.captchaOnOff;
					if (this.captchaOnOff) {
						this.codeUrl = "data:image/gif;base64," + res.data.img;
						this.uuid = res.data.uuid;
						this.code = ''
					}
				})
			},
			//失去焦点事件
			blurInput() {
				this.inputEd = 0;
			},
			//选中事件
			isFocus(index) {
				this.inputEd = index;
			},
			
			login(index) {
				if(index==1||index==2||index==3){
					if (!this.checked) {
						uni.showToast({
							title: "请阅读并勾选<<用户服务协议>>、<<隐私政策>>>",
							icon: "none"
						})
						return;
					}
				}
				let that = this;
				if (index == 1) {
					console.log("=========微信授权登录！============")
					that.getPhoneNumber()
				} else if (index == 2) {
					console.log("==========账号密码登录！=============")
					if (that.username == '') {
						this.showMsg("请输入账号")
						return
					}
					if (that.password == '') {
						this.showMsg("请输入密码")
						return
					}
					this.accountLogin();
				} else if (index == 3 ||index==5) {
					console.log("===========用户注册！==============")
					if(index==3){
						if (that.register.companyCode == '') {
							this.showMsg("请输入公司编码")
							return
						}	
						if (that.register.username == '') {
							this.showMsg("请输入用户名")
							return
						}
					}
			
				
					if (that.register.phone == '') {
						this.showMsg("请输入手机号码")
						return
					}
					if (that.register.password == '') {
						this.showMsg("请输入密码")
						return
					}
					if(index==5){
						console.log("===========重置密码！==============")
						if (that.affirmPassword == '') {
							this.showMsg("请输入确认密码")
							return
						}
						if(that.register.password!=that.affirmPassword){
							this.showMsg("两次密码输入不一致")
							return
						}
					}
					if (that.register.code == '') {
						this.showMsg("验证码不能为空")
						return
					}
					let regus = /^1\d{10}$/;
					if (regus.test(that.register.phone)) {
						this.verifyLogin(index);
					} else {
						this.showMsg("手机号格式有误")
					}
				
					
				}
			},
			showMsg(msg){
				uni.showToast({
					title:msg,
					icon: "none"
				})
			},
			loginShowChange(flag) {
				this.loginShowFlag = flag
			},
			getPhoneNumber(e) { //获取手机号授权
				let that = this
				uni.showLoading({
					title: '加载中...'
				});
				// console.log("获取手机号授权", e.detail) //可获取用户头像url和名字等信息
				// this.getSessionKey(e, e.detail.code) //解密手机号函数
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						console.log("获取oauth授权", res) //可获取用户头像url和名字等信息
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {
									console.log("获取weixin授权", loginRes, loginRes.authResult
										.openid) //可获取用户头像url和名字等信息
									that.weiOpenid = loginRes.authResult.openid
									that.selectUserByOpenIdId(loginRes.authResult.openid)
								},
								fail: function(err) {
									console.log("获取授权failfail", err) //可获取用户头像url和名字等信息
									uni.showModal({
										content: "获取oauth授权失败：" + JSON.stringify(err)
									})
									uni.hideLoading()
								}
							})
						}
					},
					fail: function(err) {
						uni.hideLoading()
						uni.showModal({
							content: "获取oauth授权失败：" + JSON.stringify(err)
						})
					}
				})
			},
			selectUserByOpenIdId(openid) {
				let userType = uni.getStorageSync('userType');
				if (!userType) {
					//存储找不到用户角色，默认为系统用户
					userType = "00"
				}
				let p = {
					'openId': openid,
					'userType': userType
				}
				console.info("根据OpenId", p)
				// 返回true/false；true代表已经存在手机号，则直接登录，false代表还没手机号，则跳转到手机号页面
				Request.get(Request.API.selectUserByOpenId, p).then(res => {
					console.info("用户是否存在手机号", res)
					if (res.data.data) {
						this.wxLoginSystem("", this.weiOpenid, '')
						uni.hideLoading()
					} else {
						this.loginShowFlag = 4
						uni.hideLoading()
					}
					console.info("微信code获取opneId", res, res.data.data)
				})
			},
			weiDetermine(weiPhone) {
				if (!this.checked) {
					this.showMsg("请阅读并勾选<<用户服务协议>>、<<隐私政策>>")
					return;
				}
				if (this.weixinCode == '') {
					this.showMsg("请输入验证码")
					return
				}
				let regus = /^1\d{10}$/;
				if (regus.test(this.weixinPhone)) {
					let that = this;
					let p = {
						"phone": that.weixinPhone,
						"code": that.weixinCode
					}
					console.info(p)
					Request.post(Request.API.verifyCode, p).then(res => {
						console.log(res.data)
						if (res.data.bool == true) {
							this.showMsg("验证码正确")
							console.info(this.weiOpenid, weiPhone)
							this.wxLoginSystem("", this.weiOpenid, weiPhone)
						} else {
							this.showMsg(res.data.msg)
							return;
						}

					})
				} else {
					this.showMsg("手机号格式有误")
					return;
				}
			},
			wxLoginSystem(code, openId, phone) { // 微信授权登录手机号版
				uni.showLoading({
					title: '登录中...'
				});
				let userType = uni.getStorageSync('userType');
				if (!userType) {
					//存储找不到用户角色，默认为系统用户
					userType = "00"
				}
				Request.post(Request.API.wxLoginSystem, {
					'openId': openId,
					"phone": phone,
					'userType': userType
				}).then(res => {
					console.info("微信授权登录手机号版", res)
					uni.hideLoading();
					if (res.data.code == 500) {
						uni.showToast({
							title: res.data.msg,
							icon: "none",
							duration: 2000 //持续时间为 2秒
						})
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: "none",
							duration: 2000 //持续时间为 2秒
						})
					}
					uni.setStorageSync('token', res.data.data.access_token);
					uni.setStorageSync('userType', userType);
					this.getUserInfo();
					uni.switchTab({
						url: "../broadcast/broadcast"
					});


				})
			},
			getSessionKey(e, code) { // 微信code获取opneId
				Request.get(Request.API.getAccessToken + code).then(res => {
					// let codes = JSON.parse(res.data)
					console.info("微信code获取opneId", code, res.data)
					this.decryptPhone(e, res.data.errcode) //解密手机号函数
				})
			},
			//解密手机号
			decryptPhone(e, sessionKey) {
				let that = this
				let errMsg = e.detail.errMsg;
				if (errMsg == 'getPhoneNumber:ok') {
					let param = {};
					param.iv = e.detail.iv;
					// param.code = e.detail.code;
					param.encryptedData = e.detail.encryptedData;
					param.sessionKey = sessionKey;
					Request.get(Request.API.getWxPhone, param).then(res => {
						if (res.data.code == 200) {
							let result = JSON.parse(res.data.data);
							this.wxLoginSystem(e.detail.code, '', result.phonenumber)
						}
					})
				}
			},

			loginSwitch() {
				let that = this;
				that.edClass = !that.edClass
				if (that.edClass == false) {
					that.mobileCode = ''
				}
			},
			getCodeNum() { // 发送验证码
				let that = this;
				if (that.register.phone == '') {
					uni.showToast({
						title: "请输入手机号码",
						icon: "none"
					})
					return
				}
				let p = {
					"phone": that.register.phone,
					"code": that.register.code
				}
				const regu = /^1\d{10}$/;
				if (regu.test(that.register.phone)) {
					that.start()
					that.autoCode(that.register.phone)
				} else {
					console.info("手机号格式有误")
					clearInterval(that.timerID) // 计时结束
					that.showMsg("手机号格式有误")
				}
			},
			getWeixinCodeNum() { // 发送验证码
				let that = this;
				if (that.weixinPhone == '') {
					that.showMsg("请输入手机号码")
					return
				}
				let p = {
					"phone": that.weixinPhone,
					"code": that.weixinCode
				}
				const regu = /^1\d{10}$/;
				if (regu.test(that.weixinPhone)) {
					let that = this;
					that.timerWeiID = setInterval(() => {
						that.timers()
					}, 1000) //每隔1s调用一次timer函数
					that.autoCode(that.weixinPhone)
					console.info("手机号格式正确", that.weixinPhone)
				} else {
					console.info("手机号格式有误")
					clearInterval(that.timerWeiID) // 计时结束
					that.showMsg("手机号格式有误")
				}
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
			timers() { //计时函数
				let that = this;
				if (that.codeWeixinTime > 1) {
					that.codeWeixinTime = that.codeWeixinTime - 1
				} else {
					that.codeWeixinTime = 60
					clearInterval(that.timerWeiID) // 计时结束
				}
			},
			autoCode(phone) { // 发送验证码
				let that = this;
				console.info(phone)
				Request.post(Request.API.autoCode, {
					"phone": phone
				}, "form").then(res => {
					console.info("格式", res.data)
					if(!res.data.bool){
						clearInterval(that.timerWeiID) // 计时结束
						that.codeTime = 60
					}
					that.showMsg( res.data.msg)
				})
			},
			//========注册、重置密码 验证码短信校验=============
			verifyLogin(index) { 
				let that = this;
				let p = {
					"phone": that.register.phone,
					"code": that.register.code
				}
				console.info(p)
				Request.post(Request.API.verifyCode, p).then(res => {
					console.log(res.data)
					if (res.data.bool == true) {
						if(index==3){
							//注册功能
							that.registerUser();
						}else if(index==5){
							//重置密码功能
							that.resetPassword();
						}
						
						that.showMsg("验证码正确")
					} else {
						that.showMsg("验证码错误")
					}

				})
			},
			//====================账号密码登陆====================
			accountLogin() {
				uni.showLoading({
					title: '登录中...'
				});
				let that = this
				let data = {
					username: that.username,
					password: that.password,
					code: that.code,
					uuid: that.uuid
				}
				uni.setStorageSync('username', data.username);
				uni.setStorageSync('password', data.password);
				uni.setStorageSync('checkedAtten', this.checkedAtten);
				Request.post(Request.API.login, data).then(res => {
					console.log("res", res)
					if (res.data.code == "200" || res.data.code == 200) {
						console.log("res", res)
						uni.hideLoading();
						uni.setStorageSync('token', res.data.token);
	
						that.getUserInfo();
					} else {
						
						if (res.data.msg == "验证码错误") {
							setTimeout(function() {
								that.getCode()
							}, 1000)
						}
						uni.showToast({
							title: res.data.msg,
							duration: 2000,
							icon: "none"
						})
					}
				})
			},
			//保存用户登录记录
			saveUserLoginRecord() {
				Request.post(Request.API.userLoginRecord, this.loginForm).then(res => {

				})
			},
			//===================重置密码===============
			resetPassword(){
				Request.post(Request.API.resetPassword,this.register).then(res => {
					if (res.data.code == "200" || res.data.code == 200) {
						this.showMsg("重置密码成功！")
						setTimeout(function() {
							this.loginShowFlag="2"
						}, 3000);
					} else {
						this.showMsg(res.data.msg)
					}
				})
			},
			//===================注册==================
			registerUser() {
				
				Request.post(Request.API.register,this.register).then(res => {
					console.log("res", res)
					if (res.data.code == "200" || res.data.code == 200) {
						uni.showModal({
							title: '提示',
							showCancel:false,
							content: '注册成功！请等待管理员审核，审核通过后方可登录',
							success: function (res) {
								this.loginShowFlag="2"
							}
						});
						
					} else {
						this.showMsg(res.data.msg)
					}
				})
			},
			//获取用户信息
			getUserInfo() {
				Request.get(Request.API.getUserInfo).then(res => {
					//存储用户信息
					uni.setStorageSync('userId', res.data.user.userId);
					uni.setStorageSync('avatar', res.data.user.avatar);
					uni.removeStorageSync('userInfo');
					uni.setStorageSync('userInfo', res.data.user);
					//存储登录记录
					this.saveUserLoginRecord()
					uni.switchTab({
						url: "../broadcast/broadcast"
					});
					// this.getMenuList();
					//uni.hideLoading();

				})
			},
			// //获取菜单
			// getMenuList() {
			// 	Request.get(Request.API.getRouters).then(res => {
			// 		uni.setStorageSync('menu', res.data.data);
			// 		uni.switchTab({
			// 			url: "../index/index"
			// 		});
			// 	})
			// },
			CheckboxChange(e) { // 是否记住密码
				this.checkedAtten = !this.checkedAtten
				uni.setStorageSync('checkedAtten', this.checkedAtten);
				console.info(this.checkedAtten, e.detail)
			},
			CheckChange() {
				this.checked = !this.checked
				this.$forceUpdate() // dom会更新
			},
			LoginForApple() {
				let that = this
				uni.getProvider({
					//获取第三方登录类型
					service: 'oauth',
					success: function(res) {
						//判断为苹果登录
						if (~res.provider.indexOf('apple')) {
							uni.login({
								provider: 'apple',
								success: loginRes => {
									uni.getUserInfo({
										provider: 'apple',
										success: userInfoRes => {
											console.log('user.userInfo', userInfoRes)
											let user = userInfoRes.userInfo
											// 判断用户是不是选择共享邮箱 
											let email = ""
											if (user.email) {
												email = user.email
											} else {
												email = ""
											}
											console.log('用户邮箱', email)
											let data = {}
											//登录接口
										}
									})
								},
								fail: err => {
									console.log('apple登录失败' + JSON.stringify(err))
									uni.showToast({
										title: '登录失败',
										icon: 'none'
									})
								}
							})
						}
					},
					fail: err => {
						uni.showToast({
							title: '登录失败',
							icon: 'none'
						})
					}
				})
			},
		
		}
	}
</script>

<style lang="less">
	@import "../../common/global.less";
	@import "../../common/icon.css";

	page {
		background-color: #FFFFFF;
	}

	.borderRi {
		border-right: 1rpx solid #cee6ee !important;
	}

	//输入框选中

	//表单头部
	.loginHead {
		height: 50rpx;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		flex-direction: column;

		>text:nth-child(1) {
			font-size: 55rpx;
			font-weight: bold;
			margin-top: 80rpx;
			letter-spacing: 10rpx;
			padding-left: 90rpx;
			color: #313131;
		}

		>text:nth-child(2) {
			font-size: 28rpx;
			margin-top: 20rpx;
			padding-left: 90rpx;
			letter-spacing: 8rpx;
			color: #977B84;
		}
	}

	//表单头部
	.loginHeads {
		height: 50rpx;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		flex-direction: column;

		>text:nth-child(1) {
			font-size: 55rpx;
			font-weight: bold;
			margin-top: 80rpx;
			letter-spacing: 10rpx;
			padding-left: 30rpx;
			color: #313131;
		}

		>text:nth-child(2) {
			font-size: 28rpx;
			margin-top: 20rpx;
			padding-left: 30rpx;
			letter-spacing: 8rpx;
			color: #977B84;
		}
	}

	.navigator-hover {
		color: #0081FF;
	}

	.navigatorBg {
		color: #0081FF;

	}

	.apple-view {
		padding-left: 150upx;
	}

	.sign-in-with-apple {
		margin-top: 20upx;
		background-color: #000000;
		width: 400upx;
		height: 80upx;
		color: #FFFFFF;
		text-align: center;
		line-height: 80upx;
		border-radius: 20upx;
	}
</style>
