<template>
	<view class="avatarwrap">
		<view class='margin-sm bg-white padding-xl radius shadow-lg'>
			  <view class='text-center margin-bottom text-lg  text-grey'>用户信息</view>
			  	<view class="cu-form-group margin-top">
			  		<view class="title">姓名</view>
			  		<input :placeholder="userInfo.userName" disabled="disabled"></input>
			  	</view>
				<view class="cu-form-group ">
					<view class="title">状态</view>
					<input  :placeholder-class="'text-'+userStatus[userInfo.status].col" disabled="disabled":placeholder="userStatus[userInfo.status].NAME"></input>
				</view>
				<view class="cu-form-group ">
					<view class="title">手机号码</view>
					<input  :placeholder="userInfo.phonenumber" disabled="disabled"></input>
				</view>
		
				<view class="cu-form-group ">
					<view class="title">注册时间</view>
					<input :placeholder="userInfo.createTime" disabled="disabled"></input>
				</view>
				
		</view>
	
		<view class="cu-bar bg-white solid-bottom margin-sm">
		  <view class="action">
		    <text class="cuIcon-title text-blue"></text>审核信息
		  </view>
		  <view class="action">
		    <text :class="'text-'+checkStatus[checkInfo.status].col">{{checkStatus[checkInfo.status].NAME}}</text>
		  </view>
		</view>
		<view class="margin-lg" v-show="checkInfo.status=='REVIEW'">
			<view style="width: 50%;float: left;" class="text-center">
				 <button class="cu-btn lg bg-red" style="width: 50%;" @click="check('REFUSE')">拒绝</button>
			</view>
			<view style="width: 50%;float: left;" class="text-center">
			  <button class="cu-btn lg bg-green"  style="width: 50%;"@click="check('PASS')">通过</button>
			  </view>
		</view>
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
				userId:null,
				checkId:null,
				checkInfo:{},
				userInfo:{},
				userStatus:status.userStatus,
				checkStatus:status.checkStatus
			}
		},
		onLoad(option) {
			this.userId=option.bizId;
			this.checkId=option.id
			this.fileUrl = webUrl.fileURL;
			this.getUserInfo();
			this.getCheckInfo();
		},
		methods: {
			//获取用户信息
			getUserInfo: function() {
				Request.get(Request.API.sysUser+"/"+ this.userId).then(res => {
					this.userInfo=res.data.data;
				})
			},
			//获取审批信息
			getCheckInfo: function() {
				Request.get(Request.API.checkMsg+"/"+ this.checkId).then(res => {
					this.checkInfo=res.data.data;
				})
			},
			check(e){
				let that=this;
				let param="通过";
				if(e=="REFUSE"){
					 param="拒绝";
				}
				uni.showModal({
					title: '提示',
					content: '您确认'+param+'此申请吗？',
					success: function (res) {
						if (res.confirm) {
							that.checkConmit(e);
						} else if (res.cancel) {
							
						}
					}
				});
			},
			//审批操作
			checkConmit(e){
				let that=this;
				let param={
					'id':that.checkId,
					'bizId':that.userId,
					'status':e,
					'type':'REGISTER'
				}
				Request.post(Request.API.checkMsgCheck, param).then(res => {
					uni.showLoading({
						title: '操作成功！'
					});
					that.getUserInfo();
					that.getCheckInfo();
				})
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
