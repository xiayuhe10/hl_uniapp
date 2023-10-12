<template>
	<view class="avatarwrap">
		<view v-if="!isLoad&&systemMessage.length==0" class="cu-load " :class="!isLoad?'loading':'over'"></view>
		<scroll-view class="scroll-box" scroll-y @scrolltolower="scrollLower" style="height: 100%">
			<view class="cu-list menu-avatar">
				<view class="cu-item" v-for="(item,index) in systemMessage" :key="index"
					@click="item.type=='LEAVE'?gotoList(item.type):''">
					<view class="cu-avatar round lg bg-white" v-if="item.avatar"
						:style="{backgroundImage:`url(${fileUrl+item.avatar})`}">
						<view v-if="item.status == 'UN_READ'" class="cu-tag badge round"></view>
					</view>
					<view class="cu-avatar round lg" v-else
						:style="{backgroundImage:`url(../../static/message/teacher.png)`}">
						<view v-if="item.status == 'UN_READ'" class="cu-tag badge round"></view>
					</view>
					<view class="content" @click="item.type!='LEAVE'?toDetail(item.id):''">
						<view class="text-grey">{{item.nickName}}
							<view class="text-gray text-xs margin-left"> {{changeTime(item.createTime)}}</view>
						</view>

						<view class="text-gray text-sm flex">
							<text class="text-cut">
								{{item.content}}
							</text>
						</view>
					</view>

					<view class="action" v-if="item.type!='LEAVE'">
						<view class="cu-tag round bg-grey sm" v-if="item.checkStatus=='WAITING'"
							@click="agreeView(item.id)">同意</view>
						<view class="text-grey" v-if="item.checkStatus=='REFUSE'">已拒绝</view>
						<view class="text-grey" v-if="item.checkStatus=='SUCCESS'">已通过</view>
						<view class="text-grey" v-if="item.checkStatus=='PASTED'">已过期</view>
						<view class="text-grey" v-if="item.checkStatus=='CANCEL'">已取消</view>
					</view>

				</view>
			</view>
			<view v-if="systemMessage.length>=30">
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
	export default {
		data() {
			return {
				fileUrl: '',
				webSocket: null,
				systemMessage: [],
				pageNum: 1,
				pageSize: 30,
				listTotal: 30,
				isLoad: false,
			}
		},
		onLoad() {
			this.fileUrl = webUrl.fileURL;
		},
		onShow() {
			this.selectCheckMessageList();
		},
		methods: {
			//系统未读消息列表
			selectCheckMessageList() {
				Request.get(Request.API.messageInfoMylist, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					scopeType: 'CHECK'
				}).then(res => {
					this.isLoad = true
					if (res.data.code == 200) {
						this.systemMessage = res.data.rows ? res.data.rows : []
						// for (let i = 0; i < this.systemMessage.length; i++) {
						// 	if (this.systemMessage[i].status == "UN_READ") {
						// 		this.updateSetMessageRead(this.systemMessage[i].id);
						// 	}
						// }
					}
				})
			},
			//同意
			agreeView(id) {
				let messageId = id;
				let that = this;
				uni.showModal({
					title: '提示',
					content: '同意申请',
					success: function(res) {
						if (res.confirm) {
							that.agree(messageId);
						} else if (res.cancel) {

						}
					}
				});
			},
			agree(id) {
				let that = this
				Request.post(Request.API.agreeApply, {
					"id": id,
					"checkStatus": "SUCCESS"
				}, "form").then(res => {
					if (res.data.code == 200) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							duration: 2000
						})
						setTimeout(() => {
							that.selectCheckMessageList();
						}, 1000)
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
						})
					}
				})
			},
			gotoList(type) {
				if (type == 'LEAVE') {
					uni.navigateTo({
						url: '../../broadcast/leave/leave'
					})
				}
			},
			//前往消息详情页
			toDetail(id) {
				console.log(id)
				uni.navigateTo({
					url: './checkInfo?id=' + id
				})
			},
			//将消息设置为已读
			updateSetMessageRead(id) {
				Request.put(Request.API.updateMessageStatusById, {
					id,
					id
				}, "form").then(res => {})
			},
			changeTime(date) {
				return dateTime.dateTime1(date);
			},
			scrollLower() {
				console.log('我滚动到底部了')
				// console.info(this.pageSize ,this.listTotal)
				// if (this.pageSize <= this.listTotal) {
				this.isLoad = false
				this.pageSize = this.pageSize + 10
				this.selectCheckMessageList();
				// }
			},
		}
	}
</script>

<style>
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
