<template>

	<view class='margin-xl bg-white padding-xl radius shadow-lg'>
		<view v-if="form.noticeType=='3'" class='text-center margin-bottom text-lg  text-grey'>亲爱的老师</view>
		<view v-if="form.noticeType=='3'" class='text-content'>
			<view class="padding">欢迎您加入爱校信~</view>
			<view class="text-center">
				<view>春满江山绿满园</view>
				<view class='margin-top-sm'>桃李争春露笑颜</view>
				<view class='margin-top-sm'>东西南北春常在</view>
				<view class='margin-top-sm'>唯有师恩留心间</view>
			</view>
			<view class='margin-top-sm padding'>愿爱校信能让您收获满满，课堂上轻松教学,生活更加幸福美好~</view>
		</view>

		<view v-if="form.noticeType=='4'" class='text-center margin-bottom text-lg  text-grey'>尊敬的家长</view>
		<view v-if="form.noticeType=='4'" class='text-content'>
			<view class="padding">欢迎您加入爱校信~</view>
			<view class="text-center">
				<view>加入孩子所在的班级</view>
				<view class='margin-top-sm'>关注孩子日常表现</view>
				<view class='margin-top-sm'>与孩子共同成长</view>
			</view>
			<view class='margin-top-sm padding text-center'>
				<button @tap="joinAxx" class="cu-btn bg-blue">点击加入</button>
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
			uni.setStorageSync('welCount', true);
			this.updateMessageStatusByTypeAndBizId(option.id)
			this.getNoticeInfo(option.id)
		},
		methods: {
			getNoticeInfo(id) {
				Request.get(Request.API.noticeInfo, {
					noticeId: id
				}).then(res => {
					if (res.data.code == 200) {
						this.form = res.data.data
					}
				})
			},
			//将消息设置为已读
			updateMessageStatusByTypeAndBizId(id) {
				Request.put(Request.API.updateMessageStatusByTypeAndBizId, {
					bizId: id,
					type: 'WELCOME',
				}).then(res => {})
			},
			joinAxx(){
				uni.navigateTo({
					url:'/pages/parent/myChild/addMyChild/addMyChild'
				})
			}
		}
	}
</script>

<style>

</style>
