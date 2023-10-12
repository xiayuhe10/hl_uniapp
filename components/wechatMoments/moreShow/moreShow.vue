<template>
	<view>
		<view class="bg-white padding-lr padding-top-sm flex justify-end align-center response">
			<view class=" flex animation-fade padding-xs text-white" v-show="moreShowFlag && moreShowIndex==index"
				style="background-color: #4c4c4c ;border-radius: 8rpx;">
				<view class="flex align-center margin-lr" @tap="thumbsUp()">
					<view class="" :class="likeID.includes(userInfo.userId)?'text-red cuIcon-likefill':'cuIcon-like'" >  </view>
					<view class="text-xs margin-left-xs text-white ">赞</view>
				</view>
				<view class="flex align-center margin-lr" @tap="commentUp()">
					<view class="cuIcon-message " ></view>
					<view class="text-xs margin-left-xs text-white ">评论</view>
				</view>
				<view class="flex align-center margin-lr" v-if="userInfo.userId == dateList.createId"  @tap="delAlbumModal()" >
					<view class="cuIcon-delete "></view>
					<view class="text-xs margin-left-xs text-white ">删除</view>
				</view>
				<view class="flex align-center margin-lr" v-if="userInfo.userId != dateList.createId " @tap="topClick('report',index)" >
					<view class="cuIcon-warn " > </view>
					<view class="text-xs margin-left-xs text-white ">举报</view>
				</view>
			</view>
			<view class=" text-right text-xl padding-xs" @tap.stop="moreShowTap(dateList,index)">
				<view class="cuIcon-more "></view>
			</view>
		</view>
		<view class="bg-white padding-lr-sm padding-bottom">
			<!-- 点赞 -->
			<view class="bg-gray padding-lr text-xs padding-tb-xs flex flex-wrap align-center "
				v-if="likeValue.length>0" style="color: #5c698b;">
				<view class="cuIcon-like  margin-lr-xs"></view>
				<view v-for="(itemLike,indexLike) in likeValue" :key="indexLike">
					<view class=" ">
						<text>{{itemLike.nickName}}</text>
						<text v-if="indexLike != likeValue.length-1" class=" text-xs text-bold margin-right-xs "> ，
						</text>
					</view>
				</view>
			</view>
			<!-- 评论 -->
			<view class="padding-tb-xs bg-gray" v-if="commentValue.length>0">
				<view v-for="(itemCom,indexCom) in commentValue" :key="indexCom" class="padding-lr  bg-gray"
					@tap="replyCom(itemCom,index)" @longpress.stop="delComment(itemCom)">
					<text class="text-xs text-bold" style="color: #5c698b;" @tap.top="patriarchInfo(itemCom.createId)">
						{{itemCom.nickName}}
					</text>
					<text class="text-sm margin-lr-xs"
						v-if="itemCom.toUserId != itemCom.createId && itemCom.type == 'REPLY'">
						回复
					</text>
					<text v-if="itemCom.toUserId != itemCom.createId && itemCom.type == 'REPLY'"
						class="text-xs text-bold" style="color: #5c698b;">
						{{itemCom.toNickName}}
					</text>
					<text>：</text>
					<text>
						{{itemCom.content}}
					</text>
				</view>
			</view>
		</view>
		<!-- 评论框 -->
		<view class="box padding-sm " v-if="commentIndex==index && commentFlag == true">
			<view class="box2">
				<view class='text_box'>
					<textarea fixed='true' contenteditable="true" auto-height="true" v-model="mytext" class=''
						name='commentValue' :placeholder='placeholderValue' placeholder-style='font-size:24rpx;'
						maxlength='700' style='background-color: white ;width: 100%;'></textarea>
				</view>
				<view class="">
					<button v-if="mytext == ''" size="mini" form-type='submit' disabled class=''>发送</button>
					<button v-if="mytext != ''" size="mini" form-type='submit' class='bg-blue  light'
						@tap="commentTap()">发送</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import webUrl from '@/common/config.js';
	import Request from '@/common/request.js';
	import dateTime from '@/common/dateTime.js';
	export default {
		name: 'mychild',
		props: ['dateFlag','dateList', 'dateIndex'],
		data() {
			return {
				dateInfo: {},
				index: '',
				fileUrl: webUrl.fileURL,
				userInfo: {},
				moreShowFlag: false,
				moreShowIndex: -1,
				commentIndex: -1,
				likeValue: [],
				commentValue: [],
				commentFlag: false,
				mytext: '', // 评论内容
				placeholderValue: '评论', // 无评论时的提示
				likeID: []
			}
		},
		watch: {
			dateList: {
				handler: function(val) {
					// console.log(val, "监听dateList")
					this.dateInfo = val
					this.userInfo = uni.getStorageSync('userInfo')
					this.listLike(val.id)
					this.listComment(val.id)
				},
				immediate: true, //--首次加载时执行监听
				deep: true //--值改变时执行监听
			},
			dateIndex: {
				handler: function(val) {
					// console.log(val, "监听dateIndex")
					this.index = val
				},
				immediate: true, //--首次加载时执行监听
				deep: true //--值改变时执行监听
			},
			dateFlag: {
				handler: function(val) {
					// console.log(val, "监听dateFlag")
					let that = this
					if (that.moreShowFlag) {
						setTimeout(() => {
							that.moreShowFlag = false
						}, 500);
					}
				},
				immediate: true, //--首次加载时执行监听
				deep: true //--值改变时执行监听
			},
		},
		onShow() {
			
		},
		methods: {
			listLike(photoId) { // 查询点赞列表
				let that = this
				let index = this.index
				Request.get(Request.API.listLike, {
					photoId: photoId
				}).then(res => {
					that.likeValue = res.data.rows
					let showId = []
					that.likeValue.forEach(function(value){
						showId.push(value.createId)
					})
					that.likeID = showId
					// console.info("查询点赞列表", res.data.rows, index)
				})
			},
			listComment(photoId) { // 查询评论列表
				let that = this
				let index = this.index
				Request.get(Request.API.listComment, {
					photoId: photoId
				}).then(res => {
					that.commentValue = res.data.rows
					// console.info("查询评论列表", res.data.rows)
				})
			},
			thumbsUp() { // 点赞按钮
				let that = this
				that.moreShowFlag = false
				Request.post(Request.API.albumlike, {
					photoId: this.dateInfo.id
				}).then(res => {
					this.listLike(this.dateInfo.id)
				})
			},
			commentUp() { // 评论
				this.commentFlag = this.replyFlag ? true : !this.commentFlag
				this.moreShowFlag = false
				this.commentIndex = this.index
				this.mytext = ""
				this.placeholderValue = "评论"
				this.replyFlag = false
			},
			replyCom(value, index) { // 评论回复
				this.commentFlag = !this.commentFlag
				this.replyFlag = true
				this.commentIndex = this.index
				this.mytext = ""
				this.placeholderValue = "回复" + value.nickName
				this.toUserId = value.createId
				console.info("回复", value, this.toUserId, value.nickName)
			},
			commentTap(toUserId, index) { // POST新增相册评论
				let that = this
				Request.post(Request.API.addComment, {
					photoId: this.dateInfo.id, // 相册id
					content: this.mytext, // 评论内容
					toUserId: this.replyFlag ? this.toUserId : this.dateInfo.id, // 评论用户的目标id
					type: this.replyFlag ? 'REPLY' : 'COMMENT' // COMMENT(0, "评论","评论"), REPLY(1, "回复","回复");
				}).then(res => {
					if (res.data.code != 200) {
						uni.showToast({
							icon: 'none',
							title: '评论失败'
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
						that.commentFlag = false
						that.mytext = ""
						that.listComment(that.dateInfo.id)
					}
				})
			},
			delAlbumModal(value) { // 确认要删除该内容吗
				let that = this
				uni.showModal({
					title: '提示',
					content: '确认要删除该内容吗？',
					success: function(res) {
						if (res.confirm) {
							console.log('点击了确认')
							that.moreShowFlag = false
							uni.showLoading({
								title:'删除中...'
							});
							that.delAlbum()
						}
					}
				})
			},
			delAlbum(){
				let that = this
				Request.delete(Request.API.delAlbum + that.dateInfo.id).then(res => {
					uni.hideLoading()
					if (res.data.code == 200) {
						uni.showToast({ title: '删除成功', icon: 'success', duration: 2000 })
						setTimeout(() => {
							that.topClick('delete')
						},  1000 )
					} else {
						uni.showToast({ title: '删除失败', icon: 'none', duration: 2000  })
					}
				})
			},
			delComment(item) { // GET删除相册评论
				let that = this
				console.info(item.createId,that.userInfo)
				if (item.createId == that.userInfo.userId) {
					uni.showModal({
						title: '提示',
						content: '是否要删除该评论？',
						success: function(res) {
							if (res.confirm) {
								Request.delete(Request.API.delComment + item.id).then(res => {
									uni.showToast({
										icon: 'none',
										title: res.data.msg
									})
									that.listComment(that.dateInfo.id)
								})
							}
						}
					})
				}
			},
			topClick(type) {
				let push = {
					type: type,
					value: this.dateInfo
				}
				this.moreShowFlag = false
				this.$emit('moreShowClick', push);
			},
			moreShowTap(value, index) {
				if (this.moreShowIndex == index) {
					this.moreShowFlag = !this.moreShowFlag
				} else {
					this.moreShowFlag = true
				}
				this.moreShowIndex = index
			},
			changeTime(date) { // 日期格式化
				return dateTime.dateTime(date);
			},
		}
	}
</script>

<style>
	.box2 {
		width: 100%;
		padding: 10rpx;
		border-radius: 10rpx;
		border: 1px solid skyblue;
		background-color: #ffffff;
	}

	.box {
		width: 100%;
		min-height: 50px;
		display: flex;
		flex-direction: row;
		background-color: #f7f7f7;
	}

	.box2 button {
		align-self: center;
		float: right;
	}
</style>
