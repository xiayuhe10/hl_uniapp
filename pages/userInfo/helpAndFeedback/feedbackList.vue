<template>
	<view class="page">
		<view v-for="(item,index) in list" :key="index" @click="toDetail(item)">
			<view class="list-box">
				<view class="text-title">{{item.content}}</view>
				<view class="text-time">{{item.createTime}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Request from '@/common/request.js';
	import weburl from '@/common/config.js';
	export default {
		data() {
			return {
				list: [],
			}
		},
		onLoad() {
			this.getList();
		},
		methods: {
			//获取用户意见反馈列表
			getList() {
				Request.get(Request.API.complaintList).then(res => {
					this.list = res.data.rows
				})

			},
			toDetail(item) {
				
			},


		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F8F8F8;
	}

	.text-title {
		color: #303133;
		font-size: 30rpx;
		font-weight: bold;
		margin-right: 100rpx;
	}

	.text-time {
		color: #909193;
		font-size: 24rpx;
		margin-top: 24rpx;
	}

	.text-tips {
		color: #bcbcbc;
		font-size: 24rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 22rpx;
	}

	.state-green {
		position: absolute;
		right: 0;
		top: 0;
		color: #07C160;
		font-size: 28rpx;
		padding: 30rpx;
	}

	.state-grey {
		position: absolute;
		right: 0;
		padding: 30rpx;
		top: 0;
		color: #606266;
		font-size: 28rpx;
	}



	.list-box {
		position: relative;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		margin-top: 30rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
		padding: 30rpx;
	}



	.flex-col {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
	}
</style>
