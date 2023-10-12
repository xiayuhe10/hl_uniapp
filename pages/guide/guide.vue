<template>
	<view class="page-section-spacing" :style="{'padding-top': statusHeight+'px'}">
		<swiper circular="true" class="swiper" indicator-dots="true">
			<swiper-item @tap="toLogin(index)" v-for="(item , index) in bann" :key="index">
				<image :src="item.url" mode="widthfix"></image>
			</swiper-item>
		</swiper>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				fileUrl: '',
				bann: [{
						url: '../../static/background.jpg'
					}
				]
			}
		},

		computed: {
			//状态栏高度
			statusHeight() {
				//#ifdef H5
				return 0;
				//#endif
				return uni.getSystemInfoSync().statusBarHeight || 10;
			}
		},
		methods: {
			toLogin(index) {
				if (index == 0) {
					uni.navigateTo({
						url: '../login/login?launchFlag=true'
					});
				}
			}
		}
	}
</script>

<style>
	page {
		height: 100%;
	}

	.page-section-spacing {
		width: 100%;
		height: 100%;

	}

	.swiper {
		height: 100%;

	}

	swiper-item image {
		width: 100%;
		height: 100%;
	}
</style>
