<template>
	<view class="avatarwrap">
		<view v-if="!isLoad&&systemMessage.length==0" class="cu-load " :class="!isLoad?'loading':'over'"></view>
		<scroll-view class="scroll-box" scroll-y @scrolltolower="scrollLower" style="height: 100%">
			<view class="cu-list menu-avatar ">
				<view class="cu-item" v-for="(item,index) in systemMessage" :key="index"
					@click="gotoList(item.id,item.type,item,item.bizId)">
					<view class="cu-avatar round lg bg-white" v-if="item.avatar"
						:style="{backgroundImage:`url(${fileUrl+item.avatar})`}">
						<view v-if="item.status == 'UN_READ'" class="cu-tag badge"></view>
					</view>
					<view class="cu-avatar round lg" v-else
						style="backgroundImage:url(../../static/message/teacher.png)">
						<view v-if="item.status == 'UN_READ'" class="cu-tag badge"></view>
					</view>
					<view class="content" >
						<view class="text-grey">{{item.nickName}}
							<view class="text-gray text-xs margin-left"> {{changeTime(item.createTime)}}</view>
						</view>

						<view class="text-gray text-sm flex">
							<text class="text-cut">
								{{item.content}}
							</text>
						</view>
					</view>

					<!--      <view class="action" v-if="item.type!='LEAVE'">
					  <view class="cu-tag round bg-grey sm" v-if="item.checkStatus=='WAITING'" @click="agreeView(item.id)">同意</view>
									 <view class="text-grey" v-if="item.checkStatus=='REFUSE'">已拒绝</view>
									<view class="text-grey" v-if="item.checkStatus=='SUCCESS'">已通过</view>
					  <view class="text-grey" v-if="item.checkStatus=='PASTED'">已过期</view>
									   <view class="text-grey" v-if="item.checkStatus=='CANCEL'">已取消</view>
					</view> -->
				</view>
			</view>
			<view v-if="systemMessage.length>=20">
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
				pageNum: 1,
				pageSize: 20,
				listTotal: 20,
				isLoad: false,
				webSocket: null,
				systemMessage: [],
				userInfo: {},
				flag: 'SYSTEM'
			}
		},
		onLoad(option) {
			console.info(option)
			this.flag = option.flag? option.flag:'SYSTEM'
			this.fileUrl = webUrl.fileURL;
			this.userInfo = uni.getStorageSync('userInfo')
		},
		onShow() {
			this.selectSystemMessageList();
		},
		methods: {
			//系统未读消息列表
			selectSystemMessageList() {
				let that = this
				Request.get(Request.API.messageInfoMylist, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					scopeType: this.flag
				}).then(res => {
					if (res.data.code == 200) {
						this.systemMessage = res.data.rows ? res.data.rows : []
					}
					that.isLoad = true
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
				Request.post(Request.API.agreeApply, {
					"id": id,
					"checkStatus": "SUCCESS"
				}, "form").then(res => {
					this.selectSystemMessageList();
				})
			},
			gotoList(id, type, value, bizId) {
				console.info(id, type, value,bizId)
				if (this.userInfo.userType != '02') {
					this.terNavToInfo(id, type, value,bizId)
				} else {
					this.parNavToInfo(id, type, value,bizId)
				}
			},
			parNavToInfo(id, type, value,bizId){
				if (type == 'STUDENT_COMMENT') { // 点评
					this.navToInfo('../../parent/dianPing/dianPing?studentId=' + bizId)
				} else if (type == 'STUDENT_ATTENDANCE') { // 考勤
					this.navToInfo('../../parent/attendance/attendance?studentId=' + bizId)
				} else if (type == 'ACHIEVEMENT') { // 成绩
					this.navToInfo('../../parent/achievement/achievement')
				} else if (type == 'PATRIARCH_SIGN') { // 家长会签到
					this.navToInfo('../../parent/patriarchSign/index')
				} else if (type == 'ACTIVITY') { // 活动报名
					this.navToInfo('../../parent/activity/detail?id=' + bizId)
				} else if (type == 'SOLITAIRE') { // 接龙
					this.navToInfo('../../parent/solitaire/solitaire')
				} else if (type == 'CLASS_PHOTO') { // 班级相册
					this.navToInfo('../../parent/classPhoto/classPhoto?id=' + bizId)
				} else if (type == 'SCHOOL_NOTICE') { // 学校通知
					this.navToInfo('../../broadcast/notice/noticeInfo?id=' + bizId)
				} else if (type == 'WORK') { // 作业
					this.navToInfo('../../parent/homework/homework?id=' + bizId)
				} else if (type == 'CLASS_NOTICE') { // 班级通知
					this.navToInfo('../../parent/classNotice/classNotice?id=' + bizId)
				} else if (type == 'PHOTO_ALBUM_LIKE' || type == 'PHOTO_ALBUM_COMMENT') { // 相册点赞 相册评论
					this.navToInfo('../../parent/dailyLife/dailyLife')
				} else if (type == 'WELCOME') { // 欢迎语
					this.navToInfo('../welcome/welcome?id=' + bizId)
				} else if (type == 'LEAVE') { // 请假
					this.navToInfo('../../parent/leave/leaveInfo/leaveInfo?id=' + bizId)
				} else if (type == 'QUESTIONNAIRE') { // 问卷调查
					this.navToInfo('../../parent/questionnaire/questionnaire')
				} else if (type == 'REPORT') { // 上报
					this.navToInfo('../../parent/report/report')
				} else if (type == 'STUDENT_AWARD') { // 奖状
					this.navToInfo('../../parent/myChild/stuAwardInfo/stuAwardInfo')
				} else { // 系统审批 家长绑定学生结果通知 班级解散 踢出班级
					// type == 'SYS_CHECK' 'PATRIARCH_BIND_STUDENT_RESULT' 'CLASS_DISSOLVE' 'CLASS_KICKOUT'
					this.navToInfo('./systemMessageInfo/systemMessageInfo?id=' + id)
				}  
				// else {
				// 	this.navToInfo('./systemMessageInfo/systemMessageInfo?id=' + id)
				// }
			},
			terNavToInfo(id, type, value,bizId){
				if (type == 'LEAVE') { // 申请请假审批
					this.navToInfo('../../broadcast/leave/leaveInfo?id=' + bizId)
				} else if (type == 'TEACHER_LEAVE') { // 老师申请请假审批
					this.navToInfo('../../broadcast/teacherLeave/teacherLeaveInfo/teacherLeaveInfo?id=' + bizId)
				} else if (type == 'WELCOME') { // 欢迎语
					this.navToInfo('../welcome/welcome?id=' + bizId)
				} else if (type == 'PHOTO_ALBUM_LIKE' || type == 'PHOTO_ALBUM_COMMENT') { // 相册点赞 相册评论
					this.navToInfo('../../broadcast/album/myAlbum?userId=' + this.userInfo.userId)
				} else if (type == 'TEMPERATURE_EXCEPTION') { // 体温异常
					this.navToInfo('../../broadcast/epidemic/epidemic?userId=' + this.userInfo.userId)
				} else if (type == 'DISINFECT_LOG') { // 消毒记录
					this.navToInfo('../../broadcast/disinfect/disinfect?userId=' + this.userInfo.userId)
				} else if (type == 'VENTILATION') { // "通风透气记录
					this.navToInfo('../../broadcast/ventilationRecord/ventilationRecord?userId=' + this.userInfo.userId)
				} else if (type == 'SCHOOL_NOTICE') { // 学校通知
					value.noticeId = value.bizId
					let url = '../../broadcast/schoolNotice/schoolNoticeInfo/schoolNoticeInfo?item=' + JSON.stringify(value)
					this.navToInfo(url)
				} else if (type == 'CLASS_PHOTO') { // 班级相册
					this.navToInfo('../../broadcast/classAlbum/classAlbum?userId=' + this.userInfo.userId)
				} else if (type == 'TEMPERATURE_UNDO') { // 未测温通知
					this.navToInfo('../../broadcast/epidemic/epidemic?userId=' + this.userInfo.userId)
				} else if (type == 'WORK') { // 作业接收通知
					value.id = value.bizId
					this.navToInfo('../../broadcast/workList/workList?userId=' + this.userInfo.userId)
				} else if (type == 'MEETING_ROOM') { // 会议室预定
					this.navToInfo('../../broadcast/conferenceRoom/conferenceRoomInfo/conferenceRoomInfo?id=' + bizId)
				} else if (type == 'CLASS_ONLINE_INCOME') { // 在线课程收益
					this.navToInfo('../../userInfo/userBalance/userBalance')
				} else if (type == 'ORDER') { // 订单
					this.navToInfo('./systemMessageInfo/systemMessageInfo?id=' + id)
				} else if (type == 'DANGER_REPORT') { // 隐患上报
					this.navToInfo('../../broadcast/dangerReport/dangerReport')
				} else if (type == 'LIVE_MEETING') { // 视频会议
					this.navToInfo('../../broadcast/liveMeeting/liveMeeting')
				} else {
					this.navToInfo('./systemMessageInfo/systemMessageInfo?id=' + id)
				}
			},
			navToInfo(url){
				uni.navigateTo({
					url: url
				})
			},
			//将该消息设置为已读
			readMessage(messageId) {
				Request.put(Request.API.updateMessageStatusById, {
					id: messageId
				}, "form").then(res => {
					this.selectSystemMessageList();
				})
			},
			//前往消息详情页
			toDetail(id) {
				console.log(id)
				uni.navigateTo({
					url: './messageInfo?id=' + id
				})
			},
			//将消息设置为已读
			updateSetMessageRead(id) {
				Request.put(Request.API.updateMessageStatusById, {
					id: id
				}, "form").then(res => {

				})
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
				this.selectSystemMessageList();
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
