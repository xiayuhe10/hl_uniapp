<template>
	<view>
		<view class="cu-list menu-avatar" v-if="dateInfo" @tap="topClick('all')">
			<view class="cu-item">
				<view class="cu-avatar radius bg-white" v-show="dateInfo.avatar!=''" @tap.stop="topClick('avatar')"
					style="width:80rpx;height:80rpx;" :style="{backgroundImage:`url(${fileUrl+dateInfo.avatar})`}">
				</view>
				<view class="cu-avatar radius bg-white" v-show="dateInfo.avatar==''" @tap.stop="topClick('avatar')"
					style="width:80rpx;height:80rpx;" :style="{backgroundImage:`url(../../../static/message/teacher.png)`}" >
				</view>
				<view class="content" style="margin-left:-30rpx;">
					<view class="text-sm text-purple text-bold" style="font-size: 10px;">
						<text>{{dateInfo.nickName}}</text>
					</view>
					<view class="text-gray text-sm flex justify-between">
						<text>{{changeTime(dateInfo.createTime)}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import webUrl from '@/common/config.js';
	import Request from '@/common/request.js';
	import dateTime from '@/common/dateTime.js';
	export default {
		name: 'top',
		props: ['dateList'],
		data() {
			return {
				dateInfo: {},
				fileUrl: webUrl.fileURL
			}
		},
		watch: {
			dateList: {
				handler: function(val) {
					// console.log(val, "监听dateList")
					this.dateInfo = val
				},
				immediate: true, //--首次加载时执行监听
				deep: true //--值改变时执行监听
			}
		},
		methods: {
			topClick(type) {
				let push = {
					type: type,
					value: this.dateInfo
				}
				this.$emit('dataTopClick',push);
			},
			changeTime(date) { // 日期格式化
				return dateTime.dateTime(date);
			},
		}
	}
</script>

<style>

</style>
