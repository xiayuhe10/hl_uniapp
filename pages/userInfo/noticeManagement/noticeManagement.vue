<template>
	<view class="solid-top">
		<view class="cu-form-group ">
			<view class="title">消毒记录</view>
			<switch  class='blue'  @change="disinfectChange" :class="disinfectFlag?'checked':''" :checked="disinfectFlag?true:false"></switch>
		</view>
		<view class="cu-form-group ">
			<view class="title">通风透气</view>
			<switch class='blue'  @change="ventilationRecordChange" :class="ventilationRecordFlag?'checked':''" :checked="ventilationRecordFlag?true:false"></switch>
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
				ventilationInfo: {},
				disinfectInfo: {},
				disinfectFlag: true,
				ventilationRecordFlag: true,
			}
		},
		onLoad(option) {
			
		},
		onShow() {
			this.getVentilationInfo()
			this.getDisinfectInfo()
		},
		methods: {
			getVentilationInfo() {  //GET 通风透气
				Request.post(Request.API.getMessageInfoConfigByTypeAndUserId,{
					type: 'VENTILATION'
				}).then(res => {
					if (res.data.code == 200) {
						this.ventilationInfo = res.data
						this.ventilationRecordFlag = !!res.data.data?this.ventilationInfo.data.status == 'OK'?true:false:true
						console.log("通风透气", !!res.data.data)
					} else{
						uni.showToast({title: '加载失败',icon: 'none',duration: 2000})
					}
				})
			},
			getDisinfectInfo() {  //GET 消毒记录
				Request.post(Request.API.getMessageInfoConfigByTypeAndUserId,{
					type: 'DISINFECT_LOG'
				}).then(res => {
					if (res.data.code == 200) {
						this.disinfectInfo = res.data
						this.disinfectFlag = !!res.data.data?this.disinfectInfo.data.status == 'OK'?true:false:true
						console.log("消毒记录", !!res.data.data)
					} else{
						uni.showToast({title: '加载失败',icon: 'none',duration: 2000})
					}
				})
			},
			disinfectChange(e) {  //GET 消毒记录
				this.disinfectFlag = e.detail.value
				let flag = !!this.disinfectInfo.data?this.disinfectInfo.data.status == 'OK'?'DISABLE':'OK':'DISABLE'
				this.messageChange('DISINFECT_LOG',flag)
			},
			ventilationRecordChange(e) {  //GET 通风透气
				this.ventilationRecordFlag = e.detail.value
				let flag = !!this.ventilationInfo.data?this.ventilationInfo.data.status == 'OK'?'DISABLE':'OK':'DISABLE'
				console.log("通风透气传值flag",!!this.ventilationInfo.data)
				this.messageChange('VENTILATION',flag)
			},
			messageChange(type,flag){
				let that = this
				uni.showLoading({
					title: '修改中...'
				});
				Request.put(Request.API.updMessageInfoConfig,{
					type: type,
					status: flag
				}).then(res => {
					uni.hideLoading()
					if (res.data.code == 200) {
						uni.showToast({
							title: '操作成功',
							icon: "none",
							duration: 2000
						});
						setTimeout(() => {
							if (type=='DISINFECT_LOG') {
								that.getDisinfectInfo()
							} else{
								that.getVentilationInfo()
							}
							this.$forceUpdate() // dom会更新
						}, 100);
					} else {
						uni.showToast({
							title: '操作失败',
							icon: "none",
							duration: 2000
						});
					}
				})
			}
		}
	}
</script>

<style>
</style>
