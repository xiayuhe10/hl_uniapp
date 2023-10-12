<template>
	<view>
		<view class='t-toptips' :style="{top: top,background: cubgColor}" :class="[show?'t-top-show':'']">
			<view v-if="loading" class="flex flex-sub">
				<view class="flex flex-sub">
					<view class="cu-progress flex-sub round striped active sm">
						<view :style="{ background: color,width: value + '%'}"></view>
					</view>
					<text class="margin-left">{{value}}%</text>
				</view>
				<view @click="downOnAbort" v-if="value<100" class="close">取消</view>
			</view>
			<block v-else>{{msg}}</block>
		</view>
		<!-- #ifdef H5 -->
		<h5-file 
		v-if="showH5"
		ref="h5File"
		:logo="logo"
		:showTip="showTip"
		:progress="value"
		@abort="onAbort"
		@close="onCloseH5"
		></h5-file>
		<!-- #endif -->
	</view>
</template>

<script>
import h5File from './h5-file.vue';
export default {
	components: {h5File},
	props: {
		logo: {
			type: String,
			default: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F00%2F00%2F07%2F155788a6d8a5c42.jpg&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619847627&t=2da40b583002205c204d980b54b35040'
		},
		top: {
			type: String,
			default: 'auto'
		},
		bgColor: {
			type: String,
			default: 'rgba(49, 126, 243, 0.5)',
		},
		color: {
			type: String,
			default: '#55aa00',
		}
	},
	data() {
		this.uploadTask = null;
		this.downloadTask = null;
		return {
			cubgColor: '',
			loading: false,
			value: 5,
			show: false,
			msg: '执行完毕~',
			showH5: false,
			showTip: false,
		}
	},
	methods: {
		toast(title = '',{ duration = 2000, icon = 'none'} = {}) {
			uni.showToast({title,duration,icon});
		},
		getRequest(url) {  
			let theRequest = new Object(); 
			let index = url.indexOf("?");
			if (index != -1) {  
				let str = url.substring(index+1);  
				let strs = str.split("&");  
				for(let i = 0; i < strs.length; i ++) {  
					theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
				} 
			}  
			console.info("theRequest",theRequest)
			return theRequest;  
		},
		/*
			上传说明：
			url：上传接口地址
			name：上传文件key值
			header: 上传接口请求头
			...：body内其他参数
		*/
		appChooseFile({cuWebview = '',url,name = 'file',header,addName = '',addSize = '',maxSize = 10,...formData} = {}) {
			// #ifdef APP-PLUS
				let wvPath = '/uni_modules/l-file/hybrid/html/index.html';
				let wv = plus.webview.create("",wvPath,{
					'uni-app': 'none',
					top: 0,
					height: '100%',
					background: 'transparent'
				},{
					url,
					header,
					addName,
					addSize,
					maxSize,
					formData,
					key: name,
					logo: this.logo
				});
				wv.loadURL(wvPath);
				this.$root.$scope.$getAppWebview().append(wv);
				wv.overrideUrlLoading({mode:'reject'},(e)=>{
					let {fileName,size,str} = this.getRequest(e.url);
					console.info("theRequesttheRequest",this.getRequest(e.url))
					fileName = unescape(fileName);
					str = unescape(str);
					return this.handleBack(fileName,str,size);
				});
			// #endif
		},
		wxChooseFile({maxSize = 10,...param}) {
			wx.chooseMessageFile({
				count: 1,
				type: 'file',
				success: ({tempFiles}) => {
					this.setdefUI();
					let file = tempFiles[0];
					if(file.size > (1024*1024 * Math.abs(maxSize))) {
						uni.showToast({
							title:`单个文件请勿超过${maxSize}M,请重新上传`,
							icon: 'none'
						});
						return this.errorHandler('文件选择失败',this.upErr);
					}
					this.handleWXUpload(param,file);
				},
				fail: () => this.errorHandler('文件选择失败',this.upErr)
			})
		},
		h5ChooseFile({maxSize = 10,...param} = {}) {
			this.showH5 = true;
			this.value = 0;
			this.$nextTick(()=>{
				this.$refs.h5File.hFile.onchange = (event) => {  
					let file = event.target.files[0];
					if(file.size > (1024*1024 * Math.abs(maxSize))) {
						uni.showToast({
							title:`单个文件请勿超过${maxSize}M,请重新上传`,
							icon: 'none'
						});
						return;
					}
					this.handleH5Upload(param, file);
				}  
			})
		},
		handleH5Upload({url,name = 'file',header,addName,addSize,...data} = {},tempFile) {
			let fileName = tempFile.name;
			let formData = new FormData();
			for (let keys in data) {formData.append(keys, data[keys]);}
			if (addName) {formData.append(addName, fileName);}
			if (addSize) {formData.append(addSize, tempFile.size);}
			formData.append(name, tempFile);
			this.uploadTask = new XMLHttpRequest();
			this.uploadTask.open("POST", url, true);
			for (let keys in header) {this.uploadTask.setRequestHeader(keys, header[keys]);}
			
			this.uploadTask.ontimeout = () => {
				setTimeout(()=>{
					this.showTip = false;
					return this.errorHandler('请求超时',this.upErr);
				},1000);
			};
			
			this.uploadTask.upload.addEventListener("progress",(event) => {
				if(event.lengthComputable){
					this.value = Math.ceil(event.loaded * 100 / event.total);
					if (this.value > 100) {this.value=100;}
					this.$forceUpdate();
				}
			}, false);
			
			this.uploadTask.onreadystatechange = (ev) => {
				if(this.uploadTask.readyState == 4) {
					console.log('status：'+this.uploadTask.status);
					if (this.uploadTask.status == 200) {
						return this.handleBack(fileName,this.uploadTask.responseText,tempFile.size);
					}
					else {
						this.showTip = false;
						if (this.uploadTask.status == 0) {
							console.log('请检查请求头Content-Type与服务端是否匹配，并确认服务端已正确开启跨域');
						}
						return this.errorHandler('文件上传失败',this.upErr);
					}
					
				}
			};
			this.showTip = true;
			this.uploadTask.send(formData);
		},
		handleWXUpload({url,name = 'file',header,addName,addSize,...formData} = {},tempFile) {
			let opt = {url,name,formData,header,filePath:tempFile.path};
			console.info(opt)
			if (addName) {opt.formData[addName] = tempFile.name;}
			if (addSize) {opt.formData[addSize] = tempFile.size;}
			let fileName = tempFile.name;
			let path = 0
			opt['fail'] = (e) => {
				this.showTip = false;
				return this.errorHandler('文件上传失败',this.upErr)
			};
			opt['success'] = (res) => {
				if (res.statusCode==200) {
					let data = JSON.parse(res.data);
					//可自行添加后台返回状态验证
					return this.onCommit(this.$emit('up-success',{fileName,size:tempFile.size,data}));
				}
				return this.errorHandler('文件上传失败',this.upErr);
			};
			this.showTip = true;
			this.uploadTask = uni.uploadFile(opt);
			this.uploadTask&&this.uploadTask.onProgressUpdate(({progress = 0}) => {
				if (progress <= 100) {
					this.value = progress;
					this.$forceUpdate();
				}
			});
		},
		onCloseH5() {
			this.showH5 = false;
		},
		onAbort() {
			this.uploadTask&&this.uploadTask.abort();
			this.showTip = false;
		},
		downOnAbort() {
			this.downloadTask&&this.downloadTask.abort();
			this.onCommit(false,'已取消');
		},
		// app+h5返回内容，此处按实际项目修改
		handleBack(fileName,str = '{}',size) {
			console.log('可根据需求自行修改emit内容，服务端返回：'+ str);
			try{
				str = JSON.parse(str);
			}catch(e){
				console.log('Tips: responseText are not JSON');
			}
			return this.onCommit(this.$emit('up-success',{statusCode: 200,fileName,size,data:str}));
		},
		/* 
		上传
		*/
		upload(param = {}) {
			if (!param.url) {this.toast('上传地址不正确');return;}
			if (this.loading) {this.toast('还有个文件玩命处理中，请稍候..');return;}
			
			// #ifdef APP-PLUS
				return this.appChooseFile(param);
			// #endif
			
			// #ifdef MP-WEIXIN
				return this.wxChooseFile(param);
			// #endif
			
			// #ifdef H5
				this.h5ChooseFile(param);
			// #endif
		},
		/* 
		打开文件 
		*/
		open(filePath) {
			let system = uni.getSystemInfoSync().platform;
			if(system == 'ios'){filePath = encodeURI(filePath);}
			uni.openDocument({
				filePath,
				success: (res) => {console.log('打开文档成功');}
			});
		},
		/* 
		APP自定义保存 
		 */
		plusSaveFile({url,customName='',opt}) {
			return new Promise((resolve,reject)=>{
				// 可自行修改参数
				// 参数api: http://www.html5plus.org/doc/zh_cn/downloader.html#plus.downloader.DownloadOptions
				let downloadOptions = {
					method: "GET",
					timeout: 120,
					retryInterval: 10,
					filename:'file://storage/emulated/0/lFile/' + customName
				};
				downloadOptions = {...downloadOptions,...opt};
				this.downloadTask = plus.downloader.createDownload(url, downloadOptions,(d, status)=>{
					// 下载完成
					if(status == 200){ 
						let tempFilePath = d.filename;
						this.value = 100;
						this.onCommit(resolve(tempFilePath))
					} else {
						 this.errorHandler('下载失败',reject)
					}  
					this.downloadTask = null;
				});
				this.downloadTask.addEventListener('statechanged',({downloadedSize=0,state=0,totalSize=0}={})=>{
					if (state===3) {
						let total = totalSize>0?totalSize:fileSize;
						let progressVal = Math.ceil(downloadedSize / total* 100);
						this.value = progressVal>100?100:progressVal;
						this.$forceUpdate()
					}
				},false);
				this.downloadTask.start();
			});
		},
		/* 
		下载
		 type: temporary=返回临时地址，save=长期保存到本地
		 */
		download({url,type = 'temporary',customName = '',...opt}) {
			if (this.loading) {
				this.toast('还有个文件玩命处理中，请稍候..');
				return;
			}
			//this.setdefUI();
			
			// #ifdef APP-PLUS
			if (type == 'save') {
				return this.plusSaveFile({url,customName,opt});
			}
			// #endif
			
			return new Promise((resolve,reject)=>{
				url = encodeURI(url);
				this.downloadTask = uni.downloadFile({
				    url,
					...opt,
				    success: ({statusCode,tempFilePath}) => {
				        if (statusCode === 200) {
							// #ifndef H5
							if (type == 'save') {
								uni.saveFile({
									tempFilePath,
									success:({savedFilePath}) => this.onCommit(resolve(savedFilePath)),
									fail: () => this.errorHandler('下载失败',reject)
								});
							}
							else {
								this.onCommit(resolve(tempFilePath))
							}
							// #endif
							
							// #ifdef H5
							this.onCommit(resolve(tempFilePath))
							// #endif
						}
					},
					fail: () => this.errorHandler('下载失败',reject)
				});
				
				this.downloadTask.onProgressUpdate(({progress = 0}) => {
					if (progress <= 100) {
						this.value = progress;
						this.$forceUpdate();
					}
				});
			})
			
		},
		
		onCommit(resolve,msg = '执行完毕~') {
			this.msg = msg;
			this.loading = false;
			this.showTip = false;
			this.cubgColor = 'rgba(57, 181, 74, 0.5)';
			this.uploadTask = null;
			this.downloadTask = null;
			setTimeout(()=>{this.show = false;this.showH5 = false;},1500);
			return resolve;
		},
		
		setdefUI() {
			this.cubgColor = this.bgColor;
			this.value = 0;
			this.loading = true;
			this.show = true;
		},
		
		upErr(errText) {
			this.$emit('up-error',errText);
		},
		
		errorHandler(errText,reject) {
			this.msg = errText;
			this.loading = false;
			this.cubgColor = 'rgba(229, 77, 66, 0.5)';
			this.uploadTask = null;
			this.downloadTask = null;
			setTimeout(()=>{this.show = false;},1500);
			return reject(errText);
		}
	}
}
</script>

