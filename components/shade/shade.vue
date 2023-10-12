<template>
	<view class="shade">
		<view class="model">
		<image @click="close" src="./static/close.png" class="close"></image>
		<view  class="content">
			<slot>
				
			</slot>
		</view>
		<view class="button">
			<view @click="reset()" class="left">重置</view>
			<view @click="affirm()" class="right">确认</view>
		</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "shade",
		data() {
			return {

			};
		},
		methods:{
			close(){
				this.$emit('close',true)
			},
			//点击确认
			affirm(){
				this.$emit('affirm',true)
			},
			//点击重置
			reset(){
				this.$emit('reset',true)
			}
		}
	}
</script>

<style lang="less" scoped>
	page{
		position: fixed;
	}
	.content{
		width: 90%;
		height: 65%;
		overflow-y: auto;
		margin-top: -20rpx;
	}
	.center{
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.button{
		position: absolute;
		bottom: 0;
		color: #fff;
		font-size: 28rpx;
		margin-bottom: 90rpx;
		width: 80%;
		// margin-left: 10%;
		height: 80rpx;
		flex-direction: row;
		.center;
		.left{
			width: 50%;
			border-radius: 40rpx 0 0 40rpx;
			height: 100%;
			.center;
			background-color: #007AFF;
		}
		.right{
			border-radius:0 40rpx  40rpx 0 ;
			width: 50%;
			height: 100%;
			.center;
			background-color: #00aaff;
		}
	}
	.close{
		right: 0;
		top: 0;
		padding-top: 20rpx;
		padding-right: 20rpx;
		width: 40rpx;
		height: 40rpx;
		position: absolute;
	}
	.model{
		position: relative;
		background-color: #fff;
		width: 100%;
		height: 80%;
		.center;
		border-radius: 40rpx 40rpx 0 0;
	}
	.shade {
		display: flex;
		align-items: flex-end;
		position: fixed;
		z-index: 999999;
		height: 100vh;
		width: 100vw;
		background-color: rgba(0, 0, 0, 0.4);
	}
</style>
