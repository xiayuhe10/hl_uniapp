<template>
	<view class="avatarwrap">
<view class="cu-form-group">
			<view class="title">工程项目</view>
			<input placeholder="" v-model="order.siteName" disabled="true"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">施工单位</view>
			<input placeholder="" v-model="order.companyName" disabled="true"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">施工地址</view>
			<input placeholder="" v-model="order.address" placeholder="请输入施工地址"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">订单状态</view>
			<input :placeholder-class="'text-'+OrderStatus[order.status].col"  :placeholder="OrderStatus[order.status].NAME" disabled="true"></input>
		</view>
		
		<view class="cu-form-group">
			<view class="title">施工部位</view>
			<view class="content text-left">
				<text v-for="(item,index) in order.placeList" :key="index">{{item.placeName}};</text>
			</view>
		</view>
		<view class="cu-form-group margin-top-sm">
			<view class="title">强度等级</view>
		
				<text><text  >{{order.concreteStrength}}</text></text>
		</view>
		<view class="cu-form-group">
			<view class="title">浇筑方式</view>
		
			<text><text  >{{order.pouringMode}}</text></text>
		</view>
		<view class="cu-form-group">
			<view class="title">浇筑时间</view>
			<text><text  class="text-orange">{{order.pouringTime}}</text></text>
		</view>
		<view class="cu-form-group">
			<view class="title">混凝土方量</view>
			<text><text  class=" text-bold text-red">{{order.concrete}}</text> <text  class=" text-grey">m³</text></text>
		</view>
		<view class="cu-form-group">
			<view class="title">砂浆方量</view>
			<text><text  class=" text-bold text-red">{{order.mortar}}</text> <text  class=" text-grey">m³</text></text>
		</view>
		<view class="cu-form-group">
			<view class="title">计划方量</view>
			<text><text  class=" text-bold text-red">{{order.mortar+order.concrete}}</text> <text  class=" text-grey">m³</text></text>
		</view>
		<view class="cu-form-group ">
			<view class="title">备注</view>
			<textarea placeholder="" v-if="order.remark"></textarea>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">联系人</view>
			<input disabled="true" placeholder="请输入联系人" v-model="order.linkMan" />
		</view>
		<view class="cu-form-group">
			<view class="title">联系电话</view>
			<input disabled="true" placeholder="请输入联系电话" v-model="order.linkPhone" />
		</view>
		<view class="cu-form-group">
			<view class="title">创建时间</view>
			<input disabled="true" placeholder="请输入联系电话" v-model="order.createTime" />
		</view>
		<view  style="padding-bottom: 30px;" class="margin-top-sm">
		<view class="cu-bar bg-white solid-bottom ">
		  <view class="action">
		    <text class="cuIcon-title text-blue"></text>审核信息
		  </view>
		  <view class="action">
		    <text :class="'text-'+checkStatus[checkInfo.status].col">{{checkStatus[checkInfo.status].NAME}}</text>
		  </view>
		</view>
		<view>
		<view class="cu-form-group ">
			<textarea maxlength="-1" v-model="checkInfo.opinion" :disabled="checkInfo.status!='REVIEW'"  bindinput="textareaAInput" placeholder="请输入审批意见"></textarea>
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
				orderId:null,
				checkId:null,
				checkInfo:{},
				order:{},
				OrderStatus:status.orderStatus,
				checkStatus:status.checkStatus
			}
		},
		onLoad(option) {
			this.orderId=option.bizId;
			this.checkId=option.id
			this.fileUrl = webUrl.fileURL;
			this.getOrderInfo();
			this.getCheckInfo();
		},
		methods: {
			//获取订单信息
			getOrderInfo: function() {
				Request.get(Request.API.workOrder+"/"+ this.orderId).then(res => {
					this.order=res.data.data;
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
					'bizId':that.orderId,
					'opinion':that.checkInfo.opinion,
					'status':e,
					'type':'ORDER'
				}
				Request.post(Request.API.checkMsgCheck, param).then(res => {
					uni.showLoading({
						title: '操作成功！'
					});
					that.getOrderInfo();
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
