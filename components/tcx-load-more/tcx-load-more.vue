<template>
	<view class="load-more">{{loadtext}}</view>
</template>

<script>
	/**
	* alertTips 上拉加载
	* @description 上拉加载组件，用于app的分页
	* @tutorial 1106901749@qq.com
	* @property {String} loadtext 组件默认显示名字
	**/
	export default{
		props:{ 
			loadtext:{
				type:String,
				default:"上拉加载更多"
			}
			}
	}
</script>

<style scoped>
	.load-more {
		text-align: center;
		color: #AAA;
		font-size: 30upx;
		padding-top: 10upx;
		padding-bottom: 10upx;
	}
</style>
