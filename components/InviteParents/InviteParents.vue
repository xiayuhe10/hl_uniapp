<template>
	<view>
		<view class="cu-modal" :class="modalName?'show':''" @tap="hideModal">
			<view class="cu-dialog bg-white" @tap.stop="">
				<!-- <view style="position: absolute;right: 15px;top: 15px;" class=" text-red text-right " @tap="hideModal">
					<text class="cuIcon-close "></text>
				</view> -->
				<view style="position: absolute;left: 0px;top: 0px;height: 100px; border-radius: 0 0 50% 50%/0 0 100% 100% ;z-index: 1;" class="bg-axx response" @tap="hideModal" >
				</view>
				<view class="text-center margin-top-lg" style="z-index: 9;">
					<view class="flex round flex-direction justify-center align-center "
						style="height:120px;width: 120px;margin: 0 auto;">
						<view class="bg-img round padding "
							style="background-image: url('./../../static/userManual/fd3a4a62f688a521893f863b81aa92b.jpg');height:100px;width: 100px;z-index: 999;">
						</view>
					</view> 
					<view class="margin-top-sm text-axx text-xl">家长端小程序</view>
				</view>
				<view class="padding-xl text-left response" >
					<view class="text-bold text-black">爱校信平台中</view>
					<view class="margin-top text-bold text-black">老师使用的是 <text class="text-red">爱校信APP</text> </view>
					<view class="margin-top text-bold text-black ">家长端使用的是爱校信的 <text class="text-red">微信小程序</text></view>
					<view class="text-gray text-sm margin-top-xs response">为了方便家长,不需要下载APP，老师只需要点击下方分享按钮微信分享给家长打开即可。家长也可通过微信小程序搜索爱校信进入。</view>
					<view class="text-gray text-sm margin-top-xs">家长可关注爱校信公众号，及时接收消息</view>
				</view>

				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub  solid-top padding-tb" @tap="shareWxLink">
						<button class="cu-btn bg-axx text-white padding-lg text-lg">分享家长端</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import weburl from '@/common/config.js'
	import Request from '@/common/request.js';
	export default {
		name: "InviteParents",
		data() {
			return {
				modalName: false,
				logoUrl: {},
				fileUrl: '',
			};
		},
		onLoad() {
			this.fileUrl = weburl.fileURL
			this.getImage();
		},
		methods: {
			getImage() { //获取LOGO
				Request.get(Request.API.sysPictureList, {
					"type": "GUIDE"
				}).then(res => {
					console.log("res", res.data.rows)
					this.logoUrl = res.data.rows[0]
				})
			},
			showModal(e) {
				this.modalName = true
			},
			hideModal(e) {
				this.modalName = false
			},
			shareWxLink() {
				this.modalName = null
				uni.share({
					provider: 'weixin',
					scene: "WXSceneSession",
					type: 5,
					imageUrl: this.fileUrl + this.logoUrl.imgUrl,
					title: '家校沟通，查看孩子日常表现',
					miniProgram: {
						id: 'gh_e42981d6c3e1',
						path: 'pages/chat/list',
						type: 0,
						webUrl: 'https://uniapp.dcloud.io'
					},
					success: ret => {
						console.log(JSON.stringify(ret));
					},
					fail: res => {
						console.log('分享失败',JSON.stringify(res));
						uni.showToast({ title: '分享失败', icon: 'none', duration: 2000 })  
					}
				});
			},
		}
	}
</script>

<style>

</style>
