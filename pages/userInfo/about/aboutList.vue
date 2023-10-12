<template>
	<view>
		<view class="cu-list menu sm-border">
			<view class="cu-item arrow" @tap="toAbout()">
				<button class="cu-btn content" open-type="contact">
					<text class="cuIcon-evaluate_fill text-olive"></text>
					<text class="text-grey">关于HL系统</text>
				</button>
			</view>
			<view class="cu-item arrow" @tap="toService()">
				<button class="cu-btn content" open-type="contact">
					<text class="cuIcon-form text-olive"></text>
					<text class="text-grey">服务协议</text>
				</button>
			</view>
			<view class="cu-item arrow" @tap="toConceal()">
				<button class="cu-btn content" open-type="contact">
					<text class="cuIcon-form text-olive"></text>
					<text class="text-grey">隐私政策</text>
				</button>
			</view>
			<view class="cu-item arrow" @tap="toThirdSDK()">
				<button class="cu-btn content" open-type="contact">
					<text class="cuIcon-form text-olive"></text>
					<text class="text-grey">第三方SDK目录</text>
				</button>
			</view>
			<view class="cu-item arrow" @tap="toCancel()">
				<button class="cu-btn content" open-type="contact">
					<text class="cuIcon-btn text-olive"></text>
					<text class="text-grey">账号注销</text>
				</button>
			</view>
		</view>
		<view class="formButModel text-gray">
			Copyright@2021-2023 广西中工云数据科技有限公司 版权所有
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			toAbout() {
				uni.navigateTo({
					url: "./about"
				})
			},
			//前往账号注销页面
			toCancel() {
				console.log("注销")
				uni.navigateTo({
					url: "../cancelAccount/cancelAccount"
				})
			},
			toService() {
				uni.navigateTo({
					url: "./serviceAgreement"
				})
			},
			toConceal() {
				uni.navigateTo({
					url: "./concealOutline"
				})
			},
			toChildren() {
				uni.navigateTo({
					url: "./childrenAgreement"
				})
			},
			toThirdSDK() {
				uni.navigateTo({
					url: "./thirdSDK"
				})
			}
		}
	}
</script>

<style>
	// 表单按钮组
	.formButModel {
		padding-top: 40rpx;
		width: 75%;
		margin: 40rpx auto;
		justify-content: center;
	}
</style>
