<template>
	<view>
		<view class="cu-bar bg-white solid-bottom ">
			<view class="action">
				<text class="cuIcon-title text-orange "></text>订单流程配置
			</view>
		</view>

		<view class="cu-list menu">
			<view class="cu-item">
				<view class="content padding-tb-sm">
					<view class="title">是否开启审核</view>
					<view class="text-gray text-sm">
						<text class="cuIcon-infofill margin-right-xs"></text>点击添加流程，长按删除该流程节点
					</view>
				</view>
				<view class="action">
					<switch class='blue' @change="switch2Change" :class="mixingPlant.isCheck=='1'?'checked':''"
						:checked="mixingPlant.isCheck=='1'?true:false">
					</switch>
				</view>
			</view>
		</view>
		<!--流程start-->
		<view class="bg-white" style="width: 100%;height: 80px;">
			<view class="bg-white padding">
				<view class="cu-steps">
					<view class="cu-item" v-for="(item,index) in checkUserList" :key="index">
						<view style="width:40px;height: 40px;margin-left:20px;" @longtap="deleteCheck(item)">
							<!-- <image src="../../../static/logo.png" style="width:40px;height: 40px;border-radius: 100px;"></image> -->
							<view v-if="item.avatar && item.avatar != ''" class="cu-avatar round bg-white"
								:style="`background-image:url(` + fileUrl +item.avatar +`);width: 80rpx;height:80rpx;`">
							</view>
							<view v-else class="cu-avatar round lg avatarbg avatarfontsize bg-blue"
								style="width: 80rpx;height:80rpx;font-size: 20rpx;">
								{{item.userName}}
							</view>
							<text>
								{{item.userName}}
							</text>
						</view>
		
					</view>
					<view class="cu-item">
						<view style="width:40px;height: 40px;"
							:style="'margin-left:'+(100/(checkUserList.length>0?checkUserList.length+1:0))+'%'" @click="addView()">
							<view class="addBtn">+</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!--流程end-->
		<!--弹出选择人员start-->
		<view class="cu-modal" :class="modalName=='checkUser'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">请选择用户</view>
					<view class="action" @click="hideModal()">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="">
					<view v-for="(item,index) in userList" :key="index">
						<view class="cu-form-group">
							<view class="title">{{item.userName}}</view>
							<checkbox :disabled="item.check" @click="selectUser(item)"></checkbox>
						</view>
					</view>
				</view>
			</view>

		</view>
		<!--弹出选择人员end-->
	</view>
</template>

<script>
	const app = getApp()
	import dateTime from '@/common/dateTime.js';
	import Request from '@/common/request.js';
	import webUrl from '@/common/config.js';
	export default {
		data() {
			return {
				checkSwitch: false,
				mixingPlant: {},
				userList: [],
				checkUserList: [],
				checkUser: {},
				modalName: null,
				basics: 0,
				num: 0,
				scroll: 0,
				fileUrl:''
			}
		},
		onLoad() {
			this.fileUrl = webUrl.BaseURL;
			this.planInfo = uni.getStorageSync("plantInfo");
			this.getMixingPlant();
			this.getCheckUser();
		},
		methods: {
			//获取项目信息
			getMixingPlant: function() {
				Request.get(Request.API.mixingPlant + "/" + this.planInfo.id).then(res => {
					this.mixingPlant = res.data.data;
				})
			},
			//获取审核人员列表
			getCheckUser: function() {
				Request.get(Request.API.checkUser + "/list", {
					"plantId": this.planInfo.id,
					"type": 0
				}).then(res => {
					this.checkUserList = res.data.rows;
				})
			},
			//删除人员
			deleteCheck(item) {
				let that = this;
				let param = item;
				uni.showModal({
					title: '提示',
					content: '确定删除当前人员吗？',
					success: function(res) {
						if (res.confirm) {
							Request.delete(Request.API.checkUser + "/" + param.id).then(res => {
								that.getCheckUser();
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			addCheckUser: function() {
				let that = this;
				Request.post(Request.API.checkUser, this.checkUser).then(res => {
					uni.showToast({
						title: '操作成功',
						icon: 'loading',
						duration: 2000
					});
					that.getCheckUser();
					this.modalName = null;
				})

			},
			//获取当前公司下的用户列表
			getUserList: function() {
				Request.get(Request.API.sysUser + "/list").then(res => {

					if (this.checkUserList.length > 0) {
						for (let i = 0; i < this.checkUserList.length; i++) {
							for (let j = 0; j < res.data.rows.length; j++) {
								if (res.data.rows[j].userId == this.checkUserList[i].userId) {
									res.data.rows[j].check = "disabled"
								}
							}
						}
					}
					this.userList = res.data.rows;
				})
			},
			//选择用户
			selectUser(item) {
				let isSelect = false;
				if (this.checkUserList.length > 0) {
					for (let i = 0; i < this.checkUserList.length; i++) {
						if (this.checkUserList[i].userId == item.userId) {
							isSelect = true;
							break;
						}
					}
				}
				if (isSelect) {
					return;
				}
				let param = {};
				param.userId = item.userId;
				param.userName = item.userName;
				param.type = "0";
				param.plantId = this.planInfo.id;
				this.checkUser = param;
				this.addCheckUser();

			},
			addView() {
				console.log(this.mixingPlant.isCheck)
				if (this.mixingPlant.isCheck == '0') {
					uni.showToast({
						title: '请先开启审核',
						icon: 'loading',
						duration: 2000
					});
					return;
				}
				this.modalName = "checkUser";
				this.getUserList();
			},
			hideModal() {
				this.modalName = null;
			},
			//是否开启审核流程
			updateMixingPlant() {
				let that = this;
				Request.put(Request.API.mixingPlant, this.mixingPlant).then(res => {
					uni.showToast({
						title: '操作成功',
						duration: 2000
					});
					setTimeout(function() {
						that.getMixingPlant();
					}, 2000);

				})
			},
			switch2Change(e) {
				if (e.detail.value) {
					this.mixingPlant.isCheck = '1';
				} else {
					this.mixingPlant.isCheck = '0';
				}
				this.updateMixingPlant();
			},
		}
	}
</script>

<style>
	.addBtn {
		width: 40px;
		height: 40px;
		border-radius: 100px;
		line-height: 40px;
		font-size: 30px;
		border: 1px dashed #8799A3;
		background: rgba(135, 153, 163, 0.6);
		color: #fff;
	}
</style>