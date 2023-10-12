<template>
	<view>
		<view class="checkBoxGroup">
			<text class="title">请选择遇到的问题</text>
			<!-- 			<checkbox-group v-model="result" @change="onChange">
				<view v-for="(item,index) in complaintTypeList" class="checkBoxItem">
					<checkbox shape="square" icon-size="17px" :value="item.dictLabel">
						{{item.dictLabel}}
					</checkbox>
				</view>
			</checkbox-group> -->
			<checkbox-group class="block" v-model="result" @change="CheckboxChange">
				<view class="margin-top" style="height: 60rpx;line-height: 60rpx;" v-for="item in complaintTypeList">
					<view style="float: left;width: 60rpx;">
						<checkbox :class="item.checked?'checked':''" :checked="item.checked?true:false"
							:value="item.dictLabel">
						</checkbox>
					</view>
					<view>{{item.dictLabel}}</view>

				</view>
			</checkbox-group>

			<!-- <view class="uni-list">
				<checkbox-group @change="checkboxChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="item in items" :key="item.value">
						<view>
							<checkbox :value="item.value" :checked="item.checked" />
						</view>
						<view>{{item.name}}</view>
					</label>
				</checkbox-group>
			</view> -->
		</view>
		<view class="content">
			<textarea style="height: 200rpx;" v-model="complaint.content" :maxlength="maxNumber"
				placeholder="您的意见、建议或者任何想说的话。" @input='inputText'></textarea>

		</view>
		<view class="cu-form-group">
			<view class="grid col-4 grid-square flex-sub">
				<view class="bg-img" v-for="(item,index) in imageList" :key="index">
					<image :src='fileUrl+item' mode='aspectFill' :data-src="item" @click="preview(fileUrl+item)">
					</image>
					<view class="cu-tag bg-red" @click="onDeleteClick(index)">
						<text class="cuIcon-close"></text>
					</view>
				</view>
				<view class="solids" v-if="imageList.length<9">
					<text class="cuIcon-cameraadd" @tap="onGetImgClick"></text>
				</view>
			</view>
		</view>

		<view class="buttomText">
			<text>
				<text class="buttomText-base">还可以输入</text>
				<text class="buttomText-number">{{maxNumber - number}}</text>
				<text class="buttomText-base">字</text>
			</text>
		</view>
		<view>
			<button class="submitButton" @tap="submitComplaint">提交</button>
		</view>


	</view>
</template>

<script>
	import Request from '@/common/request.js';
	import webUrl from '@/common/config.js';
	export default {
		data() {
			return {
				result: [],
				fileList: [],
				maxNumber: 200, //可输入最大字数
				number: 0, //已输入字数
				complaintTypeList: [], // 举报信息多选列表
				complaint: { // 输入的举报信息
					typeName: '',
					content: '',
					imgUrl: '',
				},
				imgUrlList: [],
				imageList: [],
				fileUrl: '',
			}
		},
		onLoad(options) {
			this.fileUrl = webUrl.fileURL;
			this.getComplaintTypeList();
		},
		methods: {
			getComplaintTypeList() { //根据字典类型查询字典数据信息 dictTyp
				Request.get(Request.API.selectDictDataByType + "complaint").then(res => {
					if (res.data.code == 200) {
						let resData = res.data.data
						resData.forEach(item => {
							item.checked = false
						})
						this.complaintTypeList = resData
					} else {
						uni.showToast({
							title: '举报信息加载失败',
							icon: 'none', 
							duration: 2000 
						})
					}
				})
			},
			CheckboxChange(e) { // 多选事件状态改变
				var items = this.complaintTypeList,
					values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					items[i].checked = false;
					for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
						if (items[i].dictLabel == values[j]) {
							items[i].checked = true;
							break
						}
					}
				}
				this.result = e.detail.value
			},
			onDeleteClick(index) {// 长按删除图片
				uni.showModal({
					title: '删除图片',
					content: '确定删除图片?',
					success: res => {
						if (res.confirm) {
							// 删除图片 将数据置空
							this.imageList.splice(index, 1)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			preview(img) { // 预览图片
				var imgArr = []
				imgArr.push(img)
				uni.previewImage({
					urls: imgArr,
					current: imgArr[0],
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			inputText(e) { //监听输入，实时改变已输入字数
				let value = e.detail.value; //获取textarea的内容，
				let len = value.length; //获取textarea的内容长度
				this.number = len
				this.complaint.content = value
			},
			onGetImgClick() {// 上传图片
				const that = this
				uni.chooseImage({
					count: 4,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						const len = that.imageList.length
						if (len >= 4) {
							uni.showToast({
								title: '图片最多上传4张'
							})
						} else {
							const tempFilePaths = res.tempFilePaths[0]
							uni.uploadFile({
								url: webUrl.BaseURL + Request.API.upload,
								filePath: tempFilePaths,
								name: 'file',
								header: {
									Authorization: uni.getStorageSync('token')
								},
								success: (myres) => {
									let returnData = JSON.parse(myres.data);
									that.imageList.push(returnData.data.url)
								},
								fail: (err) => {
									console.log('请求失败', err)
								}
							});
						}
					}
				})
			},
			submitComplaint() { //举报新增
				this.complaint.imgUrl = this.imageList.join(",");
				this.complaint.typeName = this.result.join(",");
				if (this.complaint.typeName == "") {
					uni.showToast({
						title: "请选择遇到的问题",
						icon: 'none',
					})
					return
				}
				if (this.complaint.content == "") {
					uni.showToast({
						title: "请输入您的意见",
						icon: 'none',
					})
					return
				}
				Request.post(Request.API.addComplaint, this.complaint).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						uni.showToast({
							title: '感谢您的反馈，工作人员会在1-3个工作日内回复',
							icon: 'none',
							duration: 5000 
						})
						this.complaintTypeList.forEach(item => {
							item.checked = false;
						})
						this.complaint = {
							typeName: '',
							content: '',
							imgUrl: '',
						}
						this.imgUrlList = []
						this.imageList = []
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none', 
							duration: 2000 
						})
					}
				})
			},
		}
	}
</script>

<style>
	.title {
		color: #909090;
		font-size: 12px;
	}

	.checkBoxGroup {
		background-color: #FFFFFF;
		padding: 15px;
	}

	.checkBoxItem {
		padding-left: 5px;
		margin-top: 12px;
	}

	.content {
		margin-top: 5px;
		padding: 15px;
		font-size: 14px;
		background-color: #FFFFFF;
	}

	.img {
		padding: 15px;
		background-color: #FFFFFF;
	}

	.buttomText {
		float: right;
		margin-right: 10px;
		margin-top: 10px;
	}

	.buttomText-base {
		font-size: 12px;
		color: #909090;
	}

	.buttomText-number {
		color: orange;
		font-size: 13px;
	}

	.submitButton {
		margin-top: 50px;
		width: 90%;
		background-color: orange;
		color: #FFFFFF;
	}

	.uni-list-cell {
		justify-content: flex-start
	}
</style>
