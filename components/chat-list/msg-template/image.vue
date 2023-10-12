<template>
	<image class="chat-image" mode="aspectFill" @click="imageClick" :src="data.content"></image>
</template>

<script>
	export default {
		props: {
			data: String,
			urls: {
				type: Array,
				default: () => []
			}
		},
		methods: {
			imageClick() {
				uni.previewImage({
					current: this.getIdx(),
					urls: this.urls.length ? this.urls : [this.data.content]
				});
			},
			getIdx() {
				return this.urls.findIndex(url => url === this.data.content) || 0
			}
		}
	}
</script>

<style lang="scss">
	.chat-image {
		height: 240px;
		width: 160px;
		border-radius: 8px;
	}
</style>
