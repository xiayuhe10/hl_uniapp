<template>
	<view>
		<view class='margin-xl bg-white padding-xl radius shadow-lg'>
			<view class='text-center  text-lg  text-grey'>{{changeType(form.type)}}</view>
			<view class="" v-if="form.type=='CHECK'">
				<text class="text-yellow" v-if="form.checkStatus=='WAITING'"> 待审批</text>
				<text class="text-red" v-if="form.checkStatus=='REFUSE'">已拒绝</text>
				<text class="text-green" v-if="form.checkStatus=='PASS'"> 审批通过</text>
				<text class="text-green" v-if="form.status=='HAVE_READ' && form.checkStatus=='SUCCESS'"> 审批通过</text>
				<text class="text-gray" v-if="form.checkStatus=='CANCEL'"> 已撤销</text>
			</view>
			<view class='text-content'>
				<view class='margin-top-sm'>{{form.content}}</view>
			</view>
			<view class="flex justify-end">
				<view class="flex flex-direction align-center justify-between ">
					<view class="text-gray text-sm margin-top" v-if="form.type=='SYS_CHECK'" >{{form.nickName}}</view>
					<view class="text-gray " v-if="form.createTime">
						{{changeTime(form.createTime)}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Request from '@/common/request.js';
	import webUrl from '@/common/config.js';
	import dateTime from '@/common/dateTime.js';
	export default {
		data() {
			return {
				form: {}
			}
		},
		onLoad(option) {
			let id = option.id
			this.getInfo(id)
			this.readMessage(id);
		},
		methods: {
			getInfo(id) {
				Request.get(Request.API.messageInfo + '/' + id).then(res => {
					if (res.data.code == 200) {
						this.form = res.data.data
					}
					console.info(res.data.data)
				})
			},
			readMessage(id) { //将该消息设置为已读
				Request.put(Request.API.updateMessageStatusById, {
					id: id
				}, "form").then(res => { })
			},
			changeType(type) {
				switch (type) {
					case 'FRIEND_ADD':
						return "好友申请添加";
						break
					case 'GROUP_ADD':
						return "群组申请添加";
						break
					case 'CLASS':
						return "班级申请消息";
						break
					case 'HAND_OVER_CLASS':
						return "移交班群审批";
						break
					case 'APPLY_SCHOOL':
						return "学校申请";
						break
					case 'CLASS_INVITE':
						return "班级邀请";
						break
					case 'PATRIARCH_BIND_STUDENT':
						return "家长申请绑定学生";
						break
					case 'SYS_CHECK':
						return "系统审核";
						break
					case 'CLASS_DISSOLVE':
						return "班级解散通知";
						break
					case 'CLASS_KICKOUT':
						return "踢出班级通知";
						break
					case 'STUDENT_AWARD':
						return "学生奖状通知";
						break
					case 'ACHIEVEMENT':
						return "成绩通知";
						break
					case 'DANGER_REPORT':
						return "隐患上报通知";
						break
					case 'PATRIARCH_BIND_STUDENT':
						return "家长申请绑定学生通知";
						break
					case 'GROUP_NOTICE':
						return "群公告通知";
						break
					case 'GROUP_FILE':
						return "群文件通知";
						break
					default:
						return "系统通知";
						break
				}
			},
			changeTime(date) {
				return dateTime.dateTime1(date);
			},
		}
	}
</script>

<style>

</style>
