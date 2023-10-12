<template>
	<view>
		<view class="bg-white">
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="cuIcon-titles text-green"></text>
					<text class="text-xl text-bold">信息清空</text>
				</view>

			</view>
			<view class="padding">注销账号后，所有相关数据将清空，且无法恢复。</view>
		</view>
		<view class="bg-white">
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="cuIcon-title text-orange"></text>
					<text class="text-xl text-bold">风险确认</text>
					<text class="cuIcon-title text-orange" style="margin-left: 5rpx;"></text>
				</view>
			</view>
			<view class="padding">注销账号有以下风险</view>
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="cuIcon-titles text-orange"></text>
					<text class="text-xl text-bold">永久注销，无法登录</text>
				</view>

			</view>
			<view class="padding">账号一旦注销，无法再次登录使用，且无法恢复</view>
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="cuIcon-titles text-orange"></text>
					<text class="text-xl text-bold">所有数据将被删除，无法找回</text>
				</view>

			</view>
			<view class="padding">账号一旦注销，在爱校信内的数据将永久删除，无法找回</view>

			<view class="padding">包括但不限于以下数据</view>

			<view class=" grid col-3 padding-lr">
				<view v-for="(item,index) in list" :key="index">
					<view class="flex  flex-direction align-center text-center justify-between ">
						<view>
							<view class="cu-avatar round  lg  margin-top" :class="'bg-'+item.color">
								<view class="text-white" :class="'cuIcon-'+ item.url"></view>
							</view>
						</view>
						<view class="">{{item.name}}</view>
					</view>
				</view>
			</view>

			<view style="width: 90%;left:5%;top:5%;font-size: 12px;margin: 20rpx;">
				<view class="flex align-center" style="float: left;height: 20px;">
					<checkbox-group style="transform: scale(0.6);" class="block" @change="CheckChange">
						<checkbox class='round blue' :class="checked?'checked':''" :checked="checked?true:false"
							value="">
						</checkbox>
					</checkbox-group>
					<view>
						<view class="text-gray" style="float: left; ">我已阅读并同意</view>

					</view>

				</view>
				<view class="flex align-center" style="height: 20px;">
					<navigator url="" hover-class="navigator-hover" class="navigatorBg">
						《风险确认》</navigator>
						<view>并注销账号</view>
				</view>
				
			</view>

			<view class="padding">
				<button v-if="checked" @tap="applyCencel" class="cu-btn block bg-blue margin-tb-sm lg">申请注销</button>
				<button v-if="!checked" class="cu-btn block bg-gray text-gray margin-tb-sm lg">申请注销</button>
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
				list: [{
					url: 'font',
					color: "yellow",
					name: '班级数据'
				}, {
					url: 'evaluate',
					color: "green",
					name: '点评数据'
				}, {
					url: 'edit',
					color: "orange",
					name: '作业数据'
				}, {
					url: 'group_fill',
					color: "blue",
					name: '学生数据'
				}, {
					url: 'messagefill',
					color: "olive",
					name: '家校沟通数据'
				}, {
					url: 'medal',
					color: "red",
					name: '荣誉数据'
				}],
				checked: false,
				userInfo: {}
			}
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo')
		},
		methods: {
			CheckChange() {
				this.checked = !this.checked
			},
			applyCencel() {
				let that=this
				Request.put(Request.API.cancelUser + '/' + this.userInfo.userId).then(res => {
					if (res.data.code == 200) {
						uni.showToast({
							duration:3000,
							title:'注销成功'
						})
						setTimeout(function() {
							that.loginOut();
						}, 2000)
						
					}
				})
			},
			//注销相关信息
			loginOut() {
				Request.post(Request.API.logout).then(res => {
					this.$store.commit('logout');
					uni.reLaunch({
						url: "/pages/login/login"
					})
				})
			},
		}
	}
</script>

<style>

</style>
