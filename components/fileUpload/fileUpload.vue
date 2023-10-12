<template>
	<view>
		<!-- <view class="">
			<button @tap="onUpload">上传</button>
		</view> -->
		<view class="padding">
			<lsj-upload ref="lsjUpload" childId="upload1" width="100px" :height="height" :option="option" :size="size"
				:debug="debug" :instantly="instantly" @progress="onprogress" @change="onChange">
				<view class="">
					<button  >选择文件</button>
				</view>
			</lsj-upload>
			<!-- <view class="padding">
				<button  @tap="onUpload">选择文件</button>
			</view> -->
		</view>
		<!-- <l-file ref="lFile" @up-success="onSuccess"></l-file> -->
		<view class="text-center " v-if="groupFileList.length == 0">
			暂无群文件
		</view>
		<!-- <view class="padding text-center">
			<button @tap="onOpenDoc">查看文件</button>
			<button @tap="onDown">下载到本地</button>
			<view class="text-center padding-sm" @tap="onOpenNameDoc(localPath)">点击打开：{{ localPath }}</view>
		</view> -->
	</view>
</template>

<script>
	import Request from '@/common/request.js';
	import webUrl from '@/common/config.js';
	// import lFile from '@/uni_modules/l-file/components/l-file/l-file.vue'
	import lFile from '@/uni_modules/lsj-upload/components/lsj-upload/lsj-upload.vue';
	export default {
		data() {
			this.api = '';
			return {
				logo: '../../../static/broadcast/broadcast.png',
				localPath: '',
				groupFileList: [],
				// 上传接口参数
				option: {
					// 上传服务器地址，此地址需要替换为你的接口地址
					url: '#',
					// 上传附件的key
					name: 'file',
					// 根据你接口需求自定义请求头
					header: {
						'Authorization': 'bearer eyJhbGciOiJSUzI1NiIsInR5c',
						'uid': '27682',
						'client': 'app',
						'accountid': 'DP'
					},
					// 根据你接口需求自定义body参数
					formData: {
						// 'orderId': 1000
					}
				},
				// 必传项
				height: '180rpx',
				// 文件上传大小
				size: 10,
				// 打印日志
				debug: true,
				// 选择文件后是否立即自动上传
				instantly: true,
				// 文件回显列表
				files: new Map(),
				// 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
				wxFiles: [],


				// 演示用
				tabIndex: 0,
				list: [],
				memberList: [],
				groupId: ''
			}
		},
		onLoad(option) {
			this.memberList = JSON.parse(option.item)
			this.groupId = option.groupId
			this.groupFilesList(option.groupId)
			console.info('memberList', this.memberList, option.groupId)
		},
		methods: {
			groupFilesList(groupId) {
				Request.get(Request.API.groupFileList, {
					"groupId": groupId
				}).then(res => {
					console.log("groupId", res)
				})
			},
			// 手动上传
			upload() {
				// name=指定文件名，不指定则上传所有type等于waiting和fail的文件
				this.$refs.lsjUpload.upload();
			},
			// 上传进度回调
			onprogress(item) {
				// 更新当前状态变化的文件
				this.files.set(item.name, item);
				let p = JSON.stringify(this.files.get(item.name))
				let s = JSON.parse(p)
				let fi = s.path.slice(5, -1)
				console.log('演示上传完成后取服务端数据', s.size,s.name,fi, this.groupId);
				// 演示上传完成后取服务端数据
				// if (item['responseText']) {
				// 	this.files.get(item.name).responseText = JSON.parse(item.responseText);
				// }
				// this.$forceUpdate();
				// #ifdef H5
				Request.post(Request.API.groupFile, {
					"url": fi,
					"bizId": this.groupId
				}).then(res => {
					console.log("listd", res)
				})
				// #endif
				// #ifdef APP-PLUS
				// Request.post(Request.API.groupFile, {
				// 	"url": fi,
				// 	"bizId": this.groupId
				// }).then(res => {
				// 	console.log("listAPP-PLUS", res)
				// })
				console.log('APP-PLUS演示上传完成后取服务端数据', s.size,s.name,fi, this.groupId);
				// #endif
				// 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
				// #ifdef MP-WEIXIN
				// console.log('打印对象',JSON.stringify(this.files.get(item.name)));
				// console.log('打印对象s',s.path,this.groupId);

				// this.wxFiles = [...this.files.values()];
				Request.post(Request.API.groupFile, {
					"url": fi,
					"bizId": this.groupId
				}).then(res => {
					console.log("list", res)
				})
				// #endif
				// 演示判断是否所有文件均已上传成功
				// let isAll = [...this.files.values()].find(item=>item.type!=='success');
				// if (!isAll) {
				// 	console.log('已全部上传完毕');
				// }
				// else {
				// 	console.log(isAll.name+'待上传');
				// }
			},
			// 文件选择回调
			onChange(files) {
				this.files = files;
				this.$forceUpdate(); // 进行强制渲染，效果实现
				// 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
				// #ifdef MP-WEIXIN
				this.wxFiles = [...this.files.values()];
				// #endif
			},
			onOpenNameDoc(path = '') {
				if (!path) {
					return;
				}
				/* 打开文件 */
				this.$refs.lFile.open(path);
			},
			onOpenDoc() {
				let url =
					'http://baobab.kaiyanapp.com/api/v1/playUrl?vid=129764&resourceType=video&editionType=default&source=aliyun&playUrlType=url_oss';
				/* 下载返回临时路径（退出应用失效） */
				this.$refs.lFile.download({
						url
					})
					.then(path => {
						/* 打开附件 */
						this.$refs.lFile.open(path);
					});
			},
			/**
			 * 保存到本地
			 * type 非save为临时下载
			 * customName 仅type=save生效 附件自定义名称需带后缀，自定义目录需以/结尾
			 * DownloadOptions 仅type=save生效 可选参数(http://www.html5plus.org/doc/zh_cn/downloader.html#plus.downloader.DownloadOptions)
			 * 默认下载到_downloads/files/ 可通过DownloadOptions自定义
			 */
			onDown() {
				let url =
					'http://baobab.kaiyanapp.com/api/v1/playUrl?vid=129764&resourceType=video&editionType=default&source=aliyun&playUrlType=url_oss';
				this.$refs.lFile.download({
						url, //必填，附件网络地址
						type: 'save', //选填，非save为临时下载
						customName: '自定义文件名需要带后缀.jpg',
						//...DownloadOptions直接写key:value 
						// 例如：
						method: 'GET'
					})
					.then(path => {
						this.localPath = path;
					});
			},

			/* 上传 */
			onUpload() {
				this.$refs.lFile.onClick();
			},
			onSuccess(res) {
				console.log('上传成功回调', JSON.stringify(res));
				uni.showToast({
					title: JSON.stringify(res),
					icon: 'none'
				})
			}
		}
	}
</script>

<style>
	.padding-sm {
		padding: 20upx;
	}

	.padding {
		padding: 30upx;
	}
</style>
