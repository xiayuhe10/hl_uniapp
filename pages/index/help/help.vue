<template>
	<view>
		<view class="model">
			<view class="title" @click="showSubNVue()">常见问题</view>
			<template v-if="documentList.length>0">
				<block v-for="(item,index) in documentList">
				<view class="content " @click="to(index)">
				<view class="contentTitle borderTop">{{item.documentTitle}}</view>
				</view>
				</block>
			</template>
			<template v-else>
				<view style="display: flex;justify-content: center;padding-top: 20rpx;">暂无数据</view>
			</template>			
		</view>
	</view>
</template>

<script> 
	export default {
		data() {
			return {
			num:0,
			documentList:[]
			}
		},
		mounted() {
			this.getDocument();
		},
		methods: {
			
			//获取文档信息
			async getDocument(){
				let {data:res} = await this.$http({
					url: '/slmp-server/helpdocument/list',
					data:{
						limit:10,
						page:this.num++
					}
				})
				console.log(res); 
				this.documentList = res.data;
				console.log(this.documentList)
			},
			to(e){
				uni.navigateTo({
					url:"./document?id="+this.documentList[e].id
				})
			}
		}
	}
</script>

<style lang="less">
	@import "../../../common/global.less";

	.title {
		height: 60rpx;
		width: 100%;
		background-color: #F0F0F0;
		color: #B9B9B9;
		display: flex;
		align-items: center;
		padding-left: 20rpx;
		font-size: 26rpx;
	}

	.content {
		padding: 0rpx 15rpx;
		display: flex;
		justify-content: flex-end;

	}

	.contentTitle {
		width: 94%;
		height: 80rpx;
		font-size: 32rpx;
		line-height: 80rpx;
		.hidden;
	}

	.borderTop {
		border-top: 1rpx solid #F5F5F5;
	}
</style>