<style scoped>
	.t-toptips {
		width: 100%;
		padding: 18upx 30upx;
		box-sizing: border-box;
		position: fixed;
		z-index: 90;
		color: #fff;
		font-size: 30upx;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		word-break: break-all;
		opacity: 0;
		transform: translateZ(0) translateY(-100%);
		transition: all 0.3s ease-in-out;
	}
	
	.close {
		width: 3em;
		text-align: right;
	}
	
	.t-top-show {
		transform: translateZ(0) translateY(0);
		opacity: 1;
	}
	
	.flex {
		display: flex;
		align-items: center;
	}
	
	.flex-sub {
		flex: 1;
	}
	
	.round {
		border-radius: 5000upx;
	}
	
	/* ==================
	         进度条
	 ==================== */
	
	.cu-progress {
		overflow: hidden;
		height: 28upx;
		background-color: #ebeef5;
		display: inline-flex;
		align-items: center;
		width: 100%;
	}
	
	.cu-progress+view,
	.cu-progress+text {
		line-height: 1;
	}
	
	.cu-progress.xs {
		height: 10upx;
	}
	
	.cu-progress.sm {
		height: 20upx;
	}
	
	.cu-progress view {
		width: 0;
		height: 100%;
		align-items: center;
		display: flex;
		justify-items: flex-end;
		justify-content: space-around;
		font-size: 20upx;
		color: #ffffff;
		transition: width 0.6s ease;
	}
	
	.cu-progress text {
		align-items: center;
		display: flex;
		font-size: 20upx;
		color: #333333;
		text-indent: 10upx;
	}
	
	.cu-progress.text-progress {
		padding-right: 60upx;
	}
	
	.cu-progress.striped view {
		background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
		background-size: 72upx 72upx;
	}
	
	.cu-progress.active view {
		animation: progress-stripes 2s linear infinite;
	}
	
	@keyframes progress-stripes {
		from {
			background-position: 72upx 0;
		}
	
		to {
			background-position: 0 0;
		}
	}
	
</style>
