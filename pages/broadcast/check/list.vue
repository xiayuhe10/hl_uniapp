<template>
	<view class="avatarwrap">
		<view class="cu-load " v-if="!isLoad&& checkList.length ==0" :class="!isLoad?'loading':'over'"></view>
		<view class="margin-top text-center" v-if="checkList && checkList.length ==0 &&isLoad">
			<view class="align-center flex justify-center margin-top" style="margin-top:100px">
				<image src="../../../static/broadcast/nofound.png" style="display:block;height: 100px;width: 100px;">
				</image>
			</view>
			<view class="text-center text-bold text-gray">
				还没有消息哦
			</view>
		</view>
		<scroll-view v-if="checkList.length >0" class="scroll-box" scroll-y @scrolltolower="scrollLower"
			style="height: 100%;" >
			<view class="margin bg-white solid  radius " v-for="(item,index) in checkList" :key="index">
				<view class="cu-item shadow padding">
					<view class="cu-list" @tap="toDetail(item)">
						<view class="cu-item">
							<view class="flex justify-between align-center">
								<view class="text-cut text-bold" :class="item.isRead=='UNREAD'?'text-orange':'text-gray'">
									{{TYPE[item.type].NAME}}
								</view>
								<view class="text-content text-left">
									<view :class="'text-'+STATUS[item.status].col">{{STATUS[item.status].NAME}}</view>
								</view>
							</view>
							<view class="text-gray text-sm margin-top-xs flex justify-between align-center ">
								<view class="margin-top text-sm">
									{{changeTime(item.createTime)}}
								</view>
								<view class="margin-top text-sm">
									{{item.createBy}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="checkList.length>=20">
				<view class="cu-load " :class="!isLoad?'loading':'over'"></view>
				<view class="cu-load load-cuIcon " :class="!isLoad?'checked':'over'"></view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import Request from '@/common/request.js';
	import webUrl from '@/common/config.js';
	import dateTime from '@/common/dateTime.js';
	import status from '@/common/enums/status.js';
	export default {
		data() {
			return {
				checkList: [],
				tempData: [],
				fileUrl: '',
				pageNum: 1,
				pageSize: 5,
				listTotal: 20,
				isLoad: false,

				inTypeList: [],
				outTypeList: [],
				statusList: [],
				
				STATUS:status.checkStatus,
				TYPE:status.checkType
			}
		},
		async created() {
			// await this.$dict.loadType('in_storage')
			// this.inTypeList = this.$dict.getType('in_storage')
			// await this.$dict.loadType('out_storage')
			// this.outTypeList = this.$dict.getType('out_storage')
			// await this.$dict.loadType('in_storage_status')
			// this.statusList = this.$dict.getType('in_storage_status')
		},
		onLoad(option) {
			this.fileUrl = webUrl.fileURL;
		},
		onShow() {
			this.isLoad = false
			this.getList();
		},
		methods: {
			getList: function() {
				Request.get(Request.API.checkMsgMyList, {
					"pageNum": this.pageNum,
					"pageSize": this.pageSize
				}).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						this.checkList = res.data.rows
						this.listTotal = res.data.total
					} else {
						uni.showToast({
							title: '加载失败',
							icon: 'none',
							duration: 2000
						})
					}
					this.isLoad = true
				})
			},
			scrollLower() {
				console.log('我滚动到底部了')
				if (this.pageSize <= this.listTotal) {
					this.isLoad = false
					this.pageSize = this.pageSize + 10
					this.getList()
				}
			},
			changeTime(date) { // 日期格式化
				return dateTime.dateTime(date);
			},
			toDetail(e) {
				if(e.isRead=="UNREAD"){
					let params = {
						id: e.id,
						isRead: 'READ'
					}
					Request.put(Request.API.checkMsg, params).then(res => {
						
					})
				}
				if (this.TYPE[e.type].VALUE==0) {//施工订单
					uni.navigateTo({
						url: './taskOrderDetail?id=' + e.id + '&bizId=' + e.bizId
					})
				} else if(this.TYPE[e.type].VALUE==1){//用户注册
					uni.navigateTo({
						url: './registerDetail?id=' + e.id + '&bizId=' + e.bizId
					})
				}

			}
		}
	}
</script>

<style>
	.textOverFlow {
		/* width: 80%; */
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		/* border: 1px solid #ddd; */
		text-overflow: ellipsis;
		text-align: center;

	}

	.listView {
		border: 1px solid #e5e0e0;
		width: 94%;
		margin: 10px auto;
		padding: 2px;
	}

	.test-view {

		height: 80px;
		color: #7e7c7c;

	}

	.images {
		display: block;
		width: 15%;
		height: 60px;
		float: left;
		margin-right: 1%;
		border: 1px solid red;
		margin-top: 5px;
	}

	.cu-card.dynamic>.cu-item .only-img {
		min-height: 180rpx;
	}

	.avatarwrap {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: calc(100vh - var(--window-top));
	}

	.avatarwrap .scroll-box {
		flex: 1;
		overflow: scroll;
	}
</style>