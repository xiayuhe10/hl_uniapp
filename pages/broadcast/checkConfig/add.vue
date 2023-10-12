<template>
	<view>
		  <view class="cu-bar bg-white solid-bottom ">
		    <view class="action">
				{{planInfo.name}} 审核流程配置
		    </view>
		
		</view>
		  <view class="cu-list menu ">
		<view class="cu-item ">
		   <view class="content">
		     <text class="text-grey">是否开启审核</text>
		   </view>
			<view class="action">
				<switch class="red" bindchange="switchSex"></switch>
		    </view>
	    </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				planInfo:{}
			}
		},
		onLoad(){
		 this.planInfo = uni.getStorageSync("plantInfo")
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
