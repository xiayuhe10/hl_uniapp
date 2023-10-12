<template>
	<view class="timeline">
		<slot :size="size"></slot>
	</view>
</template>
<script>
	export default {
		name: "rxl-timeline",
		data() {
			return {}
		},
		props: {
			size: {
				type: Number,
				default: function() {
					return 20
				}
			}
		}
	}
</script>
<style lang="scss">
	.timeline {
		width: 100%;
		padding-inline-start: 40rpx;
		padding-inline-end: 20rpx;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		position:relative;
		box-sizing:border-box;
	}
</style>
