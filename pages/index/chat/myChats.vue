<template>
	<view class="content avatarwrap scrollViewContent" id="scrollViewContent" @click="show = false"
		:style="{height: contentViewHeight + 'px'}">
		<l-file ref="lFile"></l-file>
		<!-- 聊天内容 -->
		<!-- <scroll-view class="chat" scroll-y :scroll-into-view="scrollToView" scroll-with-animation @scroll="scrollEvent"> -->
		<view v-if="msgList.length>=15 && !isLoad">
			<view class="cu-load " :class="!isLoad?'loading':'over'"></view>
		</view>
		<scroll-view class="scrollview chat scroll-box" id="scrollview" scroll-with-animation scroll-y="true"
			:scroll-into-view="scrollToView" :style="{height: contentViewHeight + 'px'}" @scrolltoupper="loadHistory"
			upper-threshold="10">
			<view class="chat-main" :style="{paddingBottom:inputh+'px'}">
				<view class="cu-chat" v-for="(item,index) in msgList" :key="index" :index="index"
					:id="'scroll-'+ index">
					<!--我的聊天 文字 start-->
					<view class="chat-time" v-if="item.sendDate != ''">
						{{changeTime(item.createTime,index)}}
					</view>
					<!-- <view class="chat-time" v-if="item.sendDate != '' && index+1 != msgList.length ">
							{{changeTime(item.createTime,index)}}
						</view>
						<view class="chat-time" v-if="item.sendDate != '' && index+1 == msgList.length ">
							{{newDay(item.createTime)}}
						</view> -->
					<view class="cu-item sys-message" v-if="item.msgType=='SYS_MSG'">
						<view class="main">
							<view class="chat-time">
								{{item.content}}
							</view>
						</view>
					</view>
					<!-- 右边消息 -->
					<view class="cu-item self  "
						v-if="item.fromId==fromId && item.msgType!='RECALL_MSG'&&item.msgType!='SYS_MSG'">
						<view class="main">
							<!--文字start-->
							<view class="plane-once content bg-green shadow"
								v-if="item.contentType=='TEXT'&&item.msgType=='MSG'"
								@longpress="longpress($event,item,1,index)" @click="click()" @touchend="touchend">
								<text space='nbsp'>{{item.content}}</text>
							</view>
							<!--文字end-->
							<!--文件start-->
							<view class="plane-once content " style="width:200px;"
								@tap="onOpenDoc(fileUrl+item.content.url)" @longpress="longpress($event,item,1,index)"
								v-if="item.contentType=='FILE'&&item.msgType=='MSG'">
								<view style="height: 100%;width: 20%;">
									<image style="display: block;width: 80rpx;height: 70rpx;
									margin-top:11rpx;" :src="eventType[item.content.type].src"></image>
								</view>
								<view class="margin-left-xs">
									<view class="text-sm"
										style="overflow: hidden; -webkit-line-clamp: 2; text-overflow: ellipsis; ">
										{{item.content.name}}
									</view>
									<view style="color: gray;font-size: 24upx;">{{changeKM(item.content.size)}}</view>
								</view>

							</view>
							<!--文件end-->
							<!-- 图片 -->
							<image :src="fileUrl+item.content" v-if="item.contentType=='IMAGE'&&item.msgType=='MSG'"
								@longpress="longpress($event,item,1,index)" @touchend="touchend" class="radius"
								mode="widthFix" @tap="previewImg(item.content,index)"></image>
							<!-- 视频 -->
							<view @longpress="longpress($event,item,1,index)">
								<ChatVideo v-if="item.contentType=='VIDEO'&&item.msgType=='MSG'" :data="item">
								</ChatVideo>
							</view>
							<!-- <image :disabled="false" :controls='false' :autoplay='false' :src="fileUrl+item.content+'?x-oss-process=video/snapshot,t_0,f_jpg'" mode=""></image> -->

							<!-- <video :src="fileUrl+item.content" v-if="item.contentType=='VIDEO'&&item.msgType=='MSG'"
								class="radius" show-mute-btn="true" x-webkit-airplay="true" webkit-playsinline="true"
								x5-video-player-type="h5" x5-video-orientation="portraint" preload="auto"
								controls></video> -->
							<!-- 语音 -->
							<view class="message content bg-green shadow align-center"
								@longpress="longpress($event,item,1,index)" @click="click()" @touchend="touchend"
								v-if="item.contentType=='VOICE'&&item.msgType=='MSG'" @tap="playVoice(item)">
								<view class="text-white" style="z-index: 9999;margin-top: 5rpx;">
									{{item.content.times?item.content.times:0}}″
								</view>
								<view class="content3" v-if="item.id == voiceShowId "
									style="transform:rotatey(180deg);">
									<view class=" common3 big"></view>
									<view class="common3 middle"></view>
									<view class="common3 min"></view>
								</view>
								<view class="content3" v-if="item.id != voiceShowId "
									style="transform:rotatey(180deg);">
									<view class=" common3 big_0"></view>
									<view class="common3 middle_0"></view>
									<view class="common3 min"></view>
								</view>
							</view>
							<!-- <view class="message content bg-green shadow plane-once"
								@longpress="longpress($event,item,1)" @click="click()" @touchend="touchend"
								v-if="item.contentType=='VOICE'&&item.msgType=='MSG'" @tap="playVoice(item)">
								<view class="msg-text voice flex align-center" v-if="item.id != voiceShowId ">
									<view>{{item.content.times}}″</view>
									<view class="voice-right"> </view>
								</view>
								<view v-if="voiceShowFlag  == false && item.id == voiceShowId ">
									<view class="msg-text voice">
										{{item.content.times}}″
										<image src="../../../static/icon/voice-right.png" class="voice-img"></image>
									</view>
								</view>
								<view class="loadingVoice" v-if="item.id == voiceShowId ">
									<span class=""></span>
									<span class=""></span>
									<span class=""></span>
								</view>
							</view> -->
						</view>
						<!-- 头像 -->
						<view class="cu-avatar radius bg-gray"
							v-if="item.msgType!='RECALL_MSG' && item.msgType!='DELETE_MSG'"
							:style="{backgroundImage:`url(${fileUrl+item.fromAvatar})`}"
							@click="patriarchInfo(item.fromId)">
						</view>
					</view>
					<view class="cu-info round text-center" v-if="item.fromId==fromId && item.msgType=='RECALL_MSG'">
						我撤回一条消息!</view>
					<!-- 左边消息 -->
					<view class="cu-item left"
						v-if="item.fromId!=fromId&&item.msgType!='RECALL_MSG'&&item.msgType!='SYS_MSG'">
						<!-- 头像 -->
						<view class="cu-avatar radius bg-gray "
							:style="{backgroundImage:`url(${fileUrl+item.fromAvatar})`}"
							@click="patriarchInfo(item.fromId)">
						</view>
						<!-- 昵称 -->
						<text class="username" v-if="item.chatType=='GROUP'">{{item.fromNickName}}</text>
						<view class="main">
							<!--  -->
							<view class="content shadow plane-once" :class="item.chatType=='GROUP'?'sss':''"
								v-if="item.contentType=='TEXT'&&item.msgType=='MSG'"
								@longpress="longpress($event,item,2,index)" @click="click()" @touchend="touchend">
								<text space='nbsp'>{{item.content}}</text>
							</view>
							<!--文件start-->
							<view class="plane-once content " :class="item.chatType=='GROUP'? 'margin-top':'' "
								style="width:200px;" @tap="onOpenDoc(fileUrl+item.content.url)"
								@longpress="longpress($event,item,2,index)"
								v-if="item.contentType=='FILE'&&item.msgType=='MSG'">
								<view style="height: 100%;width: 20%;">
									<image style="display: block;width: 80rpx;height: 70rpx;
									margin-top:11rpx;" :src="eventType[item.content.type].src"></image>
								</view>
								<view class="margin-left-xs">
									<view class="text-sm"
										style="overflow: hidden; -webkit-line-clamp: 2; text-overflow: ellipsis; ">
										{{item.content.name}}
									</view>
									<view style="color: gray;font-size: 24upx;">{{changeKM(item.content.size)}}</view>
								</view>

							</view>
							<!-- <view class="plane-once content" style="width:200px;height: 140rpx;">
								<view style="height: 100%;width: 15%;">
									<image style="display: block;width: 50rpx;height: 50rpx;
									margin-top:20rpx;" src="../../../static/broadcast/qq.png"></image>
								</view>
								<view style="margin-left: 5rpx;
										overflow: hidden;
										-webkit-line-clamp: 2; 
										text-overflow: ellipsis;
										">去啊11111飒飒撒.docx<view style="color: gray;font-size: 2rpx;">2.0M</view>
								</view>

							</view> -->
							<!--文件end-->
							<!-- 照片 -->
							<image :src="fileUrl+item.content" v-if="item.contentType=='IMAGE'&&item.msgType=='MSG'"
								@longpress="longpress($event,item,2,index)" @touchend="touchend"
								class="radius imgSizeLeft" mode="widthFix" @tap="previewImg(item.content,index)">
							</image>
							<!-- 视频 -->
							<view @longpress="longpress($event,item,2,index)">
								<ChatVideo @longpress="longpress($event,item,2,index)"
									v-if="item.contentType=='VIDEO'&&item.msgType=='MSG'" :data="item"></ChatVideo>
							</view>

							<!-- <video :src="fileUrl+item.content" v-if="item.contentType=='VIDEO'&&item.msgType=='MSG'"
								class="radius" show-mute-btn="true" x-webkit-airplay="true" webkit-playsinline="true"
								x5-video-player-type="h5" x5-video-orientation="portraint" preload="auto"
								controls></video> -->
							<!-- 语音 -->
							<view class="message content bg-white  plane-once  align-center"
								:class="item.chatType=='GROUP'? 'margin-top':'' "
								@longpress="longpress($event,item,2,index)" @click="click(item)" @touchend="touchend"
								v-if="item.contentType=='VOICE'&&item.msgType=='MSG'" @tap="playVoice(item)">

								<view class="content2" v-if="item.id == voiceShowId ">
									<view class="common2 big"></view>
									<view class="common2 middle"></view>
									<view class="common2 min2"></view>
								</view>
								<view class="content2" v-if="item.id != voiceShowId ">
									<view class="common2 big_0"></view>
									<view class="common2 middle_0"></view>
									<view class="common2 min2"></view>
								</view>
								<view style="z-index: 9999;margin-top: 5rpx;">
									{{item.content.times?item.content.times:0}}″
								</view>
							</view>

							<!-- <view class="message content bg-white  plane-once margin-top"
								@longpress="longpress($event,item,2)" @click="click(item)" @touchend="touchend"
								v-if="item.contentType=='VOICE'&&item.msgType=='MSG'" @tap="playVoice(item)">
								<view class="msg-text voice flex align-center" v-if="item.id != voiceShowId ">
									<view>{{item.content.times}}″</view>
									<view class="voice-left"> </view>
								</view>
								<view v-if="voiceShowFlag  == false && item.id == voiceShowId ">
									<view class="msg-text voice">
										{{item.content.times}}″
										<image src="../../../static/icon/voice-left.png" class="voice-img"></image>
									</view>
								</view>
								<view class="loadingVoice" v-if="item.id == voiceShowId ">
									<span class=""></span>
									<span class=""></span>
									<span class=""></span>
								</view>
							</view> -->
						</view>
					</view>
					<view class="cu-info round text-center" v-if="item.fromId!=fromId&&item.msgType=='RECALL_MSG'">
						对方撤回一条消息!</view>
				</view>
			</view>
		</scroll-view>
		<!-- 长摁出现 -->
		<view class="popup flex flex-direction align-center justify-center" v-show="show"
			:style="{top:topView +'px',left:rightView  +'px'}">
			<view class="popconten flex justify-between">
				<view class="flex flex-direction justify-center align-center popWith" @click="popChoice(1)"
					v-if="popChoiceText.contentType=='TEXT'">
					<view class="cuIcon-copy text-white popIconsize"></view>
					<view class="popText">复制</view>
				</view>
				<view class="flex flex-direction justify-center align-center popWith" @click="popChoice(2)">
					<view class="cuIcon-delete text-white popIconsize"></view>
					<view class="popText">删除</view>
				</view>
				<view class="flex flex-direction justify-center align-center popWith" @click="popChoice(3)"
					v-if="chehuiShow == 1" :class="chehuiShow == 1?'':'non'">
					<view class="cuIcon-repeal text-white popIconsize"></view>
					<view class="popText">撤回</view>
				</view>
				<view v-if="pressValue.fromId!=userInfo.userId"
					class="flex flex-direction justify-center align-center popWith" @click="popChoice(4)">
					<view class="cuIcon-safe text-white popIconsize"></view>
					<view class="popText">举报</view>
				</view>
			</view>
			<view class="h"> </view>
		</view>
		<view v-if="chatGroupStatus.groupRole != 'OWNER'">
			<view class="bg-white flex justify-between align-center padding-sm" v-if="groupInfo&&groupInfo.status=='1'|| chatGroupStatus.status=='1'     "   >
				<view >
					<image class="bt-img"  src="../../../static/icon/voice.png"></image>
				</view>
				<view style="width: 70%;">
					<button size="mini"  class="response">群聊禁言</button>
				</view>
				<view >
					<image class="bt-img" src="../../../static/icon/emoji.png"></image>
				</view>
				<view class="bt-img" >
					<image class="bt-img" src="../../../static/icon/plus.png"></image>
				</view>
			</view>
		</view>
		<view style="z-index: 9999;" v-else>
			<submit @inputs="inputs" @heights="heights" :flag="myFlag" :phone="phoneShow"></submit>
		</view>
		<view class="cu-modal" :class="modalName=='RadioModal'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-bar bg-white justify-end">
					<view class="content">举报</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<radio-group class="block" @change="RadioChange">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in priceList" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">{{item.name}}</view>
								<radio class="round" :class="radio==item.value?'checked':''"
									:checked="radio==item.value?true:false" :value="item.value"></radio>
							</label>
						</view>
						<view class="cu-item" v-if="isInput">
							<input type="text" placeholder="输入其他举报理由" v-model="reportContent"></input>
						</view>
					</view>
				</radio-group>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub text-green " @tap="submitReport">
						确定
					</view>
					<view class="action margin-0 flex-sub solid-left" @tap="hideModal">取消</view>
				</view>
			</view>
		</view>
	</view>
