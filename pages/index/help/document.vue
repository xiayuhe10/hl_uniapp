<template>
	<view class="content">
		<template v-if="isShow">
			<view class="down">
			<image class="img" :src="documentType=='txt'?txtSrc:documentType=='doc'?docSrc:documentType=='pdf'?pdfSrc:documentType=='xls'||documentType=='xlsx'?xlsSrc:unknownSrc"></image>
			<text>{{fileDetail.documentTitle}}</text>
			<view class="mb">{{fileSize}}</view>
			<view class="but" hover-class="hover" @click="open">下载({{fileSize}})</view>
		    </view>
		</template>
		<template v-else>
			
		</template>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow:false,
				fileId:"",
				fileDetail:{},
				fileSize:"",
				docSrc:'../../../static/index/help/doc.png',
				pdfSrc:'../../../static/index/help/PDF.png',
				xlsSrc:'../../../static/index/help/xlsx.png',
				txtSrc:'../../../static/index/help/txt.png',
				unknownSrc:'../../../static/index/help/unknown.png',
			}
		},
	
		computed:{
			documentType(){
				let str = this.fileDetail.documentTitle
				if(str){
					return str.substr(str.length - 4, 4).replace(".","")
				}
			}
		},
		onLoad(option) {
			this.fileId = option.id;
		},
		onReady() {
			this.getDocument();
		},
		methods: {
			//获取文档信息
			async getDocument(){
				let {data:res} = await this.$http({
					url: `/slmp-server/helpdocument/search/${this.fileId}`
				})
				this.fileDetail =  res.datas ;
				// console.log(this.fileDetail);
				this.fileSize = this.getFileSize(this.fileDetail.size);
				this.isShow = true;
			},
			//打开文档
			open() {
				let token = this.$store.state.datas.access_token
				console.log(token)
				console.log(this.fileDetail.documentUrl)
				uni.showLoading({title:"下载中..."});
				uni.downloadFile({
					url: this.fileDetail.documentUrl,
					header:{
						'Authorization':'Basic '+token
					}
				}).then(data=>{
					 var [error, res]  = data;
					 console.log(res)
					 let filePath = res.tempFilePath;
					console.log(filePath);
					uni.hideLoading();
					uni.openDocument({
						filePath: filePath,
						success: function(res) {
							console.log('打开文档成功');
						},
						fail(e) {
							console.log(e)
						}
					});
				})
			}
		}
	}
</script>

<style lang="less">
	@import "../../../common/global.less";
	view {
		display: flex;
	}
	page{
		background-color: #F7F7F7;
	}
	.hover{
		background-color:#00CDFC !important;
		opacity:0.8 !important;
	}
	.down{
		width: 88%;
		margin-top: 180rpx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.img{
			height: 160rpx;
			width: 160rpx;
		}
		>text{
			letter-spacing: 4rpx;
			font-size: 32rpx;
			font-weight: bold;
			padding: 20rpx 0;
			text-align: center;
		}
		.but{
			background-color: #00CDFC;
			color: #FFFFFF;
			border-radius: 14rpx;
			width: 300rpx;
			height: 80rpx;
			margin-top: 40rpx;
			align-items: center;
			font-size: 28rpx;
			justify-content: center;
			letter-spacing: 2rpx;
		}
		.mb{
			font-size: 24rpx;
			color: #a7a7a7;
			padding-bottom: 20rpx;
		}
	}
	.content {
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
