<template>
	<view>
		<view class="grid flex-sub margin-lr" :class="dateInfo.file.length>1?'col-3 grid-square':'col-1'"
			v-show="dateInfo.file!=null&&dateInfo.file.length>0">
			<view class="bg-img" v-for="(item1,index1) in dateInfo.file" :key="index1" v-if="item1.eventType=='IMAGE'"
				:class="dateInfo.file.length>1?'':'only-img'"
				@click="previewImgClick(fileUrl+item1.imgUrl,dateInfo.file.length-1,index1,dateInfo.file)"
				:style="{backgroundImage:`url(${fileUrl+item1.imgUrl})`}">
			</view>
		</view>
	</view>
</template>

<script>
	import webUrl from '@/common/config.js';
	import Request from '@/common/request.js';
	import dateTime from '@/common/dateTime.js';
	export default {
		props: ['dateList'],
		data() {
			return {
				isCard: false,
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
			// 预览图片
			previewImgClick(imageUrl, len, index, value) {
				this.showOrNot = false
				// 预览图片的数组
				let arr = []
				value.forEach((item, index) => {
					if (item.imgUrl) {
						arr.push(this.fileUrl + item.imgUrl)
					}
				})
				// 当前图片在 预览图片数组中的索引
				// let index = arr.findIndex(value => value == e.img)
				uni.previewImage({
					current: index,
					urls: arr,
					longPressActions: {
						itemList: ['保存图片'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
							uni.saveImageToPhotosAlbum({ //保存图片到相册
								filePath: imageUrl,
								success: function() {
									uni.showToast({
										icon: 'success',
										title: '保存成功'
									})
								},
								fail: (err) => {
									uni.showToast({
										icon: 'none',
										title: '保存失败，请重新尝试'
									})
								}
							});
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
		}
	}
</script>

<style scoped>
</style>
