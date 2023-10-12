<template>
	<view :class="classes" @click="payAudio">
		<image class="icon" src="/static/img/chat/audio.png"></image>
		<text class="duration">{{ data.duration }}</text>
	</view>
</template>

<script>
	const innerAudioContext = uni.createInnerAudioContext(); //音频
	
	export default {
		props: {
			data: {
				type: Object,
				default: () => {}
			},
			right: Boolean
		},
		computed: {
			classes() {
				return ['chat-sound-wrap', { 'chat-sound-right-wrap': this.data.right }]
			}
		},
		methods: {
			payAudio() {
				innerAudioContext.src = this.data.content
				
				this.$nextTick(function() {
					innerAudioContext.play();
				});
			},
		}
	}
</script>

<style lang="scss">
	.chat-sound-wrap {
		height: 40px;
		background-color: white;
		width: 80px;
		border-radius: 8px;
		justify-content: flex-start;
		flex-direction: row;
		align-items: center;
		.duration {
			font-size: 14px;
			margin-left: 6px;
		}
		.icon {
			width: 18px;
			height: 18px;
			margin-left: 10px;
		}
		&.chat-sound-right-wrap {
			background-color: #1E89FF;
			.icon {
				width: 18px;
				height: 18px;
				margin-right: 10px;
				transform: rotate(-110edg);
			}
		}
	}
</style>
