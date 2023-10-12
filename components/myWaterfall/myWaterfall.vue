<template>
	<view class="waterfall-item" >
		<view @tap="onTap">
			<image :src="params.image" mode="widthFix" @load="emitHeight" @error="emitHeight"></image>
		</view>
		<view class="item bg-white padding ">
			<view class="title  text-cut text-center">{{params.title}}</view>
			<view class="title  text-cut text-xs text-center">截止：{{params.startTime}}</view>
			<view class="grid col-2 text-xs margin-top-xs">
				<view class="margin-top-xs">
					<text class='cu-tag radius light'
						:class="statusFlagCol[params.status]">{{statusFlag[params.status]}}</text>
				</view>

				<view @tap="publish(params.id)" v-if="params.status==0" class=" text-xs response margin-top-xs">
					<view class=' radius bg-white solid flex justify-between align-center padding-tb-xs padding-lr-sm'>
						<view><text class="cuIcon-upload margin-right-xs"></text></view>
						<view>发布</view>
					</view>
				</view>

				<view v-if="params.status==0" @click="toAddVoters(item)"
					class='margin-top-xs radius bg-white solid flex justify-between align-center padding-tb-xs padding-lr-sm'>
					<view><text class="cuIcon-edit margin-right-xs"></text></view>
					<view>修改</view>
				</view>
				<view
					class=' radius bg-white solid flex justify-between align-center padding-tb-xs padding-lr-sm margin-top-xs'
					@tap="delVoteCast(params.id)">
					<view><text class="cuIcon-delete margin-right-xs"></text></view>
					<view>删除</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Request from '@/common/request.js';
	import webUrl from '@/common/config.js';
	export default {
		name: "myWaterfall",
		props: {
			params: {
				type: Object,
				default () {
					return {}
				}
			},
			tag: {
				type: String | Number,
				default: ''
			},
			index: {
				type: Number,
				default: -1
			}
		},
		data() {
			return {
				statusFlagCol: ['bg-red', 'bg-blue', 'bg-green'],
				statusFlag: ['未发布', '已发布', '已结束'],
			};
		},
		onLoad() {
			console.info("params", this.params)
		},
		methods: {
			// 发出组件高度信息，在此处可以区分正确和错误的加载，给予错误的提示图片
			emitHeight(e) {
				const query = uni.createSelectorQuery().in(this);
				query.select('.waterfall-item').boundingClientRect(data => {
					let height = Math.floor(data.height);
					this.$emit("height", height, this.$props.tag);
				}).exec();
			},
			onTap() {
				this.$emit("click", this.$props.index, this.$props.tag,this.$props.params);
			},
			publish(id) {
				console.info(id)
				this.$emit("onPublish", id);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.waterfall-item {
		padding: 10rpx;
		background-color: #fff;
		border-radius: 4px;
		color: #666;
		margin-bottom: 20rpx;

		image {
			display: block;
			width: 100%;
			// 默认设置一个图片的大约值
		}
	}
</style>
