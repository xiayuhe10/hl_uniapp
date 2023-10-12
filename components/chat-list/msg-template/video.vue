<template>
	<view class="chat-video-wrap" @click="imageClick">
		<!-- <video :id="'video'+data" :src="data" :enable-play-gesture="true"
			:poster="data+'?x-oss-process=video/snapshot,t_0,f_jpg'"
			show-mute-btn="true" x-webkit-airplay="true" :data-name="'video'+data"
			webkit-playsinline="true" x5-video-player-type="h5" x5-video-orientation="portraint"
			preload="auto" controls
			style="width:100%;display: block;"></video> -->
		<!-- <image class="chat-video" mode="aspectFit" @click="imageClick" :src="data+'?x-oss-process=video/snapshot,t_0,f_jpg'"></image> -->
		<image v-if="data.content.imgUrl!=''&&data.content.imgUrl" class="chat-video" mode="widthFix" :disabled="false" :controls='false' :autoplay='false' :src="fileUrl+data.content.imgUrl"></image>
		<image v-else class="chat-video" mode="widthFix" :disabled="false" :controls='false' :autoplay='false' src="#"></image>
		<view v-if="data.content.imgUrl!=''&&data.content.imgUrl"  class="mask"></view>
		<view v-else class="masks"></view>
		<image class="video-play-icon" src="@/static/img/chat/play.png" mode="widthFix" @click="imageClick"></image> 
	</view>
</template>

<script>
	import webUrl from '@/common/config.js';
	export default {
		props: {
			data: {
				type: Object,
				default: () => {}
			},
			// data: {
			// 	type: String,
			// 	default: ''
			// },
		},
		data() {
			return {
				fileUrl: ''
			}
		},
		created() {
			this.fileUrl = webUrl.fileURL;
			// console.info("地址s",this.data.content.imgUrl)
			// console.info(this.fileUrl)
		},
		onShow() {
			uni.$off('chat-video-player')
			console.info("地址s",this.data.content)
		},
		onUnload() {
			uni.$off('chat-video-player')
			console.info("退出")
		},
		onHide() {
			console.info("关闭页面")
		},
		onBackPress(e) {
			console.info("关闭页面onBackPress")
		},
		methods: {
			imageClick() {
				console.info("地址",this.fileUrl+this.data.content)
				console.info("地址",this.fileUrl+this.data.content.url)
				let src = this.fileUrl+this.data.content.url
				let win = uni.getSubNVueById('video-player')
				// let win = uni.getStorageSync('userId')
				win.show('slide-in-bottom', 200, () => {
					uni.$emit('chat-video-player', this.data)
				})
			}
		}
	}
</script>

<style lang="scss">
	.chat-video-wrap {
		position: relative;
		// height: 240px;
		width: 160px;
		.chat-video {
			// height: 240px;
			width: 160px;
			border-radius: 8px;
		}
		.mask {
			position: absolute;
			border-radius: 8px;
			left: 0;
			top: 0;
			bottom: 0;
			right: 0;
			// background-color: rgba($color: #000000, $alpha: 0.3);
		}
		.masks {
			position: absolute;
			border-radius: 8px;
			left: 0;
			top: 0;
			bottom: 0;
			right: 0;
			background-color: rgba($color: #000000, $alpha: 0.3);
		}
		
	}
	.video-play-icon {
		width: 32px;
		height: 32px;
		position: absolute;
		// top: 96px;
		top: 35%;
		left: 64px;
		z-index: 2;
	}
</style>
