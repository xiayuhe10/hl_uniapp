<template>
	<view class="feedback-body">
		<text class="text-black">问题反馈和意见建议
			<text style="color: red;">*</text></text>
		<textarea placeholder="请描述您遇到的问题或对本产品的建议..." v-model="form.content" class="feedback-textare" maxlength="-1"/>

		<text class="text-black">联系方式</text>
		<input class="feedback-input" v-model="form.contact" placeholder="请输入您的QQ/邮箱" />
		<view class="btn">
			<button @tap="onSubmit" :disabled="!form.content" type="primary">
				提交
			</button>
		</view>

	</view>
</template>

<script>
	import Request from '@/common/request.js';
	import weburl from '@/common/config.js';
	export default {
		data() {
			return {
				form: {
					content: '', //反馈内容
					contact: '', //联系方式
					typeName: "帮助与反馈"
				},
				btnLoading: false
			};
		},
		onLoad() {

		},
		methods: {
			onSubmit(){
				Request.post(Request.API.addComplaint, this.form).then(res => {
					console.log("res",res)
					if(res.data.code==200){
						uni.showToast({
							title: '提交成功！',
							duration: 1500
						});
						this.form.contact=""
						this.form.content=""
						setTimeout(function() {
							uni.navigateBack({
								delta: 1
							});
						}, 1000)
					}
				})
			}
		}
	};
</script>

<style>
	.text-black {
		color: #303133;
		font-size: 32rpx;
	}

	.text-grey {
		color: #BCBCBC;
		font-size: 24rpx;
		margin-left: 15rpx;
	}

	.feedback-quick {
		padding-right: 10rpx;
		color: #606266;
		font-size: 32rpx;
	}

	.feedback-body {
		padding: 30rpx;
	}

	.feedback-textare {
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		height: 266rpx;
		color: #303133;
		font-size: 28rpx;
		line-height: 2em;
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx 30rpx;
		border-radius: 20rpx;
		background-color: #F5F6F8;
	}

	.feedback-input {
		font-size: 28rpx;
		color: #303133;
		background-color: #F5F6F8;
		border-radius: 20rpx;
		height: 100rpx;
		min-height: 100rpx;
		padding: 0 30rpx;
		margin-top: 30rpx;
		margin-bottom: 60rpx;
	}



	.btn-submit {
		border-radius: 20rpx;
		color: #FFFFFF;
		margin-top: 100rpx;
		background-color: #007AFF;
		margin-bottom: 70rpx;
	}

	.image-title {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		color: #606266;

	}

	.filepicker {
		margin-top: 30rpx;
		margin-bottom: 30rpx;
	}

	.btn {
		position: fixed;
		bottom: 0;
		left: 0 ;
		right: 0;
		margin: 30rpx 30rpx 60rpx 30rpx;
	}
</style>
