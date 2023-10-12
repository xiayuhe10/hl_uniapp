<template>
	<view>
		<form>
			<view class="cu-form-group">
				<view class="title">类型</view>
					{{changeType(form.type)}}
			</view>
			<view class="cu-form-group">
				<view class="title" style="width: 24%;">内容</view>
				<view class="text-right " >
					{{form.content}}
				</view>
			</view>
			<view class="cu-form-group" v-if="form.type!='SYS_CHECK'" >
				<view class="title">状态</view>
				<text class="text-yellow" v-if="form.checkStatus=='WAITING'"> 待审批</text>
				<text class="text-red" v-if="form.checkStatus=='REFUSE'">已拒绝</text>
				<text class="text-green" v-if="form.checkStatus=='PASS'"> 审批通过</text>
				<text class="text-green" v-if="form.status=='HAVE_READ' && form.checkStatus=='SUCCESS'"> 审批通过</text>
				<text class="text-gray" v-if="form.checkStatus=='CANCEL'"> 已撤销</text>
			</view>
			<view class="cu-form-group" v-if="form.createTime">
				<view class="title">时间</view>
				{{changeTime(form.createTime)}}
			</view>
		</form>
		<view>
		<!-- 	<view class="padding" v-if="form.checkStatus=='WAITING'">
				<view style="width: 50%;float: left;text-align: center;">
					<button class="cu-btn bg-red margin-tb-sm lg"
						@click="checkMessageStatus(form.id,'REFUSE','拒绝')">拒绝</button>
				</view>
				<view style="width: 50%;float: left;text-align: center;">
					<button class="cu-btn bg-green margin-tb-sm lg"
						@click="checkMessageStatus(form.id,'SUCCESS','通过')">通过</button>
				</view>

			</view> -->
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
						break
				}
			},
			checkMessageStatus(id,status,name){
				let that = this;
				let msg = name+"此条申请？"
				if (status == 'PASS') {
					msg = "审批通过？"
				}
				uni.showModal({
					title: '提示',
					content: msg,
					success: function(res) {
						if (res.confirm) {
							that.updateMessageStatus(id, status);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			updateMessageStatus(id,status){
				Request.post(Request.API.agreeApply, {
					"id": id,
					"checkStatus": status
				},'form').then(res => {
					if (res.data.code == 200) {
						uni.showToast({
							title: '操作成功！',
							icon: "success",
							duration: 2000
						});
						setTimeout(() => {
							this.getInfo(id);
						    uni.navigateBack({
						    	delta: 1
						    })
						}, 500);
						
					}
				})
			},
			changeTime(date) {
				return dateTime.dateTime1(date);
			},
		}
	}
</script>

<style>

</style>
