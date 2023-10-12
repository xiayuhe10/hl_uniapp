<template>
	<view :class="classes" @click="redPacketClick">
		<view class="amount-wrap">
			<image class="icon" src="/static/img/chat/pay.png"></image>
			<view class="info">
				<text class="amount">￥{{ data.amount }}</text>
				<template v-if="data.right">
					<text class="desc">转账给{{ data.content }}</text>
				</template>
				<template v-else>
					<text class="desc" v-if="data.status === 'receive'">点击确认收钱</text>
					<text class="desc" v-else-if="data.status === 'error'">领取失败</text>
					<text class="desc" v-else-if="data.status === 'success'">已被领取</text>
					<text class="desc" v-else-if="data.status === 'refund'">已退还</text>
				</template>
			</view>
		</view>
		<view class="status">
			<text class="status-text">转账</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			data: {
				type: Object,
				default: () => {}
			},
			disabled: Boolean
		},
		computed: {
			classes() {
				return ['red-packet-wrap', { 'red-packet-disabled-wrap': this.data.disabled, 'chat-red-packet-right-wrap': this.data.right }]
			}
		},
		methods: {
			redPacketClick() {
				if(!this.data.disabled) {
					this.$emit('redPacketClick')
				}
			}
		}
	}
</script>

<style lang="scss">
	.red-packet-wrap {
		width: 370rpx;
		height: 148rpx;
		.amount-wrap {
			background-color: #F9A342;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			flex: 1;
			.icon {
				margin-left: 10px;
				width: 24px;
				height: 24px;
			}
			.info {
				justify-content: center;
				.amount {
					font-size: 28rpx;
					color: white;
					text-align: left;
					padding: 0 24rpx;
				}
				.desc {
					color: rgba(255, 255, 255, 100);
					font-size: 24rpx;
					text-align: left;
					padding: 0 24rpx;
				}
			}
		}
		.status {
			height: 20px;
			background-color: white;
			border-bottom-left-radius: 10rpx;
			border-bottom-right-radius: 10rpx;
			.status-text {
				color: rgba(219, 219, 219, 100);
				font-size: 22rpx;
				line-height: 44rpx;
				text-align: left;
				padding: 0 24rpx;
			}
		}
		&.red-packet-disabled-wrap {
			.amount-wrap {
				background-color: #FDE4C8;;
			}
		}
		&.chat-red-packet-right-wrap {
			direction: ltr;
		}
	}
</style>
