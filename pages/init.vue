<template>
	<view>

	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onShow(){
			// 从本地缓存中同步获取指定 key 对应的内容，用于判断是否是第一次打开应用
			const value = uni.getStorageSync('launchFlag');
			console.log(value)
			if (value) {
				uni.switchTab({
					url: './index/index'
				});
			} else {
				uni.setStorageSync('launchFlag', true);
				uni.redirectTo({
					url: './guide/guide'
				});
			}
		},
		onLoad() {
			
		},
		methods: {

		}
	}
</script>

<style>

</style>
