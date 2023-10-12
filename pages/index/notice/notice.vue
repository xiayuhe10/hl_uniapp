<template>
	<view class="content">
		<block v-for="(item,index) in noticeList" :key="index">
			<view  class="list" @click="toDetail(item.id)" hover-class="hover">
				<view :class="readArr.includes(item.id)?'readEd':''" class="title">{{item.noticeTitle}}</view>
				<view class="details">{{item.noticeStatus}}</view>
				<view class="time">{{item.modeifyTime}}</view>
			</view>
		</block>
		<tcx-load-more :loadtext="loadtext"></tcx-load-more>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		components: {},
		data() {
			return {
				noticeList: [],
				loadtext: "上拉加载更多",
				pagenum: 1
			}
		},
		computed: mapState([
			'readArr'
		]),
		onReachBottom() {
			console.log("开始加载分页")
			this.loadMore();
		},
		onShow() {
			this.$store.commit('getRead')
		},
		onReady() {
			this.getNoticeList();
			this.$store.commit('getRead')
		},
		methods: {

			//获取通知列表
			async getNoticeList() {
				try {
					let {
						data: res
					} = await this.$http({
						url: "/slmp-server/notice/list",
						data: {
							limit: 10,
							page: this.pagenum
						}
					})
					this.noticeList = res.data;
					console.log(this.noticeList)
					if (this.noticeList.length > 9) {
						this.loadtext = "上拉加载更多";
					} else {
						this.loadtext = "没有更多了";
					}
				} catch (e) {
					console.log(e)
				}

			},
			//上拉加载更多
			loadMore() {
				if (this.loadtext != "上拉加载更多") {
					return;
				}
				this.loadtext = "加载中...";
				this.pagenum++;
				setTimeout(async () => {
					try {
						let {
							data: res
						} = await this.$http({
							url: "/slmp-server/notice/list",
							data: {
								limit: 10,
								page: this.pagenum
							}
						})
						console.log(res)
						this.loadtext = "上拉加载更多";
						this.noticeList.push(...res.data)
						if (res.data.length > 9) {
							this.loadtext = "上拉加载更多";
						} else {
							this.loadtext = "没有更多了";
						}
					} catch (e) {
						console.log(e)
					}

				}, 1000)
			},
			toDetail(id) {
				uni.navigateTo({
					url: `./notice-details?id=${id}`
				})
			}
		}
	}
</script>

<style lang="less">
	@import "../../../common/global.less";
	.readEd{
		color: #242424 !important;
	}
	page {
		background-color: @backcolorthree;
	}

	.hover {
		background-color: @uni-bg-color-hover  !important;
	}

	.title {
		font-size: 34rpx;
		font-weight: bold;
		color:red;
		.hidden;
		padding-bottom: 4rpx;
	}

	.details {
		font-size: 30rpx;
		color: #646464;
		width: 100%;
		letter-spacing: 2rpx;
		overflow: hidden; //超出的文本隐藏
		text-overflow: ellipsis; //溢出用省略号显示
		display: -webkit-box;
		-webkit-box-orient: vertical;

		-webkit-line-clamp: 2;
	}

	.time {
		font-size: 25upx;
		color: #9a9a9a;
		right: 0;
		bottom: 0;
		margin: 0 10rpx 10rpx 0;
		position: absolute;
	}

	.list {
		margin-top: 4rpx;
		position: relative;
		height: 200rpx;
		width: 100%;
		background-color: #fff;
		flex-direction: column;
		box-sizing: border-box;
		padding: 16rpx;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
