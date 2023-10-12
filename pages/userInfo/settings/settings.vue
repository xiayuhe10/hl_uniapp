<template>
	<view>
		<view class="response"><button class="response" @click="out()">退出登录</button></view>
	</view>
</template>

<script>
	import weburl from '@/common/config.js'
	import Request from '@/common/request.js';
	export default {
		data() {
			return {

			}
		},
		methods: {
			//退出登录
			out() {
				uni.showModal({
					title: "提示",
					content: "你确定要退出登陆吗？",
					success: (res) => {
						if (res.confirm) {
							this.loginOut()
						}
					}
				})
			},
			//注销登陆
			loginOut() {
				//let access_token = this.$store.state.token
				Request.delete(Request.API.logout).then(res => {
					this.$store.commit('logout');
					uni.removeStorageSync('userInfo');
					uni.removeStorageSync('token');
					//this.$webSocket.completeClose()
					uni.reLaunch({
						url: "../../login/login"
					})
				})
			},
		}
	}
</script>

<style>

</style>
