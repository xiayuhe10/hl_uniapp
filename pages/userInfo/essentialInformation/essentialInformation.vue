<template>
	<view>
		<!-- <view class="usergroup ">
			<view class="title">账号名字</view>
			<view class="text-gray" >{{userInfo.userName}}</view>
		</view> -->
		<view class="usergroup " @click="changeInfo('nickName',showIndex)">
			<view class="title">我的昵称</view>
			<view class="text-gray">
				{{userInfo.nickName}}
				<text class="cuIcon-right margin-left-xs"></text>
			</view>
		</view>
		<view class="usergroup " @click="changeInfo('sex',showIndex)">
			<view class="title">我的性别</view>
			<view class="text-gray">
				<text v-if="userInfo.sex == 0">男</text>
				<text v-if="userInfo.sex == 1">女</text>
				<text v-if="userInfo.sex >1">未知</text>
				<text class="cuIcon-right margin-left-xs"></text>
			</view>
		</view>
		<!-- <view class="usergroup" @click="changeInfo('phonenumber')">
			<view class="title">手机号码</view>
			<view class="text-gray">{{userInfo.phonenumber}}<text v-if="showIndex == false"
					class="cuIcon-right margin-left-xs"></text></view>
		</view> -->
		<view class="usergroup" @click="changeInfo('email',showIndex)">
			<view class="title">我的邮箱</view>
			<view class="text-gray" v-if="userInfo.email != ''">
				{{userInfo.email}} <text class="cuIcon-right margin-left-xs"></text>
			</view>
			<view class="text-gray" v-else>暂无邮箱<text class="cuIcon-right margin-left-xs"></text></view>
		</view>
		<!-- <view class="formButModel">
			<button class="formBut" @click="updateInfo()" :class="showIndex==true?'bg-blue':'bg-blue'">
				<text v-if="showIndex == true">
					修改信息
				</text>
				<text v-if="showIndex == false">
					保存信息
				</text>
			</button>
		</view> -->
		<!-- 修改信息弹窗 -->
		<view class="cu-modal" :class="modalName=='DialogModal2'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{openTitle}}</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<!-- 昵称 -->
				<view class="padding-sm padding-lr-xl bg-white " v-if="openModal == 'nickName'">
					<view class="radius shadow-warp  text-left padding">
						<input v-model="nickNameValue" placeholder="请输入新昵称" name="input"></input>
					</view>
				</view>
				<!-- 邮箱 -->
				<view class="padding-sm padding-lr-xl bg-white " v-if="openModal == 'email'">
					<view class="radius shadow-warp  text-left padding">
						<input v-model="emailValue" placeholder="请输入新邮箱" name="input"></input>
					</view>
				</view>
				<view class="flex bg-white padding-bottom-sm padding-tb  ">
					<view class="flex-sub text-center" @tap="hideModal">
						取消
					</view>
					<view class="flex-sub text-center text-blue"
						v-if="nickNameValue!= '' && openModal == 'nickName' " @tap="nickNameChange">
						确定
					</view>
					<view class="flex-sub text-center text-blue" v-if="emailValue!= '' && openModal == 'email' "
						@tap="emailChange">
						确定
					</view>
					<view class="flex-sub text-center text-gray"
						v-if="nickNameValue == '' && openModal == 'nickName'">
						确定
					</view>
					<view class="flex-sub text-center text-gray" v-if="emailValue == '' && openModal == 'email'">
						确定
					</view>
				</view>

			</view>
		</view>
		<view class="cu-modal" :class="modalName=='sex'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{openTitle}}</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<radio-group class="block" @change="RadioChange" v-if="openModal == 'sex'">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in radioList" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">{{item.sex}}</view>
								<radio class="round blue" :class="item.id ==sexValue?'checked':''"
									:checked="radio==item.id?true:false" :value="item.id"></radio>
							</label>
						</view>
					</view>
				</radio-group>
			</view>
		</view>
	</view>
</template>

