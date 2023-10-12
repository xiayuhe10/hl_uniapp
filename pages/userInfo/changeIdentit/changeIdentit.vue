<template>
	<view class="pages">
		<view class="flex justify-between align-center padding-lr"  style="padding-top: 32px;">
			<view class="text-xxl" @click="backClass()" >
				<text class="cuIcon-back text-white "></text>
			</view>
			<view class="text-white text-xxl ">切换身份</view>
			<view class="text-white  text-lg "  ></view>
			<!-- 规则 -->
		</view>
		<view class="flex justify-center" @tap="transRole('00')" style="margin-top:100px">
			<view class="bg-white text-center padding radius margin-top-lg" style="height: 100px; width: 70%;">
				<view class="round"  :class="userInfo.userType=='00'?'bg-axx':'bg-gray'"  style="width: 20px;height: 20px;"></view>
				<view class="text-xxl text-black text-bold ">老师身份</view>
			</view>

		</view>

		<view class="flex justify-center" @tap="transRole('02')">
			<view class="bg-white text-center padding radius margin-top-lg" style="height: 100px; width: 70%;">
				<view class="round" :class="userInfo.userType=='02'?'bg-axx':'bg-gray'"  style="width: 20px;height: 20px;"></view>
				<view class="text-xxl text-black text-bold ">家长身份</view>
			</view>
		</view>

	</view>
</template>

<script>
	import Request from '@/common/request.js';
	export default {
		data() {
			return {
				userTypeName: '',
				userInfo: {}
			}
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo')

		},
		methods: {
			backClass() {
				uni.navigateBack({
					delta: 1
				});
			},
			//切换身份
			transRole(userType) {
				uni.showLoading({
					title:'切换中...'
				});
				let name =  userType=='02'?'家长':'老师'
				if (this.userInfo.userType == userType) {
					uni.hideLoading()
					uni.showToast({ title: "您当前已是" + name + "角色，切换无效", icon: 'none',  duration: 2000 })  
					console.log("您当前已是" + userType + "角色，切换无效")
					return;
				}
				Request.post(Request.API.changeLogin, {
					userId: this.userInfo.userId,
					userType: userType
				}).then(res => {
					console.log("res", res)
					//#ifdef APP-PLUS
					if (userType == '02') {
						uni.setTabBarItem({
							index: 1,
							visible: false
						})
					} else {
						uni.setTabBarItem({
							index: 1,
							visible: true
						})
					}
					//#endif
					if (res.data.code == 200) {
						//注销之前登录的用户，清除对应缓存
						//uni.removeStorageSync("token");
						//存储新登录的用户
						uni.setStorageSync('token', res.data.data.access_token);
						this.getUserInfo();
					}
				})
			},

			getUserInfo() {
				Request.get(Request.API.getUserInfo).then(res => {
					//存储用户信息
					uni.setStorageSync('userId', res.data.user.userId);
					uni.setStorageSync('avatar', res.data.user.avatar);
					uni.setStorageSync('userType', res.data.user.userType);
					uni.removeStorageSync('userInfo');
					uni.setStorageSync('userInfo', res.data.user);
					//存储登录记录
					//this.saveUserLoginRecord()
					uni.hideLoading()
					uni.showToast({ title: '切换成功', icon: 'none',  duration: 2000  })  
					setTimeout(()=>{
						uni.switchTab({
							url: "/pages/userInfo/userInfo"
						});
					},1000)
				})
			},
		}
	}
</script>

<style scoped>
	.pages {
		position: absolute;
		height: 100%;
		width: 100%;
		background-image: url("../../../static/background.jpg") ;
		background-size:100% 100%;
	}
</style>