</template>


<script>
	// let innerAudioContext = uni.createInnerAudioContext();

	import submit from '@/components/submit/submit.vue';
	import ChatVideo from '@/components/chat-list/msg-template/video.vue'
	import Request from '@/common/request.js';
	import webUrl from '@/common/config.js';
	import dateTime from '@/common/dateTime.js';
	import lFile from '@/uni_modules/l-file/components/l-file/l-file.vue';
	import lsjUpload from '@/uni_modules/lsj-upload/components/lsj-upload/lsj-upload.vue';
	export default {
		components: {
			submit,
			ChatVideo
		},
		data() {
			return {
				priceList: [{
					name: '发布色情信息',
					value: 'EROTICISM'
				}, {
					name: '存在欺诈骗钱行为',
					value: 'FAKE'
				}, {
					name: '冒充他人',
					value: 'PERSONATION'
				}, {
					name: '账号可能被盗用',
					value: 'ACCOUNT_THEFT'
				}, {
					name: '侵犯未成年人权益',
					value: 'INFRINGE_MINOR_BENEFIT'
				}, {
					name: '存在网络水军行为',
					value: 'NAVAL_ACTION'
				}, {
					name: '辱骂他人',
					value: 'ABUSE_OTHER'
				}, {
					name: '其他',
					value: 'OTHER'
				}],
				modalName: null,
				radio: '',
				reportContent: '',
				isInput: false,
				userInfo: {},
				pressValue: {},
				phoneShow: '',
				pageNum: 1,
				pageSize: 15,
				listTotal: 15,
				sessionId: null,
				myFlag: '',
				innerAudioContext: uni.createInnerAudioContext(), // 音频
				contentViewHeight: 0,
				scrollTop: '',
				bottomnum: 0,
				bottomId: 0,
				windowH: 0,
				voiceShowFlag: false,
				isLoad: false,
				voiceShowId: 0,
				toId: "",
				chehuiShow: 0,
				msg: [],
				times: "",
				msgList: [],
				scrollToView: '',
				oldTime: new Date(),
				inputh: '60',
				fileUrl: '',
				sessionListDetail: '',
				webSocket: null,
				islongPress: false, //长按记录变量
				// 弹窗
				show: false,
				showXY: {},
				tidingsXY: {},
				optionValue: {},
				topView: '',
				rightView: '',
				popChoiceText: {},
				longpressIndex: null,
				eventType: {
					TEXT: {
						VALUE: 0,
						src: '../../../static/groupFile/txt.png',
					},
					VOICE: {
						VALUE: 1,
						src: '../../../static/groupFile/ic-audio-file.png',
					},
					IMAGE: {
						VALUE: 2,
						src: '../../../static/groupFile/file-b-_3.png',
					},
					VIDEO: {
						VALUE: 3,
						src: '../../../static/groupFile/ic-video-file.png',
					},
					FILE: {
						VALUE: 4,
						src: '../../../static/groupFile/file-word-fill.png',
					},
					PDF: {
						VALUE: 5,
						src: '../../../static/groupFile/file-b-.png',
					},
					OTHER: {
						VALUE: 99,
						src: '../../../static/groupFile/file-unknown-fill.png',
					},
					ZIP: {
						VALUE: 6,
						src: '../../../static/groupFile/zipzip.png',
					},
					EXE: {
						VALUE: 7,
						src: '../../../static/groupFile/e-exe.png',
					},
					XLS: {
						VALUE: 8,
						src: '../../../static/groupFile/file-table.png',
					},
					PPT: {
						VALUE: 9,
						src: '../../../static/groupFile/file-b-.png',
					}
				},
				popList: [{
						name: '复制',
						ico: 'copy',
						id: 1
					},
					{
						name: '删除',
						ico: 'delete',
						id: 2
					},
					{
						name: '撤回',
						ico: 'repeal',
						id: 3
					}
				],
				chatGroupStatus: '',
				groupInfo: {}
			};
		},
		onShow() {
			this.$forceUpdate()
			this.updateMsgIsRead()
		},
		onLoad(e) {
			this.userInfo = uni.getStorageSync('userInfo')
			console.log("页面的onLoad", e)
			this.sessionId = e.sessionId;
			this.optionValue = e
			this.myFlag = e.flag
			if (e.name != null && e.name != '') {
				uni.setNavigationBarTitle({
					title: e.name ? e.name : ''
				})
			}
			if (e.name == 'null') {
				uni.setNavigationBarTitle({
					title: ''
				})
			}
			this.fromId = uni.getStorageSync('userId')
			this.fileUrl = webUrl.fileURL;
			this.getSessionDetail()

			uni.$on("wsRespData", (rel) => {
				console.info("webSocket的调用")
				if (this.sessionId != null) {
					console.log("rel", rel)
					this.getList();
				}
			})
		},
		onBackPress() { // 离开页面时
			this.updateMsgIsRead()
		},
		created() {
			const res = uni.getSystemInfoSync(); //获取手机可使用窗口高度     api为获取系统信息同步接口
			this.windowH = res.windowHeight;
			this.contentViewHeight = this.windowH; //像素   因为给出的是像素高度 然后我们用的是upx  所以换算一下 
			// console.info("窗口高度 ", res.windowHeight)
		},
		onHide() { // 页面关闭页面销毁时关闭音频, 避免页面切换音频还在播放
			this.innerAudioContext && this.innerAudioContext.onStop(() => {})
		},
		onUnload() {
			this.innerAudioContext.onStop(() => {})
		},
		onNavigationBarButtonTap(e) { // 右上角的点击事件
			let that = this
			if (this.sessionListDetail.groupId) {
				uni.navigateTo({ // 转跳到群详情
					// url: "../../contact/classGroupInfo?id=" + this.sessionListDetail.groupId
					url: `../../contact/classGroupInfo?id=${this.sessionListDetail.groupId}&sessionId=${this.optionValue.sessionId}&name=${this.optionValue.name}&flag=${this.optionValue.chatType}`
				})
			} else {
				let id = ''
				if (that.msgList && that.msgList.length > 0) {
					that.msgList.forEach(function(value, index) {
						if (value.fromId != that.fromId) {
							id = value.fromId
							return
						}
					})
				}
				if (id != '') {
					uni.navigateTo({
						url: "../../contact/patriarchInfo?userId=" + id + "&groupId=null"
					})
				} else {
					uni.navigateTo({
						url: "../../contact/patriarchInfo?userId=" + this.sessionListDetail.toId + "&groupId=null"
					})
				}

			}

		},
		methods: {
			//群详情
			selectImGroupById() {
				let that = this;
				if (null == this.sessionListDetail.groupId) {
					return;
				}
				Request.get(Request.APIPAR.selectImGroupById, {
					id: this.sessionListDetail.groupId
				}).then(res => {
					that.groupInfo = res.data.data
					// if (that.chatGroupid != "null" && typeof(that.chatGroupid) != "undefined") {
					this.getUserInfoByGroupId()
					// }
					console.info("群详情", that.groupInfo)
				})
			},
			getUserInfoByGroupId() { //GET 查询当前用户群下的用户信息groupId群id
				let that = this;
				console.info(Request.APIPAR.selectUserInfoByGroupId)
				Request.get(Request.APIPAR.selectUserInfoByGroupId, {
					"groupId": this.sessionListDetail.groupId
				}).then(res => {
					this.chatGroupStatus = res.data.data
				})
			},
			getList() { // 获取初始信息列表
				let that = this
				Request.get(Request.API.msgList, {
					"sessionId": this.sessionId,
					"chatType": this.chatType,
					"pageNum": this.pageNum,
					"pageSize": this.pageSize
				}).then(res => {
					console.log('获取初始信息列表', this.sessionId, this.chatType);
					if (res.data.code == 200) {
						let resData = res.data.rows.reverse()
						if (res.data.total > 0) {
							// let webView = that.$mp.page.$getAppWebview();
							// webView.setTitleNViewButtonStyle(0, {    
							//          text: '',    
							// });
							for (let i = 0; i < resData.length; i++) {
								if (['VOICE', 'FILE', 'VIDEO'].includes(String(resData[i].contentType))) {
									// resData[i].contentType == 'VOICE' || resData[i].contentType == 'FILE'
									// console.info(resData[i].content)
									try {
										JSON.parse(resData[i].content) // 如果不是json字符串就会抛异常
										// console.log('是');
										let temps = JSON.parse(resData[i].content)
										resData[i].content = temps
									} catch (e) {
										// console.log('否');
									}
								}
							}
						}
						that.isLoad = true
						that.listTotal = res.data.total
						that.msgList = resData;
						// console.info(that.msgList)
						that.$nextTick(function() {
							that.scrollToView = "scroll-" + (that.msgList.length - 1)
						});
					} else {
						// uni.showToast({title: '初始信息加载失败',icon: 'none',duration: 2000})
					}
				})
			},
			getInfo() { // 下拉刷新的数据
				let that = this
				Request.get(Request.API.msgList, {
					"sessionId": this.sessionId,
					"chatType": this.chatType,
					"pageNum": this.pageNum,
					"pageSize": this.pageSize
				}).then(res => {
					if (res.data.code == 200) {
						let resData = res.data.rows.reverse()
						for (var i = 0; i < resData.length; i++) {
							if (['VOICE', 'FILE', 'VIDEO'].includes(String(resData[i].contentType))) {
								// resData[i].contentType == 'VOICE' || resData[i].contentType == 'FILE'
								// console.info(resData[i].content)
								try {
									JSON.parse(resData[i].content) // 如果不是json字符串就会抛异常
									// console.log('是');
									let temps = JSON.parse(resData[i].content)
									resData[i].content = temps
								} catch (e) {
									// console.log('否');
								}
							}
						}
						that.listTotal = res.data.total
						that.isLoad = true
						that.msgList = resData;
					} else {
						// uni.showToast({title: '初始信息加载失败',icon: 'none',duration: 2000})
					}
				})
			},
			loadHistory(e) { //触发滑动到顶部(加载历史信息记录)
				console.info("触发刷新")
				if (this.pageSize <= this.listTotal) {
					this.isLoad = false
					this.pageSize = this.pageSize + 10
					this.getInfo();
				} else {
					this.isLoad = false
					//showLoading 需要用hideLoading来结束，一般网络请求封装中常用
					setTimeout(() => {
						this.isLoad = true
					}, 2000)

				}
			},
			getSessionDetail() { // 获取会话信息
				let that = this
				Request.get(Request.API.sessionDetail, {
					sessionId: this.sessionId
				}).then(res => {
					if (res.data.code == 200) {
						let resData = res.data.data
						that.sessionListDetail = resData
						this.selectImGroupById()
						console.info("会话", resData)
						if (that.fromId == resData.toId) {
							that.toId = resData.fromId
						} else {
							that.toId = resData.toId
						}
						console.info('toId是：', that.toId)
						this.selectPhoneByUserId(that.toId)
						that.chatType = resData.chatType
						that.groupId = resData.groupId
						if (this.sessionId != null) {
							this.getList();
						}

					} else {
						uni.showToast({
							title: '会话信息加载失败',
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			selectPhoneByUserId(userid) { // 获取手机号码
				Request.get(Request.API.selectPhoneByUserId, {
					userId: userid
				}).then(res => {
					if (res.data.code == 200) {
						this.phoneShow = res.data.msg
					} else {
						uni.showToast({
							title: '手机号码加载失败',
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			patriarchInfo(userId) { //跳到个人信息页
				// console.info(userId)
				uni.navigateTo({
					url: "../../contact/patriarchInfo?userId=" + userId + "&groupId=null"
				})
			},
			longpress(e, item, index, curIndex) { // 长摁时间
				this.longpressIndex = curIndex
				const MAX_RECALLABLE_TIME = 3 * 60 * 1000; //3分钟以内的消息才可以撤回
				let nowTimes = dateTime.dateFormatToDateLg()
				let creT = item.createTime.replace(new RegExp("-", "gm"), "/");
				nowTimes = nowTimes.replace(new RegExp("-", "gm"), "/");
				let startDateToDay = (new Date(nowTimes)).getTime(); //得到毫秒数
				let startDateCreateTime = (new Date(creT)).getTime(); //得到毫秒数
				// console.info("分钟以内的消息才可以撤回", item.createTime)
				// console.info(startDateToDay,startDateCreateTime,"是",MAX_RECALLABLE_TIME)
				if (startDateToDay - startDateCreateTime < MAX_RECALLABLE_TIME) {
					this.chehuiShow = index
				} else {
					this.chehuiShow = -1
				}
				this.pressValue = item
				this.popChoiceText = item
				console.info('popChoiceText', this.popChoiceText)
				this.showXY = e.touches[0]
				if (this.chehuiShow == 1) { // 1是右边消息
					this.rightView = e.touches[0].clientX - 85
				} else {
					this.rightView = e.touches[0].clientX - 65
				}
				this.topView = e.touches[0].pageY - 80
				this.islongPress = true;
				this.show = true
			},
			popChoice(item) { // 长摁显示窗口的点击事件
				console.info("长摁", item)
				if (item == 1) {
					this.show = false
					uni.setClipboardData({
						data: this.popChoiceText.content,
						success() {
							uni.showToast({
								title: '已复制到剪贴板',
								icon: 'none',
								position: 'top'
							})
						}
					})
				} else if (item == 2) {
					this.show = false
					console.log("删除", this.pressValue.id, this.pressValue.contentType);
					console.info(this.popChoiceText.id)
					this.msgList.splice(this.longpressIndex, 1)
					this.sendPopTo("DELETE_MSG", this.pressValue.id, this.pressValue.contentType);

				} else if (item == 3) {
					this.show = false
					console.log("撤回", this.pressValue);
					this.$set(this.msgList[this.longpressIndex], 'msgType', "RECALL_MSG")
					this.sendPopTo("RECALL_MSG", this.pressValue.id, this.pressValue.contentType);
				} else if (item == 4) {
					this.modalName = 'RadioModal'
				}
			},
			sendPopTo: function(imMsgType, content, contentType) { // 删除撤回事件的webSocket
				if (content == "") {
					return;
				}
				let that = this;

				let imMessage = {
					toId: this.toId,
					toIds: "",
					times: '',
					groupId: this.groupId,
					sessionId: this.sessionId,
					chatType: this.chatType,
					imMsgType: "TEXT",
					content: content,
					contentType: contentType,
					createTime: new Date(),
					fromId: this.userInfo.userId
				}
				let data = {
					code: imMsgType,
					imMessage: imMessage
				}

				// 发送给服务器消息
				this.$webSocket.send(JSON.stringify(data));
				console.log('提交', data)
			},
			scrollEvent(e) { // 监听滑动
				// console.log(e.detail.scrollTop)
				this.show = false
			},
			click(item) { // 是长摁还是点击事件的监听
				// console.info("事件", item)
				if (this.islongPress == false) {
					// console.log("不是长按事件");
					this.show = false

				} else if (this.islongPress == true) {
					// console.log("长按事件");
				}
			},
			touchend() { // 手抬起时
				this.show == false
				//延时执行为了防止 click() 还未判断 islongPress 的值就被置为 fasle
				setTimeout(() => {
					this.islongPress = false
					// this.show == false 
				}, 200)
			},
			updateMsgIsRead() { // 设置已读
				Request.post(Request.API.updateMsgIsRead, {
					sessionId: this.sessionId
				}).then(res => {})
			},
			changeTime(date, index) { // 聊天时间格式化
				// return dateTime.dateTime1(date);
				let num = index + 1
				let msgLength = this.msgList.length
				let Start = 0
				let End = this.toDateStr(date)
				if (num < msgLength) {
					Start = this.toDateStr(this.msgList[num].createTime)
					// console.info("空空空空空", date, index,msgLength)
					if (Start - End > 5 * 60 * 1000) {
						return dateTime.dateTime1(date);
					} else {
						if (num == this.msgList.length) {
							return dateTime.dateTime1(date);
						} else {
							return '';
						}
					}
				} else {
					// console.info("ssssssssssss", date, index, msgLength)
					return dateTime.dateTime1(date);
				}
			},
			toDateStr(date) { // 格式化日期
				return (new Date(date.replace(/-/g, "/"))).getTime();
			},
			previewImg(data, index) { // 进行图片的预览
				let photoList = []
				photoList.push(this.fileUrl + data)
				// 预览图片
				uni.previewImage({
					current: index,
					urls: photoList,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			playVoice(e) { //音频播放
				console.info("音频播放", e.content.url, e.id)
				if (this.voiceShowFlag) {
					this.audioPause()
				} else {
					this.onPlayVoice(this.fileUrl + e.content.url, e.id)
				}
			},
			audioPause() { // 语音暂停事件
				console.info(222222)
				this.innerAudioContext && this.innerAudioContext.pause(() => {
					console.log('录音暂停事件');
					this.voiceShowId = 0
					this.voiceShowFlag = false
				});
			},
			onPlayVoice(url, id) { // 语音播放事件
				this.innerAudioContext = uni.createInnerAudioContext();
				this.innerAudioContext.autoplay = true;
				this.innerAudioContext.src = url;
				this.innerAudioContext && this.innerAudioContext.play();
				this.innerAudioContext.onPlay(() => {
					console.log('开始播放', id);
					this.voiceShowId = id
					this.voiceShowFlag = true
				});
				this.innerAudioContext.onPause(() => {
					console.log('录音暂停事件');
					this.voiceShowId = 0
					this.voiceShowFlag = false
				});
				this.innerAudioContext.onStop(() => {
					console.log('录音停止事件，会回调文件地址');
					this.voiceShowFlag = false
					this.voiceShowId = 0
				});
				this.innerAudioContext.onEnded(() => { //播放结束
					console.log('录音播放结束');
					this.voiceShowFlag = false
					this.voiceShowId = 0
				});
				this.innerAudioContext.onError((res) => {
					console.log(res.errMsg);
					console.log(res.errCode);
				});
			},
			covers(e) { //地图定位
				let map = [{
					latitude: e.latitude,
					longitude: e.longitude,
					iconPath: '../../../static/logo.png'
				}]
				return (map);
			},
			openLocation(e) { //跳转地图信息
				uni.openLocation({
					latitude: e.latitude,
					longitude: e.longitude,
					name: e.name,
					address: e.address,
					success: function() {
						console.log('success');
					}
				});
			},
			inputs(e) { //发送
				console.info("//发送//发送//发送//发送//发送", this.dateFormat(Date.parse(new Date())))
				var imMessage = {
					toId: this.toId,
					toIds: "",
					times: e.times,
					groupId: this.groupId,
					sessionId: this.sessionId,
					chatType: this.chatType,
					imMsgType: "MSG",
					content: e.message,
					contentType: e.type,
					createTime: new Date(),
					fromId: this.userInfo.userId
				}
				var data = {
					code: "MSG",
					imMessage: imMessage
				}
				//临时数据，赋值给数据
				let tempData = {
					fromAvatar: this.userInfo.avatar,
					createTime: this.dateFormat(Date.parse(new Date())),
					content: e.message,
					contentType: e.type,
					msgType: "MSG",
					fromId: this.userInfo.userId
				}
				console.log(data)
				// 发送给服务器消息
				this.msgList.push(tempData);
				this.$nextTick(function() {
					this.scrollToView = "scroll-" + (this.msgList.length - 1)
				});
				this.$webSocket.send(JSON.stringify(data));

			},
			dateFormat(time) { // 日期格式化
				let date = new Date(time);
				let year = date.getFullYear();
				let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
				let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
				let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
				let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
				let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				// 拼接
				return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
			},
			heights(e) { //输入框高度
				// console.log("高度:", e)
				this.inputh = e;
				// this.goBottom();
			},
			goBottom() { // 滚动到底部
				this.scrollToView = '';
				this.$nextTick(function() {
					this.scrollToView = 'scroll-' + (this.msgList.length - 1)
				})
			},
			onOpenNameDoc(path = '') {
				if (!path) {
					return;
				}
				/* 打开文件 */
				this.$refs.lFile.open(path);
			},
			onOpenDoc(URL) {
				console.info(URL)
				let url = URL
				/* 下载返回临时路径（退出应用失效） */
				this.$refs.lFile.download({
						url
					})
					.then(path => {
						/* 打开附件 */
						this.$refs.lFile.open(path);
					}).catch(err => {
						uni.hideLoading()
						uni.showToast({
							title: err,
							icon: 'none',
						});
						console.log(err);
						return err
					});
			},
			changeKM(num) { // 文件大小换算
				let newNum = 0
				let newM = 0
				newNum = num / 1024
				newNum = Math.ceil(newNum)
				if (num > 1024) {
					if (newNum > 1024) {
						newM = newNum / 1024
						newM = Math.ceil(newM)
						return newM + "M"
					} else {
						return newNum + "K"
					}
				} else {
					return num + "b"
				}
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
				this.radio = ''
				this.reportContent = ''
				this.isInput = false
			},
			RadioChange(e) {
				console.log("radio", e.detail.value)
				if (e.detail.value == 'OTHER') {
					this.isInput = true
				} else {
					this.isInput = false
				}
				this.radio = e.detail.value
			},
			//提交举报
			submitReport() {
				let that = this
				Request.post(Request.API.chatReport, {
					userId: that.pressValue.fromId,
					content: that.pressValue.content,
					msgId: that.pressValue.id,
					type: that.radio,
					remark: that.reportContent
				}).then(res => {
					if (res.data.code == 200) {
						this.modalName = null
						uni.showToast({
							title: '举报提交成功！',
							icon: 'none',
							duration: 2000
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}
	.bt-img{
		width: 25px;
		height: 25px;
	}
	.content3 {
		position: relative;
		width: 45rpx;
		height: 45rpx;
		border-radius: 50%;
		background-color: #39b54a;
	}

	.content2 {
		position: relative;
		width: 45rpx;
		height: 45rpx;
		border-radius: 50%;
		background-color: rgb(255, 255, 255);
	}

	.common3 {
		position: absolute;
		left: 20%;
		top: 50%;
		border-top: 2px solid #39b54a;
		border-right: 2px solid #ffffff;
		border-bottom: 2px solid #39b54a;
		border-left: 2px solid #39b54a;
		border-radius: 50%;
		box-sizing: border-box;
	}

	.common2 {
		position: absolute;
		left: 20%;
		top: 50%;
		border-top: 2px solid rgb(255, 255, 255);
		border-right: 2px solid #000000;
		border-bottom: 2px solid rgb(255, 255, 255);
		border-left: 2px solid rgb(255, 255, 255);
		border-radius: 50%;
		box-sizing: border-box;
	}

	.min {
		margin-left: -4px;
		margin-top: -4px;
		border-top: 4px solid #39b54a;
		border-right: 4px solid #ffffff;
		border-bottom: 4px solid #39b54a;
		border-left: 4px solid #39b54a;

		/* animation-name animation-duration animation-timing-function animation-delay animation-iteration-count animation-direction */
	}

	.min2 {
		margin-left: -4px;
		margin-top: -4px;
		border-top: 4px solid rgb(255, 255, 255);
		border-right: 4px solid #000000;
		border-bottom: 4px solid rgb(255, 255, 255);
		border-left: 4px solid rgb(255, 255, 255);
	}

	.middle {
		width: 16px;
		height: 16px;
		margin-left: -8px;
		margin-top: -8px;
		animation: one 0.8s linear infinite 0.2s;
		opacity: 0;
	}

	.big {
		width: 24px;
		height: 24px;
		margin-left: -12px;
		margin-top: -12px;
		animation: one 0.8s linear infinite 0.4s;
		opacity: 0;
	}



	.middle_0 {
		width: 16px;
		height: 16px;
		margin-left: -8px;
		margin-top: -8px;
		/* animation: one 1s ease-in-out infinite 0.4s; */
	}

	.big_0 {
		width: 24px;
		height: 24px;
		margin-left: -12px;
		margin-top: -12px;
		/* animation: one 1s ease-in-out infinite 0.6s; */
	}

	@keyframes one {
		from {
			opacity: 0;
		}

		to {
			opacity: 1
		}
	}

	.avatarwrap {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: calc(100vh - var(--window-top));
	}

	.avatarwrap .scroll-box {
		flex: 1;
		overflow: scroll;
	}

	.voice-left {
		width: 16px;
		height: 16px;
		margin-bottom: 2px;
		content: url("../../../static/icon/voice-left.png");
		background-size: 100%;
	}

	.voice-right {
		width: 15px;
		height: 15px;
		content: url("../../../static/icon/voice-right.png");
		background-size: 100%;
	}

	.loadingVoice {
		width: 20px;
		// height: 10px;
	}

	.loadingVoice span {
		display: inline-block;
		width: 4px;
		height: 100%;
		border-radius: 4px;
		background: lightgreen;
		margin-left: 5rpx;
		-webkit-animation: load 1s ease infinite;
	}

	@-webkit-keyframes load {

		0%,
		100% {
			height: 14px;
			background: lightgreen;
		}

		50% {
			height: 18px;
			margin: -5px 0;
			background: lightblue;
		}
	}

	.popup {
		position: absolute;
		// right: 0%;
		z-index: 9999999;
		color: #fff;

	}

	.imgSizeLeft {
		max-width: 450rpx;
		// max-height: 450rpx;
		margin-top: 30rpx;
	}

	.popconten {
		background-color: #4a4a4a;
		padding: 10px;
		border-radius: 5px;
	}

	.popWith {
		width: 100rpx;
	}

	.popIconsize {
		font-size: 40rpx;
	}

	.popText {
		margin-top: 5rpx;
	}

	.h {
		width: 0px;
		height: 0px;
		border: 7px solid transparent;
		border-top-color: #4a4a4a;
	}

	.content {
		// height: 100%;
	}

	.cu-chat {
		.sys-message {
			justify-content: center;
			text-align: center;
			padding-top: 0px;
		}

		.left {
			.voice {
				text-align: left;

				.voice-img {
					float: right;
					// padding: 4rpx;
					width: 36rpx;
					height: 36rpx;
				}
			}

			.message {
				font-size: 32rpx;
				color: rgba(39, 40, 50, 1);
				line-height: 44rpx;
				padding: 18rpx 24rpx;
			}
		}

		.self {
			.voice {
				text-align: left;

				.voice-img {
					float: right;
					padding: 4rpx;
					width: 28rpx;
					height: 36rpx;
				}
			}

			.message {
				font-size: 32rpx;
				color: rgba(39, 40, 50, 1);
				line-height: 44rpx;
				padding: 18rpx 24rpx;
			}


		}
	}

	.chat {
		height: 100%;

		.chat-main {}
	}

	.non {
		display: none;
	}

	.content {
		word-break: break-all;
		word-wrap: break-word;
	}

	.cu-btn {
		background-color: #fff;
	}

	.cu-btn image {
		display: block;
		width: 50rpx;
		height: 50rpx;
	}

	.modelView-chat {
		background-color: #fff;
	}

	.modelView-chat .modelView {

		width: 94%;
		height: 100%;
		margin: 3% auto;
	}

	.iconView {
		margin-left: 20rpx;
		width: 18%;
		height: 20%;
		float: left;
		background-color: #fff;
	}

	.sss {

		margin-top: 30rpx;

	}

	.username {

		float: left;
		color: #999;
		height: 25rpx;
		margin-top: -10rpx;
		position: absolute;
		margin-left: 90rpx;
		font-size: 20rpx;
	}

	.iconView image {

		display: block;
		height: 100%;
		width: 20%;
		margin: 0rpx auto;
	}

	.iconView .title {
		text-align: center;
		font-size: 20rpx;
	}

	.cu-btn {
		background-color: #39B54A;
	}

	.chat-time {
		font-size: 24rpx;
		color: rgba(39, 40, 50, 0.3);
		line-height: 34rpx;
		padding: 10rpx 0rpx;
		text-align: center;
	}
</style>