<script>
	import Request from '@/common/request.js';
	import webUrl from '@/common/config.js';
	export default {
		data() {
			return {
				fileUrl: '',
				userInfo: {},
				deptName: '',
				showIndex: true,
				CustomBar: this.CustomBar,
				modalName: null,
				radio: '',
				newNickName: '',
				openModal: '',
				openTitle: '',
				nickNameValue: '',
				emailValue: '',
				sexValue: '',
				sysCheckEnable: 'false',
				radioList: [{
						'sex': '男',
						'id': '0'
					},
					{
						'sex': '女',
						'id': '1'
					},
					{
						'sex': '未知',
						'id': '2'
					}
				]
			}
		},
		onLoad() {
			this.fileUrl = webUrl.fileURL
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo')
			console.info(this.userInfo)
		},
		methods: {
			changeInfo(info, show) {
				this.nickNameValue = ''
				this.emailValue = ''
				if (info == 'sex') {
					this.modalName = 'sex'
				} else {
					this.modalName = 'DialogModal2'
				}
				if (info == 'nickName') {
					console.log("nickName", this.userInfo)
					this.openTitle = '修改名字'
					this.openModal = 'nickName'
				} else if (info == 'sex') {
					console.log("sex", this.userInfo)
					this.openTitle = '修改性别'
					this.openModal = 'sex'
				} else if (info == 'phonenumber') {
					this.openTitle = '修改电话'
					this.openModal = 'phonenumber'
					console.log("phonenumber", this.userInfo)
				} else if (info == 'email') {
					this.openTitle = '修改邮箱'
					this.openModal = 'email'
					console.log("email", this.userInfo)
				}
			},
			nickNameChange(){
				let push = { nickName: this.nickNameValue }
				this.modalName = null
				this.updateInfo(push)
			},
			sexChange(){
				let push = { sex: this.sexValue }
				this.modalName = null
				this.updateInfo(push)
			},
			emailChange(){
				let push = { email: this.emailValue }
				this.modalName = null
				this.updateInfo(push)
			},
			configKey(){  //GET 根据参数键名查询参数值 configKey
				Request.get(Request.API.configKey+'sys.check.enable').then(res => {
					if (res.data.code==200) {
						this.sysCheckEnable = res.data.msg
						console.info(this.sysCheckEnable)
					}
				})
			},
			updateInfo(push) {
				let that = this
				Request.put(Request.API.updateUserProfile, push).then(res => {
					console.info(res)
					if (this.sysCheckEnable=='true') {
						uni.showToast({ title: res.data.msg,icon:'none', duration: 1000 });
					} else{
						if (res.data.code==200) {
							uni.showToast({ title: res.data.msg,icon:'none', duration: 1000 });
							setTimeout(function() {
								that.getUserInfo();
							}, 1000)
						} else {
							uni.showToast({ title: res.data.msg, icon:'none',duration: 1000 });
						}
					}
				})
			},
			//更新用户缓存
			getUserInfo() {
				Request.get(Request.API.getUserInfo).then(res => {
					uni.setStorageSync('userInfo', res.data.user);
					this.userInfo = res.data.user;
				})
			},
			hideModal(e) {
				this.modalName = null
			},
			RadioChange(e) { // 出勤状态单选
				let that = this
				this.radio = e.detail.value
				// this.userInfo.sex = e.detail.value
				this.sexValue = e.detail.value
				this.modalName = null
				this.sexChange()
				console.info('radio', this.radio)
			},
		}
	}
</script>

<style>
	.usergroup {
		background-color: #ffffff;
		padding: 1upx 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 100upx;
	}

	.usergroup+.usergroup {
		border-top: 1upx solid #eee;
	}

	.usergroup .title {
		text-align: justify;
		padding-right: 30upx;
		font-size: 30upx;
		position: relative;
		height: 60upx;
		line-height: 60upx;
	}

	// 表单按钮组
	.formButModel {
		padding-top: 200rpx;
		width: 75%;
		margin: 20rpx auto;
		justify-content: center;


	}

	.formBut::after {
		border: none;
	}

	.formBut {
		border-radius: 90rpx;
		height: 80rpx;
		width: 550rpx;
		line-height: 80rpx;
		color: #FFFFFF;
		font-size: 32rpx;
		letter-spacing: 8rpx;
	}
</style>
